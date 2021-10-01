import { BeakerIcon, QuestionMarkCircleIcon } from "@heroicons/react/solid";
import { Fragment, useEffect, useMemo, useState, VFC } from "react";
import { IRateConversion, IRateConversionMap } from "../../../utils/constants/models";
import { token_price } from "../../../utils/constants/api";
import { gql, useQuery } from "@apollo/client";
import { public_profile } from "../../../utils/constants/queries";
import { ReactComponent as SwordsIcon } from '../../../assets/icons/swords.svg';
import moment from "moment";
import { COINS, COIN_ICONS } from "../../../utils/constants/coins";
import { Popover, Transition } from "@headlessui/react";
import cx from 'classnames';
import { useData } from "../../../contexts/dataContext";

const coins = Object.values(COINS)
	.filter(c => typeof c === 'string');

export const Dashboard = () => {
	const { slpData, walletAddress } = useData();
	const { loading: loadingProfile, data: profileData } = useQuery(gql`${public_profile}`, {
		variables: { roninAddress: walletAddress }
	});
	const [conversions, setConversions] = useState<IRateConversionMap<number>>(coins.reduce((map: IRateConversionMap<number>, coin) => ({
		...map,
		[coin]: {
			usd: 0,
			php: 0
		}
	}), {}));

	useEffect(() => {
		(async () => {
			const url = token_price(coins.join(','));
			const res = await fetch(url);
			const data = await res.json();
			const conversions = coins.reduce((map: IRateConversionMap<number>, coin) => ({
				...map,
				[coin]: data[coin]
			}), {});
			setConversions(conversions);
		})();
	}, []);

	const formatPrice = (num: number, locale: string, currency: string) => {
		if (isNaN(num)) return num;
		return new Intl
			.NumberFormat(locale, {
				style: 'currency',
				currency
			})
			.format(num);
	};

	const totalSlp = useMemo(() => {
		return slpData.reduce((total, { count }) => total + Number(count ?? 0), 0);
	}, [slpData]);

	return (
		<div className={"w-full flex flex-col bg-gray-50 bg-opacity-50"}>
			<h1 className="pt-4 px-4 text-2xl font-bold text-gray-900">Welcome {loadingProfile ? "" : profileData?.publicProfileWithRoninAddress?.name || ""}</h1>
			<div className={"w-full flex flex-col md:flex-row gap-4 p-4"}>
				<div className="flex w-full md:w-1/2 lg:w-1/4 gap-4 flex-col py-4 px-6 rounded-xl bg-white border border-gray-100">
					<div className="bg-blue-400 rounded-xl h-10 w-10 flex items-center justify-center">
						<BeakerIcon className="h-5 w-5 text-white" />
					</div>
					<div className="flex-1 text-left">
						<h3 className="font-bold text-gray-700 text-4xl">{totalSlp}</h3>
						<h5 className="font-bold text-gray-400">Current SLP</h5>
					</div>
				</div>
				<div className="flex w-full md:w-1/2 lg:w-1/4 gap-4 flex-col py-4 px-6 rounded-xl bg-white border border-gray-100 relative">
					<div className="absolute top-2 right-2 cursor-pointer">
						<Popover className="relative mr-auto hidden md:inline-block">
							{({ open }) => (
								<>
									<Popover.Button
										className={cx(
											open ? 'text-gray-900' : 'text-gray-500',
											'mr-2 bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500'
										)}>
										<QuestionMarkCircleIcon className="h-5 w-5 text-gray-300" />
									</Popover.Button>

									<Transition
										show={open}
										as={Fragment}
										enter="transition ease-out duration-200"
										enterFrom="opacity-0 -translate-y-1"
										enterTo="opacity-100 translate-y-0"
										leave="transition ease-in duration-150"
										leaveFrom="opacity-100 translate-y-0"
										leaveTo="opacity-0 -translate-y-1">
										<Popover.Panel
											static
											className="absolute mt-3 transform right-1 w-40 z-20 bg-white">
											<div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden p-2">
												Current value as of<br />
												{
													moment()
														.format('lll')
												}
											</div>
										</Popover.Panel>
									</Transition>
								</>
							)}
						</Popover>
					</div>
					<div className="bg-blue-400 rounded-xl h-10 w-10 flex items-center justify-center">
						<span className="text-xl font-bold text-white">$</span>
					</div>
					<div className="flex-1 text-left">
						<h3 className="font-bold text-gray-700 text-4xl">{formatPrice(conversions[COINS.slp].usd * totalSlp, 'en-US', 'USD')}</h3>
						<h5 className="font-bold text-gray-400">{formatPrice(conversions[COINS.slp].php * totalSlp, 'en-US', 'PHP')}</h5>
					</div>
				</div>
				<div className="w-full lg:w-1/2 gap-4 flex-col max-h-screen xs:max-h-40 grid grid-cols-1 xs:grid-cols-2">
					{
						coins.map(coin => (
							<TokenPriceCard icon={COIN_ICONS[coin]} {...conversions[coin]} />
						))
					}
				</div>
			</div>
			<div className="bg-white border border-gray-100 rounded-lg mx-4 mt-4">
				<div className="flex items-center py-4 px-6 gap-4">
					<div className="bg-blue-400 rounded-xl h-10 w-10 flex items-center justify-center">
						<SwordsIcon className="h-5 w-5 text-white" />
					</div>
					<h4 className="font-bold text-lg uppercase">Recent SLP Gains (10 days)</h4>
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
							slpData
								.slice(0, 10)
								.map((slp) => (
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
	);
};

const TokenPriceCard: VFC<IRateConversion<number> & { icon: string }> = ({ usd, php, icon }) => {
	const formatPrice = (num: number, locale: string, currency: string) => {
		if (isNaN(num)) return num;
		return new Intl
			.NumberFormat(locale, {
				style: 'currency',
				currency
			})
			.format(num);
	};
	return (
		<span className="text-white-500 font-bold text-sm rounded-lg bg-blue-400 flex items-center px-4 gap-4 py-4 md:py-0">
			<div className="bg-white rounded-xl h-10 w-10 flex items-center justify-center">
				<img className="h-5" src={icon} />
			</div>
			<div className="flex flex-col">
				<span className="text-white text-lg">{formatPrice(usd, 'en-US', 'USD')}</span>
				<span className="text-xs text-gray-100">{formatPrice(php, 'en-US', 'PHP')}</span>
			</div>
		</span>
	);
};