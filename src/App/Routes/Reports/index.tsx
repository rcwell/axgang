import { Dialog, Transition } from "@headlessui/react";
import { AcademicCapIcon } from "@heroicons/react/outline";
import { Fragment, useMemo, useState } from "react";
import { useData } from "../../../contexts/dataContext";
import { DeviceType, useGetDeviceType } from "../../../hooks/useGetDeviceType";
import { ReportForm } from "../../Components/Overlays";
import { ISlp } from "../../../utils/constants/models/slp";
import moment from "moment";

export const Reports = () => {
	const [modalForm, setModalForm] = useState<{
		slpData: ISlp | undefined,
		open: boolean
	}>({
		slpData: undefined,
		open: false
	});

	const { users, slpData } = useData();
	const device = useGetDeviceType();
	const userAccounts = useMemo(() => {
		let _users = [...users];
		return _users;
	}, [users]);

	const onAddReport = () => setModalForm({
		slpData: undefined,
		open: true
	});
	const resetForm = () => setModalForm(p => ({
		...p,
		open: false
	}));

	const latestEntry = useMemo(() => {
		return moment(slpData.pop()?.datetime);
	}, [slpData]);

	return (
		<Fragment>
			<div className="mx-4 mt-4 w-full flex flex-col gap-4">
				<div className="bg-white border border-gray-100 rounded-lg w-full">
					<div className="flex items-center py-4 px-6  gap-4">
						<div className="bg-blue-400 rounded-md h-8 w-8 flex items-center justify-center">
							<AcademicCapIcon className="h-5 w-5 text-white" />
						</div>
						<h4 className="font-bold text-lg uppercase">Reports</h4>
						<button
							onClick={onAddReport}
							className="bg-blue-400 hover:bg-blue-600 text-white text-xs font-bold py-2 px-4 rounded ml-auto">Add {device !== DeviceType.Mobile ? "Report" : ""}</button>
					</div>
					<table className="text-left w-full border-collapse">
						<thead>
							<tr className="bg-gray-50">
								<th className="py-2 px-3 font-bold uppercase text-xs text-gray-500">SLP</th>
								<th className="py-2 px-3 font-bold uppercase text-xs text-gray-500">Date Time</th>
							</tr>
						</thead>
						<tbody>
							{
								slpData.map((slp) => (
									<tr key={slp.id} className="hover:bg-blue-50 cursor-pointer">
										<td className={'py-2  px-3 border-b border-gray-50 border-grey-light'}>
											{slp.count ?? "—"}
										</td>
										<td className={'py-2  px-3 border-b border-gray-50 border-grey-light'}>
											{slp.datetime
												? moment(slp.datetime)
													.format('lll')
												: "—"}
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
							<div className="inline-block w-full max-w-md my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl overflow-visible">
								<ReportForm
									onCancel={resetForm}
									onSuccess={resetForm}
									todaysReportAdded={latestEntry.isSame(moment(), 'day')} />
							</div>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
		</Fragment>
	);
};