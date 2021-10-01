import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { useMemo, useState } from "react";
import { axies_query, axie_info, static_variables } from '../../../utils/constants/queries';
import { Transition, Dialog } from '@headlessui/react';
import { Fragment } from 'react';
import { AbilityCard, AxieCard } from "../../Components/UI";
import { useData } from "../../../contexts/dataContext";

export const Axies = () => {
	const { walletAddress } = useData();
	const [showAxieInfo, setShowAxieInfo] = useState(Boolean);
	const [getAxie, axieInfoMeta] = useLazyQuery(gql`${axie_info}`);

	const { loading, data } = useQuery(gql`${axies_query}`, {
		variables: {
			...static_variables,
			roninAddress: walletAddress,
		}
	});

	const axies = useMemo(() => data ? data.axies.results : [], [data]);
	const selected_axie = useMemo(() => axieInfoMeta.data?.axie, [axieInfoMeta]);
	const selected_axie_abilities = useMemo(() => {
		if (selected_axie) {
			return selected_axie.parts
				.map((part: any) => part.abilities)
				.flat();
		}
		return [];
	}, [selected_axie]);

	const onAxieClick = (axieId: string) => {
		getAxie({ variables: { axieId } });
		setShowAxieInfo(true);
	};

	return (
		<div className={"w-full p-4"}>
			{
				loading ? (
					<span className={"text-3xl text-gray-200"}>Loading Axies</span>
				) : (
					<div className={"w-full gap-4 flex items-center flex-col md:flex-row"}>
						{
							axies.map((axie: any) => {
								return (
									<div
										key={axie.id}
										onClick={() => onAxieClick(axie.id)}
										className={"md:w-1/3 w-3/4 rounded-md flex justify-center items-center flex-col relative bg-gray-100 border border-gray-200"} >
										<img src={axie.image} />
										<span className="absolute top-3 left-3 bg-blue-500 text-white font-bold text-xs px-2 py-1 rounded-md" >{axie.name}</span>
										<span className="absolute top-10 left-3 bg-blue-500 bg-opacity-80 text-white font-bold text-xs px-2 py-1 rounded-md" >{axie.id}</span>
									</div>
								);
							})
						}
					</div>
				)
			}
			<Transition appear show={showAxieInfo} as={Fragment}>
				<Dialog
					as="div"
					className="fixed inset-0 z-10 overflow-y-auto"
					onClose={() => setShowAxieInfo(false)}>
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

							<div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
								{
									axieInfoMeta.loading ? (
										<span className={"text-3xl text-gray-200 flex items-center justify-center"} style={{ height: 700 }}>Loading Axie Info</span>
									) : selected_axie ? (
										<div className={"w-full flex justify-center items-center flex-col"} >
											<AxieCard
												className={"w-full"}
												axie={selected_axie} />

											<div className="w-full bg-gray-4 overflow-hidden flex flex-row flex-wrap">
												{
													selected_axie_abilities.map((ability: any) => (
														<AbilityCard
															className={"w-full md:w-1/4 p-4"}
															key={ability.id}
															ability={ability} />
													))
												}
											</div>
										</div>
									) : (
										<span className={"text-3xl text-gray-200"}>Failed to load Axie Info</span>
									)
								}

								<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
									<button type="button" onClick={() => setShowAxieInfo(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
										Close
									</button>
								</div>
							</div>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
		</div >
	);
};
