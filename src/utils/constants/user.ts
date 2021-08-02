export interface IUser {
	email: string;
	id: string;
	name: string;
	picture: string;
}
export interface IUserCredentials<T> {
	Email: T;
	Password: T;
}
