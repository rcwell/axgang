import { AcademicCapIcon } from '@heroicons/react/outline';
import { KeyboardEvent, useContext, useRef, useState } from 'react';
import cx from 'classnames';
import { IUser, IUserCredentials } from '../../../../utils/constants/user';
import { useOnClickOutside } from '../../../../hooks/onClickOutside';
import { firebaseAuth } from '../../../../utils/firebase';
import { AlertContext } from '..';
import { AlertTypes } from '../../../../utils/constants/models/alert';

interface ScholarFormProps {
	onOk: (user: IUser) => void;
	onCancel: () => void;
}

export const ScholarForm = (props: ScholarFormProps) => {
	const formRef = useRef<HTMLFormElement>(null);
	const [credentials, setCredentials] = useState<IUserCredentials<string> & { ManagerId: string, WalletId: string }>(Object);
	const [errors, setErrors] = useState<IUserCredentials<boolean> & { ManagerId: boolean, WalletId: boolean }>(Object);
	const [isAdding, setIsAdding] = useState(Boolean);

	useOnClickOutside(formRef, props.onCancel);
	const alertCtx = useContext(AlertContext);

	const handleOnSubmit = () => {
		const _errors: IUserCredentials<boolean> & { ManagerId: boolean, WalletId: boolean } = ["Email", "ManagerId", "Password", "WalletId"]
			.reduce((err, key) => {
				const value = { ...credentials }[key] || "";
				let safe = value !== "";

				if (key === "WalletId" && safe) {
					safe = /^(0x[0-9]{11})$/.test(value);
				}

				return {
					...err,
					[key]: !safe
				};
			}, {
				Email: false,
				ManagerId: false,
				Password: false,
				WalletId: false
			});

		if (!_errors.ManagerId
			&& !_errors.Email
			&& !_errors.Password
			&& !_errors.WalletId) {

			setIsAdding(true);

			return firebaseAuth
				.createUserWithEmailAndPassword(credentials.Email, credentials.Password)
				.then((res) => {
					console.log({ res });
				})
				.catch((error) => {
					console.log({ error });
					alertCtx.addAlert({
						title: error.code || "",
						message: error.message,
						type: AlertTypes.Error,
						show: true,
						id: new Date()
							.getTime()
							.toString()
					});
				})
				.finally(() => {
					setIsAdding(false);
				});
		}

		setErrors(_errors);
	};

	const handleOnChange = (event: KeyboardEvent<HTMLInputElement>) => {
		const { currentTarget: { id, value } } = event;
		setCredentials(p => ({
			...p,
			[id]: value
		}));
		setErrors(p => ({
			...p,
			[id]: value === ""
		}));
	};

	return (
		<form ref={formRef} className="text-left w-full">
			<div className="flex flex-col px-4 pt-5">
				<div className="flex flex-row items-center gap-2">
					<div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 ">
						<AcademicCapIcon className="h-6 w-6 text-blue-600" />
					</div>
					<h3 className="text-lg leading-6 font-medium text-gray-900">
						Add Scholar
					</h3>
				</div>
				<div className="w-full pt-4 pb-4">
					<div className="relative">
						<label className="block text-gray-700 text-sm font-bold" htmlFor="Manager">
							Manager
						</label>
						<input
							onKeyUp={handleOnChange}
							autoComplete="off"
							id="ManagerId"
							type="text"
							placeholder="Manager"
							className={cx("appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline", {
								"border-red-500 ": errors.ManagerId
							})} />
						{errors.ManagerId && (
							<p style={{ bottom: -4 }} className="text-red-500 text-xs italic absolute">Please assign a manager.</p>
						)}
					</div>
					<div className="relative">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Email">
							Email
						</label>
						<input
							onKeyUp={handleOnChange}
							autoComplete="off"
							id="Email"
							type="text"
							placeholder="Email"
							className={cx("appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline", {
								"border-red-500 ": errors.Email
							})} />
						{errors.Email && (
							<p style={{ bottom: -4 }} className="text-red-500 text-xs italic absolute">Please enter valid email.</p>
						)}
					</div>
					<div className="relative">
						<label className="block text-gray-700 text-sm font-bold" htmlFor="Password">
							Password
						</label>
						<input
							onKeyUp={handleOnChange}
							autoComplete="off"
							id="Password"
							type="password"
							placeholder="Password"
							className={cx("appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline", {
								"border-red-500 ": errors.Password
							})} />
						{errors.Password && (
							<p style={{ bottom: -4 }} className="text-red-500 text-xs italic absolute">Please enter a password.</p>
						)}
					</div>
					<div className="mb-4 relative">
						<label className="block text-gray-700 text-sm font-bold" htmlFor="Password">
							Wallet Address
						</label>
						<input
							onKeyUp={handleOnChange}
							autoComplete="off"
							maxLength={13}
							id="WalletId"
							type="text"
							placeholder="0x00000000000"
							className={cx("appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline", {
								"border-red-500 ": errors.WalletId
							})} />
						{errors.WalletId && (
							<p style={{ bottom: -4 }} className="text-red-500 text-xs italic absolute">Please enter a valid Wallet Address.</p>
						)}
					</div>
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
				<button type="button" onClick={props.onCancel} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
					Cancel
				</button>
			</div>
		</form>
	);
};