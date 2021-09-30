export interface IPayout {
	id: string;
	date: string;
	accountId: string;
	prices: IPayoutPrices;
}

export interface IPayoutPrices {
	id: string;
	slp: IRateConversion;
	eth: IRateConversion;
	gas: IGasFees;
}

export interface IGasFees {
	eth: string;
	prices: IRateConversion;
}

export interface IRateConversion<T = string> {
	php: T;
	usd: T;
}

export interface IRateConversionMap<T = string> {
	[key: string]: IRateConversion<T>;
}
