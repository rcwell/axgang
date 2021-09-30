export interface IAlert {
	type: AlertTypes;
	message: string;
	title: string;
	show: boolean;
	id?: string;
}

export enum AlertTypes {
	Error,
	Warning,
	Success,
}
