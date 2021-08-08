import { BeakerIcon } from "@heroicons/react/solid";
import { useEffect, useMemo, useState } from "react";
import { ISlpData } from "../../../utils/constants/models";
import { battles_uri, overview_uri } from "../../../utils/constants/api";
import { gql, useQuery } from "@apollo/client";
import { public_profile } from "../../../utils/constants/queries";
import { ReactComponent as SwordsIcon } from '../../../assets/icons/swords.svg';
import moment from "moment";
import classNames from "classnames";
import { useSlpRates } from "../../../hooks/useSlpRates";
import { SlpPriceChart } from "../../Components/UI/SlpPriceChart";

const ronin_id = "0x976d45396c611510ca8abf5f3bb78063b94dd976";

export const Dashboard = () => {
	const slpRates = useSlpRates();
	const { loading: loadingProfile, data: profileData } = useQuery(gql`${public_profile}`, {
		variables: { roninAddress: ronin_id }
	});
	const [fetchingErrors, setFetchingErrors] = useState({
		SLP: false,
		BATTLES: false
	});
	const [battles, setBattles] = useState(Array);
	const [slpData, setSlpData] = useState<ISlpData>({
		in_game_slp: 0,
		last_claim_amount: 0,
		last_claim_timestamp: 0,
		mmr: 0,
		rank: 0,
		ronin_slp: 0,
		total_matches: 0,
		total_slp: 0,
		updated_on: 0,
		win_rate: 0,
	});

	useEffect(() => {
		(async () => {
			try {
				const more_info_url = `${battles_uri}${ronin_id}`;
				const res = await fetch(more_info_url);
				const data = await res.json();

				if (!data.error) {
					setBattles(data?.battles || []);
					setFetchingErrors(p => ({
						...p,
						BATTLES: false
					}));
				} else {
					console.error(data.error);
					setFetchingErrors(p => ({
						...p,
						BATTLES: true
					}));
				}
			} catch (error) {
				console.error(error);
				setFetchingErrors(p => ({
					...p,
					BATTLES: true
				}));
			}
		})();
	}, []);

	useEffect(() => {
		(async () => {
			try {
				const more_info_url = `${overview_uri}${ronin_id}`;
				const res = await fetch(more_info_url);
				const data = await res.json();

				if (!data.error) {
					setSlpData({
						last_claim_amount: 0,
						win_rate: 0,
						total_matches: 0,
						mmr: data?.leaderboard?.elo || 0,
						rank: data?.leaderboard?.rank || 0,
						ronin_slp: data?.slp?.roninSlp || 0,
						total_slp: data?.slp?.total || 0,
						updated_on: data?.slp?.updatedOn || 0,
						in_game_slp: data?.slp?.gameSlp || 0,
						last_claim_timestamp: data?.slp?.lastClaimedItemAt || 0,
					});
					setFetchingErrors(p => ({
						...p,
						SLP: false
					}));
				} else {
					console.error(data.error);
					setFetchingErrors(p => ({
						...p,
						SLP: true
					}));
				}
			} catch (error) {
				console.error(error);
				setFetchingErrors(p => ({
					...p,
					SLP: true
				}));
			}
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

	const usdValue: any = useMemo(() => {
		if (fetchingErrors.SLP) {
			return "ERROR";
		}
		return slpRates.usd * slpData.total_slp;
	}, [slpRates, slpData]);

	const phpValue: any = useMemo(() => {
		if (usdValue === "ERROR") {
			return "ERROR";
		}
		return slpRates.php * slpData.total_slp;
	}, [slpRates, slpData]);

	return (
		<div className={"w-full flex flex-col bg-gray-50 bg-opacity-50"}>
			<h1 className="pt-4 px-4 text-2xl font-bold text-gray-900">Welcome {loadingProfile ? "" : profileData?.publicProfileWithRoninAddress?.name || ""}</h1>
			<div className={"w-full flex flex-col md:flex-row gap-4 p-4"}>
				<div className="flex w-full md:w-1/3 lg:w-1/4 gap-4 flex-col py-4 px-6 rounded-xl bg-white border border-gray-100">
					<div className="bg-blue-400 rounded-xl h-10 w-10 flex items-center justify-center">
						<BeakerIcon className="h-5 w-5 text-white" />
					</div>
					<div className="flex-1 text-left">
						<h3 className="font-bold text-gray-700 text-4xl">{fetchingErrors.SLP ? "ERROR" : slpData.total_slp}</h3>
						<h5 className="font-bold text-gray-400">Claimable SLP</h5>
					</div>
				</div>
				<div className="flex w-full md:w-1/3 lg:w-1/4 gap-4 flex-col py-4 px-6 rounded-xl bg-white border border-gray-100">
					<div className="bg-blue-400 rounded-xl h-10 w-10 flex items-center justify-center">
						<span className="text-xl font-bold text-white">$</span>
					</div>
					<div className="flex-1 text-left">
						<h3 className="font-bold text-gray-700 text-4xl">{formatPrice(usdValue, 'en-US', 'USD')}</h3>
						<h5 className="font-bold text-gray-400">{formatPrice(phpValue, 'en-US', 'PHP')}</h5>
					</div>
				</div>
				<div className="flex relative w-full md:w-1/3 lg:w-1/2 gap-4 flex-col rounded-xl bg-blue-400 max-h-40">
					<span className="bottom-0 text-white m-2 absolute font-bold text-sm">
						1 SLP = {formatPrice(slpRates.php, 'en-US', 'PHP')} / {formatPrice(slpRates.usd, 'en-US', 'USD')}
					</span>
					<SlpPriceChart slpRates={slpRates} />
				</div>
			</div>
			<div className="bg-white border border-gray-100 rounded-lg mx-4 mt-4">
				<div className="flex items-center py-4 px-6  gap-4">
					<div className="bg-blue-400 rounded-xl h-10 w-10 flex items-center justify-center">
						<SwordsIcon className="h-5 w-5 text-white" />
					</div>
					<h4 className="font-bold text-lg uppercase">Latest Battle Logs ({battles.length})</h4>
				</div>
				<table className="text-left w-full border-collapse">
					<thead>
						<tr className="bg-gray-50">
							<th className="py-4 px-6  w-1/4 font-bold uppercase text-sm text-gray-500">Status</th>
							<th className="py-4 px-6  w-1/4 font-bold uppercase text-sm text-gray-500">Type</th>
							<th className="py-4 px-6  w-1/4 font-bold uppercase text-sm text-gray-500">Level</th>
							<th className="py-4 px-6  w-1/4 font-bold uppercase text-sm text-gray-500">Date</th>
						</tr>
					</thead>
					<tbody>
						{
							battles.map((battle: any) => {
								const battle_status = battle.winner === 0
									? 'Win'
									: battle.winner === 1
										? "Lose"
										: "Draw";
								const battle_date = moment(new Date(battle.created_at));
								return (
									<tr key={battle.id} className="hover:bg-blue-50 cursor-pointer">
										<td className={'py-2 w-1/4  px-6 border-b border-gray-50 border-grey-light'}>
											<span className={classNames('font-bold px-4 p-0.5 text-sm rounded-md', {
												'text-green-100': battle_status === 'Win',
												'text-red-100': battle_status === 'Lose',
												'text-blue-100': battle_status === 'Draw',
												'bg-green-500': battle_status === 'Win',
												'bg-red-500': battle_status === 'Lose',
												'bg-blue-500': battle_status === 'Draw'
											})}>
												{battle_status}
											</span>
										</td>
										<td className="py-2 w-1/4  px-6 border-b border-gray-50 border-grey-light">
											{
												battle.battle_type === "battle_pvp"
													? "PVP"
													: "PVE"
											}
										</td>
										<td className="py-2 w-1/4  px-6 border-b border-gray-50 border-grey-light">
											{
												battle.battle_type === "battle_pvp"
													? 1
													: battle.second_team_id.replace(/\D/g, "")
											}
										</td>
										<td className="py-2 w-1/4  px-6 border-b border-gray-50 border-grey-light">
											{
												battle_date.isSame(moment(), 'day')
													? battle_date.fromNow()
													: battle_date.format("LLLL")
											}
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
	);
};