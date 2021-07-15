export interface IUser {
	Name: string;
	Id: string;
}
export interface IUserCredentials<T> {
	Username: T;
	Password: T;
}
