export const battles_uri = process.env.REACT_APP_AXIE_BATTLES_API || "";
export const overview_uri = process.env.REACT_APP_AXIE_OVERVIEW_API || "";
export const coingecko_slp_data = process.env.REACT_APP_AXIE_SLP_DATA_API || "";
export const slp_price_php = process.env.REACT_APP_AXIE_SLP_PHP_API || "";
export const stats = process.env.REACT_APP_AXIE_STATS || "";

export const slp_api = process.env.REACT_APP_AXIE_SCHO_TRACKER_API || "";
export const token_price = (tokenIds: string) =>
	(process.env.REACT_APP_EXCHANGE || "").replace("{{ids}}", tokenIds);
