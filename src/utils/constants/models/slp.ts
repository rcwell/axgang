export interface ISlp<T = number, K = Date> {
	count: T;
	datetime: K;
	id?: string;
}
