export const snapshotToModel = <T>(
	snapshot: firebase.default.database.DataSnapshot
): T[] => {
	const values = Object.entries(snapshot ?? {});
	return values.map((d) => ({
		id: d[0],
		...d[1],
	}));
};
