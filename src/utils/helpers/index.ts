export const getEnumKeys = <T extends object>(e: T): string[] =>
	Object
		.values(e)
		.filter((value) => typeof value === "string");
