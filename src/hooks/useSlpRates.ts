import { useEffect, useState } from "react";
import { coingecko_slp_data } from "../utils/constants/api";

export interface ISlpRates {
	usd: number;
	php: number;
}
/**
 * Retrieve current rate on PHP and USD
 * @returns {ISlpRates}
 */
export const useSlpRates = () => {
	const [loadedOrLoading, setLoadedOrLoading] = useState(Boolean);
	const [slpRates, setSlpRates] = useState<ISlpRates>({
		php: 0,
		usd: 0,
	});

	useEffect(() => {
		if (loadedOrLoading) return;
		(async () => {
			setLoadedOrLoading(true);
			try {
				const res = await fetch(coingecko_slp_data);
				const data = await res.json();
				if (data) {
					const { usd, php } = data.market_data.current_price;
					setSlpRates({
						usd,
						php,
					});
				}
			} catch (error) {
				console.error(error);
			}
		})();
	}, [loadedOrLoading]);

	return slpRates;
};
