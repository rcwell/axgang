import { Dialog, Transition } from "@headlessui/react";
import { AcademicCapIcon } from "@heroicons/react/outline";
import { Fragment, useContext, useState } from "react";
import { AlertTypes } from "../../../utils/constants/models";
import { AlertContext, ScholarForm } from "../../Components/Overlays";

export const Scholars = () => {
	const [addScholar, setAddScholar] = useState(Boolean);
	const { addAlert } = useContext(AlertContext);

	const onAddScholar = () => {
		setAddScholar(true);
	};

	return (
		<Fragment>
			<div className="mx-4 mt-4 w-full">
				<div className="bg-white border border-gray-100 rounded-lg w-full">
					<div className="flex items-center py-4 px-6  gap-4">
						<div className="bg-blue-400 rounded-xl h-10 w-10 flex items-center justify-center">
							<AcademicCapIcon className="h-5 w-5 text-white" />
						</div>
						<h4 className="font-bold text-lg uppercase">Scholars</h4>
						<button
							onClick={onAddScholar}
							className="bg-blue-400 hover:bg-blue-600 text-white text-xs font-bold py-2 px-4 rounded ml-auto">Add Scholar</button>
					</div>
					<table className="text-left w-full border-collapse">
						<thead>
							<tr className="bg-gray-50">
								<th className="py-2 px-6  w-1/4 font-bold uppercase text-xs text-gray-500">Name</th>
								<th className="py-2 px-6  w-1/4 font-bold uppercase text-xs text-gray-500">Email</th>
								<th className="py-2 px-6  w-1/4 font-bold uppercase text-xs text-gray-500">Manager</th>
								<th className="py-2 px-6  w-1/4 font-bold uppercase text-xs text-gray-500">Action</th>
							</tr>
						</thead>
						<tbody>
							{
								Array(100)
									.fill(0)
									.map((_, index) => {
										return (
											<tr key={index} className="hover:bg-blue-50 cursor-pointer">
												<td className={'py-2 w-1/4  px-6 border-b border-gray-50 border-grey-light'}>
													{"Hey"}
												</td>
												<td className="py-2 w-1/4  px-6 border-b border-gray-50 border-grey-light">
													{"Hey"}
												</td>
												<td className="py-2 w-1/4  px-6 border-b border-gray-50 border-grey-light">
													{"Hey"}
												</td>
												<td className="py-2 w-1/4  px-6 border-b border-gray-50 border-grey-light">
													{"Hey"}
												</td>
											</tr>
										);
									})
							}
						</tbody>
					</table>
				</div>
				<div className="py-2"></div>
			</div>

			<Transition appear show={addScholar} as={Fragment}>
				<Dialog
					as="div"
					className="fixed inset-0 z-10 overflow-y-auto"
					onClose={() => setAddScholar(false)}>
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
								<ScholarForm
									onCancel={() => setAddScholar(false)}
									onOk={() => {
										setAddScholar(false);
										addAlert({
											title: "Add Scholar",
											message: "Scholar has been successfully added!",
											type: AlertTypes.Success,
											show: true,
											id: new Date()
												.getTime()
												.toString()
										});
									}} />
							</div>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
		</Fragment>
	);
};