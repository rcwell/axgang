export enum COINS {
	slp = "smooth-love-potion",
	axs = "axie-infinity",
	eth = "ethereum",
	bnb = "binancecoin",
}
export const COIN_ICONS = {
	[COINS.slp]: process.env.REACT_APP_SLP_ICON ?? "",
	[COINS.axs]: process.env.REACT_APP_AXS_ICON ?? "",
	[COINS.eth]: process.env.REACT_APP_ETH_ICON ?? "",
	[COINS.bnb]: process.env.REACT_APP_BNB_ICON ?? "",
};
