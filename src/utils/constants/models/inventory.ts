export interface IInventory {
	id: string;
	accountId: string;
	slpData: IInventoryItem[];
}

export interface IInventoryItem {
	id: string;
	date: string;
	count: string;
}
