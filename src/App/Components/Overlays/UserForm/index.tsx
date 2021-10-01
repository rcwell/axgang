import cx from 'classnames';
import { Listbox, Switch, Transition } from '@headlessui/react';
import { AcademicCapIcon } from '@heroicons/react/outline';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { Fragment, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useOnClickOutside } from '../../../../hooks/onClickOutside';
import { emailValidator } from '../../../../utils/constants/rgx';
import { useData } from '../../../../contexts/dataContext';
import { useAlert } from '../../../../contexts/alertContext';
import { AlertTypes, ICredentials, IUser, UserTypes } from '../../../../utils/constants/models';

export enum UserFormMethod {
	ADD = 'Add',
	EDIT = 'Edit',
	VIEW = 'View'
}
interface UserFormProps {
	onCancel: () => void;
	onSuccess: () => void;
	method?: UserFormMethod;
	userAccount?: IUser;
}
type IForm<T = string, K = UserTypes> = Omit<IUser<T, K>, 'managerId' | 'passwordChanged'> & Partial<Omit<ICredentials<T>, 'email'>>

export const UserForm = ({
	onCancel,
	onSuccess,
	method,
	userAccount
}: UserFormProps) => {
	const formRef = useRef<HTMLFormElement>(null);
	const [isAdding, setIsAdding] = useState(Boolean);
	const [manager, setManager] = useState<IUser | null>(null);

	const [form, setForm] = useState<IForm>(Object);
	const [errors, setErrors] = useState<IForm<boolean, boolean> & { managerId: boolean }>(Object);
	const [isScholar, setIsScholar] = useState(true);

	const { addAlert } = useAlert();
	const { addPerson, updatePerson, managers } = useData();

	useOnClickOutside(formRef, onCancel);

	useEffect(() => {
		if (userAccount) {
			const { managerId, ...user } = userAccount;
			const userManager = managers.find(({ id }) => id === userAccount.managerId);
			setManager(userManager ?? null);
			setIsScholar(userAccount.type === UserTypes.SCHOLAR);
			setForm(user);
		} else {
			resetForm();
		}
	}, [userAccount]);

	const validateForm = () => {
		return [
			'email',
			'name',
			'team',
			'address',
			'managerId',
			'type',
			...(method === UserFormMethod.ADD ? ['password'] : [])
		].reduce((err, key) => {
			const value = { ...form }[key] || "";
			let safe = value !== "";

			if (key === "address" && safe) {
				safe = /^(0x[0-9a-zA-Z]{40})$/.test(value);
			}

			if (key === "email" && safe) {
				safe = emailValidator.test(String(value)
					.toLowerCase());
			}

			if (key === "managerId" && !isScholar) {
				safe = true;
			}

			return {
				...err,
				[key]: !safe
			};
		}, {
			email: false,
			password: false,
			name: false,
			team: false,
			type: false,
			address: false,
			managerId: false,
		});
	};

	const handleOnSubmit = async () => {
		setIsAdding(true);
		const validationResult = validateForm();

		if (Object
			.values(validationResult)
			.filter(x => x)
			.length === 0) {

			let success = false;
			const { password, id, ...rest } = form;

			if (method === UserFormMethod.ADD) {
				success = await addPerson?.({
					...rest,
					managerId: manager?.id ?? '',
					password: form.password ?? '',
					type: isScholar ? UserTypes.SCHOLAR : UserTypes.MANAGER
				});
			} else {
				success = await updatePerson?.({
					...rest,
					id: id ?? ''
				});
			}

			if (success) {
				addAlert({
					title: "Success",
					message: `User successfully ${method === UserFormMethod.ADD ? 'registered' : 'updated'}`,
					type: AlertTypes.Success,
					show: true,
				});
			} else {
				addAlert({
					title: "Failed",
					message: "Something went wrong creating a new scholar",
					type: AlertTypes.Error,
					show: true,
				});
			}
			onSuccess();
			resetForm();
			setIsAdding(false);
			return;
		}

		setErrors(validationResult);
		setIsAdding(false);
	};

	const handleOnChange = (key: keyof typeof form) => (event: KeyboardEvent<HTMLInputElement>) => {
		const { currentTarget: { value } } = event;
		setForm((p) => ({
			...p,
			[key]: value
		}));
		setErrors((p: any) => ({
			...p,
			[key]: value === ""
		}));
	};

	const resetForm = () => {
		setForm({
			name: '',
			email: '',
			password: '',
			team: '',
			address: '',
			type: UserTypes.SCHOLAR
		});
		setManager(null);
		setIsScholar(true);
	};

	return (
		<form ref={formRef} className="text-left w-full">
			<div className="flex flex-col px-4 pt-5">
				<div className="flex flex-row items-center gap-2">
					<div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 ">
						<AcademicCapIcon className="h-6 w-6 text-blue-600" />
					</div>
					<h3 className="text-lg leading-6 font-medium text-gray-900">
						{method} User
					</h3>
					<div className="relative ml-auto flex flex-row items-center gap-3">
						<label className="block text-gray-400 text-sm" htmlFor="Manager">
							As Scholar
						</label>
						<Switch
							checked={isScholar}
							onChange={(state) => {
								setIsScholar(state);
								if (!state) {
									setForm(p => ({
										...p,
										managerId: ''
									}));
									setManager(null);
								}
							}}
							className={`${isScholar ? 'bg-blue-600' : 'bg-gray-200'} relative transition-all inline-flex items-center h-6 rounded-full w-11`}>
							<span className={`${isScholar ? 'translate-x-6' : 'translate-x-1'} transition-all inline-block w-4 h-4 transform bg-white rounded-full`} />
						</Switch>
					</div>
				</div>
				<div className="w-full pt-4 pb-4">
					{isScholar && <div className="relative mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Manager">
							Manager
						</label>
						<Listbox
							value={manager}
							onChange={item => {
								setManager(item);
								setForm((p) => ({
									...p,
									managerId: item?.id || ""
								}));

								if (errors.managerId) {
									setErrors((p: any) => ({
										...p,
										managerId: (item?.id || "") === ""
									}));
								}
							}}>
							<div className="relative mt">
								<Listbox.Button className={cx("relative w-full py-2 pl-3 pr-10 text-left bg-white border rounded", {
									"border-red-500 ": errors.managerId
								})}>
									<span className={`block truncate ${manager?.name ? "" : ""}`}>{manager?.name || "Select Manager"}</span>
									<span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
										<SelectorIcon
											className="w-5 h-5 text-gray-400"
											aria-hidden="true" />
									</span>
								</Listbox.Button>
								<Transition
									as={Fragment}
									leave="transition ease-in duration-100"
									leaveFrom="opacity-100"
									leaveTo="opacity-0">
									<Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
										{managers.map((manager) => (
											<Listbox.Option
												key={manager.id}
												className={"cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-blue-50"}
												value={manager}>
												{({ selected }) => (
													<>
														<span className={`${selected ? 'font-medium text-blue-600' : 'font-normal'} block truncate`}>
															{manager.name}
														</span>
														{selected ? (
															<span className={`text-blue-600 absolute inset-y-0 left-0 flex items-center pl-3`}>
																<CheckIcon className="w-5 h-5" aria-hidden="true" />
															</span>
														) : null}
													</>
												)}
											</Listbox.Option>
										))}
									</Listbox.Options>
								</Transition>
							</div>
						</Listbox>
						{errors.managerId && (
							<p className="text-red-500 text-xs italic absolute">Please assign a manager.</p>
						)}
					</div>}

					<div className="mb-4 relative">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
							Name
						</label>
						<input
							onKeyUp={handleOnChange('name')}
							autoComplete="off"
							type="text"
							defaultValue={form.name ?? ''}
							placeholder="Name"
							className={cx("appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline", {
								"border-red-500 ": errors.name
							})} />
						{errors.name && (
							<p style={{ bottom: -4 }} className="text-red-500 text-xs italic absolute">Please enter valid name.</p>
						)}
					</div>
					<div className="mb-4 relative">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
							Team
						</label>
						<input
							onKeyUp={handleOnChange('team')}
							autoComplete="off"
							type="text"
							placeholder="Team"
							defaultValue={form.team ?? ""}
							className={cx("appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline", {
								"border-red-500 ": errors.team
							})} />
						{errors.team && (
							<p style={{ bottom: -4 }} className="text-red-500 text-xs italic absolute">Please enter valid team.</p>
						)}
					</div>
					<div className="mb-4 relative">
						<label className="block text-gray-700 text-sm font-bold" htmlFor="address">
							Wallet Address
						</label>
						<input
							onKeyUp={handleOnChange('address')}
							autoComplete="off"
							maxLength={42}
							id="address"
							type="text"
							defaultValue={form.address ?? ''}
							placeholder="0x0000..."
							className={cx("appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline", {
								"border-red-500 ": errors.address
							})} />
						{errors.address && (
							<p style={{ bottom: -4 }} className="text-red-500 text-xs italic absolute">Please enter a valid Wallet Address.</p>
						)}
					</div>
					<div className="mb-4 relative">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
							Email
						</label>
						<input
							onKeyUp={handleOnChange('email')}
							autoComplete="off"
							type="text"
							defaultValue={form.email ?? ''}
							disabled={method === UserFormMethod.EDIT}
							placeholder="Email"
							className={cx("appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline", {
								"border-red-500 ": errors.email
							})} />
						{errors.email && (
							<p style={{ bottom: -4 }} className="text-red-500 text-xs italic absolute">Please enter valid email.</p>
						)}
					</div>
					{
						method === UserFormMethod.ADD && (
							<div className="mb-4 relative">
								<label className="block text-gray-700 text-sm font-bold" htmlFor="password">
									Password
									<i className="ml-1 text-gray-400 text-xs italic">(Mandatory password change on first login)</i>
								</label>
								<input
									onKeyUp={handleOnChange('password')}
									autoComplete="off"
									type="password"
									defaultValue={form.password ?? ''}
									placeholder="Temporary Password"
									className={cx("appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline", {
										"border-red-500 ": errors.password
									})} />
								{errors.password && (
									<p style={{ bottom: -4 }} className="text-red-500 text-xs italic absolute">Please enter a password.</p>
								)}
							</div>
						)
					}
				</div>
			</div>
			<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
				<button onClick={handleOnSubmit} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
					{
						isAdding
							? "Saving"
							: "Save"
					}
				</button>
				<button type="button" onClick={onCancel} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
					Cancel
				</button>
			</div>
		</form>
	);
};