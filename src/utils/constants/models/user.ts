export interface IUser<T = string, K = UserTypes>
	extends Omit<ICredentials<T>, "password"> {
	name: T;
	team: T;
	type: K;
	address: T;
	managerId?: T;
	id?: T;
	passwordChanged?: boolean;
}

export interface ICredentials<T = string> {
	email: T;
	password: T;
}

export enum UserTypes {
	MANAGER = "manager",
	SCHOLAR = "scholar",
}
