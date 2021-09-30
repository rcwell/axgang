import { Dialog, Listbox, Transition } from "@headlessui/react";
import { AcademicCapIcon, BanIcon, PencilAltIcon } from "@heroicons/react/outline";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { Fragment, useMemo, useState } from "react";
import { useData } from "../../../contexts/dataContext";
import { DeviceType, useGetDeviceType } from "../../../hooks/useGetDeviceType";
import { IUser, UserTypes } from "../../../utils/constants/models";
import { UserForm, UserFormMethod } from "../../Components/Overlays";
import cx from 'classnames';

export const Users = () => {
	const [selectedManager, setSelecterManager] = useState<IUser | null>(null);
	const [show, setShow] = useState<UserTypes | null>(null);
	const [search, setSearch] = useState(String);
	const [modalForm, setModalForm] = useState<{
		user: IUser | undefined,
		method: UserFormMethod | undefined,
		open: boolean
	}>({
		user: undefined,
		method: undefined,
		open: false
	});

	const { users, managers } = useData();
	const device = useGetDeviceType();
	const userAccounts = useMemo(() => {
		let _users = [...users];

		if (show) {
			_users = _users.filter(({ type }) => type === show);
		}

		if (selectedManager) {
			_users = _users.filter(({ managerId }) => managerId === selectedManager.id);
		}

		if (search) {
			_users = _users.filter((user) => {
				const manager = managers.find(({ id }) => id === user.managerId);
				return JSON.stringify(Object.values({
					...user,
					managerName: manager?.name ?? "",
				}))
					.toLowerCase()
					.includes(search);

			});
		}

		return _users;
	}, [users, show, selectedManager, search]);

	const onAddUser = () => setModalForm({
		user: undefined,
		method: UserFormMethod.ADD,
		open: true
	});
	const onEditUser = (user: IUser) =>
		setModalForm({
			user,
			method: UserFormMethod.EDIT,
			open: true
		});
	const resetForm = () => setModalForm(p => ({
		...p,
		open: false
	}));

	return (
		<Fragment>
			<div className="mx-4 mt-4 w-full flex flex-col gap-4">
				<div className={"flex justify-between flex-col md:flex-row gap-4"}>
					<input
						type="text"
						autoComplete="off"
						placeholder="Search"
						onKeyUp={event => setSearch((event.target as any).value)}
						className={"appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:max-w-xs"} />
					<div className="flex justify-between flex-col md:flex-row gap-4">
						<Listbox
							value={show}
							onChange={item => {
								setShow(item);
							}}>
							<div className="relative mt" style={{ minWidth: 120 }}>
								<Listbox.Button className={"relative w-full py-2 pl-3 pr-10 text-left bg-white border rounded"}>
									<span className={`block truncate capitalize`}>{show ?? 'Show (All)'}</span>
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
										<Listbox.Option
											className={"cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-blue-50"}
											value={null}>
											<>
												<span className={`${show === null ? 'font-medium text-blue-600' : 'font-normal'} block truncate`}>
													All
												</span>
												{show === null ? (
													<span className={`text-blue-600 absolute inset-y-0 left-0 flex items-center pl-3`}>
														<CheckIcon className="w-5 h-5" aria-hidden="true" />
													</span>
												) : null}
											</>
										</Listbox.Option>
										<Listbox.Option
											className={"cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-blue-50"}
											value={UserTypes.SCHOLAR}>
											{({ selected }) => (
												<>
													<span className={`${selected ? 'font-medium text-blue-600' : 'font-normal'} block truncate`}>
														Scholar
													</span>
													{selected ? (
														<span className={`text-blue-600 absolute inset-y-0 left-0 flex items-center pl-3`}>
															<CheckIcon className="w-5 h-5" aria-hidden="true" />
														</span>
													) : null}
												</>
											)}
										</Listbox.Option>
										<Listbox.Option
											className={"cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-blue-50"}
											value={UserTypes.MANAGER}>
											{({ selected }) => (
												<>
													<span className={`${selected ? 'font-medium text-blue-600' : 'font-normal'} block truncate`}>
														Manager
													</span>
													{selected ? (
														<span className={`text-blue-600 absolute inset-y-0 left-0 flex items-center pl-3`}>
															<CheckIcon className="w-5 h-5" aria-hidden="true" />
														</span>
													) : null}
												</>
											)}
										</Listbox.Option>
									</Listbox.Options>
								</Transition>
							</div>
						</Listbox>
						<Listbox
							disabled={show === UserTypes.MANAGER}
							value={selectedManager}
							onChange={item => {
								setSelecterManager(item);
							}}>
							<div className="relative mt" style={{ minWidth: 100 }}>
								<Listbox.Button className={cx("relative w-full py-2 pl-3 pr-10 text-left bg-white border rounded", {
									'bg-gray-100 cursor-not-allowed': show === UserTypes.MANAGER
								})}>
									<span className={`block truncate`}>{selectedManager?.name ?? "Manager (All)"}</span>
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
										<Listbox.Option
											className={"cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-blue-50"}
											value={null}>
											<>
												<span className={`${selectedManager === null ? 'font-medium text-blue-600' : 'font-normal'} block truncate`}>
													All
												</span>
												{selectedManager === null ? (
													<span className={`text-blue-600 absolute inset-y-0 left-0 flex items-center pl-3`}>
														<CheckIcon className="w-5 h-5" aria-hidden="true" />
													</span>
												) : null}
											</>
										</Listbox.Option>
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
					</div>
				</div>
				<div className="bg-white border border-gray-100 rounded-lg w-full">
					<div className="flex items-center py-4 px-6  gap-4">
						<div className="bg-blue-400 rounded-md h-8 w-8 flex items-center justify-center">
							<AcademicCapIcon className="h-5 w-5 text-white" />
						</div>
						<h4 className="font-bold text-lg uppercase">Users</h4>
						<button
							onClick={onAddUser}
							className="bg-blue-400 hover:bg-blue-600 text-white text-xs font-bold py-2 px-4 rounded ml-auto">Add {device !== DeviceType.Mobile ? "User" : ""}</button>
					</div>
					<table className="text-left w-full border-collapse">
						<thead>
							<tr className="bg-gray-50">
								<th className="py-2 px-3 font-bold uppercase text-xs text-gray-500">Name</th>
								<th className="py-2 px-3 font-bold uppercase text-xs text-gray-500">Team</th>
								<th className="py-2 px-3 hidden md:table-cell font-bold uppercase text-xs text-gray-500">Email</th>
								<th className="py-2 px-3 font-bold uppercase text-xs text-gray-500">Manager</th>
								<th className="py-2 px-3 hidden md:table-cell font-bold uppercase text-xs text-gray-500">Address</th>
								<th className="py-2 px-3 hidden md:table-cell font-bold uppercase text-xs text-gray-500"
									style={{
										width: 80,
										maxWidth: 80
									}}>Action</th>
								<th className="py-2 px-3 md:hidden table-cell font-bold uppercase text-xs text-gray-500"
									style={{
										width: 70,
										maxWidth: 70
									}}>Action</th>
							</tr>
						</thead>
						<tbody>
							{
								userAccounts.map(user => (
									<tr key={user.id} className="hover:bg-blue-50 cursor-pointer">
										<td className={'py-2  px-3 border-b border-gray-50 border-grey-light'}>
											{user.name ?? "-"}
										</td>
										<td className={'py-2  px-3 border-b border-gray-50 border-grey-light'}>
											{user.team ?? "-"}
										</td>
										<td className="py-2 hidden md:table-cell px-3 border-b border-gray-50 border-grey-light">
											{user.email ?? "-"}
										</td>
										<td className="py-2 px-3 border-b border-gray-50 border-grey-light">
											{user.managerId
												? managers.find(({ id }) => id === user.managerId)?.name
												: "-"}
										</td>
										<td className="py-2 hidden md:table-cell px-3 border-b border-gray-50 border-grey-light">
											{user.address ?? "-"}
										</td>
										<td className="py-2 hidden md:table-cell px-3 border-b border-gray-50 border-grey-light"
											style={{
												width: 80,
												maxWidth: 80
											}}>
											<div className={"flex flex-row gap-2"}>
												<PencilAltIcon
													className="h-6 w-6 text-gray-400 p-1  cursor-pointer hover:text-blue-400"
													onClick={() => onEditUser(user)} />
												<BanIcon
													className="h-6 w-6 text-gray-400 p-1  cursor-pointer hover:text-blue-400"
													onClick={() => { }} />
											</div>
										</td>
										<td className="py-2 md:hidden table-cell px-3 border-b border-gray-50 border-grey-light">
											<div className={"flex flex-row gap-2"}>
												<PencilAltIcon
													className="h-6 w-6 m-auto text-gray-400 p-1 rounded-sm cursor-pointer hover:bg-blue-400 hover:text-gray-100"
													onClick={() => onEditUser(user)} />
											</div>
										</td>
									</tr>
								))
							}
						</tbody>
					</table>
				</div>
				<div className="py-2"></div>
			</div>

			<Transition appear show={modalForm.open} as={Fragment}>
				<Dialog
					as="div"
					className="fixed inset-0 z-10 overflow-y-auto"
					onClose={resetForm}>
					<div className="min-h-screen px-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100"
							leaveTo="opacity-0">
							<Dialog.Overlay className="fixed inset-0 bg-blue-900 bg-opacity-30" />
						</Transition.Child>
						<span
							className="inline-block h-screen align-middle"
							aria-hidden="true">
							&#8203;
						</span>
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95">
							<div className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
								<UserForm
									onCancel={resetForm}
									onSuccess={resetForm}
									method={modalForm.method}
									userAccount={modalForm.user} />
							</div>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
		</Fragment>
	);
};