import { createContext, useContext, useState } from "react";
import { AlertTypes, IAlert } from "../utils/constants/models";
import classNames from "classnames";
import { XCircleIcon } from "@heroicons/react/outline";
import { Transition } from "@headlessui/react";
import { BellIcon, CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/solid";

interface IAlertContext {
	addAlert: (alert: IAlert) => void;
}
export const AlertContext = createContext<IAlertContext>({
	addAlert: () => { },
});

export const useAlert = () => useContext(AlertContext);

export const AlertsProvider = ({ children }: any) => {
	const [alerts, setAlert] = useState<Array<IAlert>>([]);

	const onAlertHide = (id: string) => {
		setAlert(p => p.map(x => x.id !== id
			? x
			: {
				...x,
				show: false
			})
		);
		setTimeout(() => {
			setAlert(p => p.filter(x => x.id !== id));
		}, 400);
	};

	const addAlert = (alert: IAlert) => {
		setAlert(p => [...p, {
			...alert,
			id: new Date()
				.getTime()
				.toString()
		}]);
	};

	return (
		<AlertContext.Provider value={{ addAlert }}>
			{
				children
			}
			{
				alerts.length > 0
					? (
						<div className="absolute top-2 left-2 right-2 flex flex-col gap-2 max-w-full md:max-w-md ml-auto z-50">
							{alerts.map(x => (
								<Transition
									appear
									show={x.show}
									key={x.id}
									role="alert"
									className={classNames("relative py-3 pl-10 pr-10 leading-normal rounded-lg", {
										"text-red-500 bg-red-100": x.type === AlertTypes.Error,
										"text-yellow-500 bg-yellow-100": x.type === AlertTypes.Warning,
										"text-green-500 bg-green-100": x.type === AlertTypes.Success
									})}
									enter="ease-out duration-300"
									enterFrom="opacity-0"
									enterTo="opacity-100"
									leave="ease-in duration-200"
									leaveFrom="opacity-100"
									leaveTo="opacity-0"	>
									{
										x.type === AlertTypes.Success
											? (
												<CheckCircleIcon
													className="w-4 h-4 absolute top-4 left-3 flex items-center"
													role="button" />
											)
											: x.type === AlertTypes.Error
												? (
													<ExclamationCircleIcon
														className="w-4 h-4 absolute top-4 left-3 flex items-center"
														role="button" />
												)
												: (
													<BellIcon
														className="w-4 h-4 absolute top-4 left-3 flex items-center"
														role="button" />
												)
									}
									{x.title && <span className="font-bold mr-0.5">{x.title}</span>}
									<p>{x.message}</p>
									<XCircleIcon
										onClick={() => onAlertHide(x.id || x.title)}
										className="w-5 h-5 absolute top-3 right-4 flex items-center"
										role="button" />
								</Transition>
							))}
						</div>
					)
					: null
			}
		</AlertContext.Provider>
	);
};