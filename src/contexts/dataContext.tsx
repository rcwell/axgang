import { createContext, FC, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from ".";
import { ICredentials, ISlpData, IUser } from "../utils/constants/models";
import { ISlp } from "../utils/constants/models/slp";
import { createAuth, inventoryCollection, usersCollection } from "../utils/firebase";
import { snapshotToModel } from "./mapper";

type NewUser = Omit<IUser, 'id'> & Pick<ICredentials, 'password'>
interface IDataContext {
	users: IUser[],
	managers: IUser[],
	userId: string;
	slpData: ISlp[];
	addPerson: (person: NewUser) => Promise<any>
	updatePerson: (person: IUser) => Promise<any>
	saveSlpData: (slpData: ISlp) => Promise<boolean>
}
const DataContext = createContext<IDataContext>({} as any);

export const useData = () => useContext(DataContext);

export const DataContextProvider: FC = ({ children }) => {
	const { currentUser } = useAuth();
	const [users, setUsers] = useState<IUser[]>(Array);
	const [slpData, setSlpData] = useState<ISlp[]>(Array);
	const [userId, setUserId] = useState(String);

	useEffect(() => {
		usersCollection.on("value", (snapshot) => {
			const data = snapshot.val();
			setUsers(snapshotToModel<IUser>(data));
		});
	}, []);

	useEffect(() => {
		inventoryCollection.on("value", (snapshot) => {
			const data = snapshot.val();
			const d: any = Object.values(data)[0];
			setSlpData(snapshotToModel<ISlp>(d));
		});
	}, []);

	useEffect(() => {
		if (!userId && currentUser) {
			const user = users.find(({ email }) => email === currentUser.email);
			setUserId(user?.id ?? "");
		}
	}, [users, userId]);

	const addPerson = async ({ address, email, password, ...user }: IUser & Pick<ICredentials, 'password'>) => {
		try {
			const auth = await createAuth({
				email,
				password
			});
			const { key: userId } = await addUser({
				...user,
				email,
				address,
			});
			return {
				user: {
					...user,
					id: userId,
				},
				auth
			};
		} catch (err) {
			return false;
		}
	};

	const addUser = (user: Omit<IUser, 'id'>) => usersCollection.push(user);

	const updatePerson = async ({ id = '', ...rest }: IUser) => {
		if (!id) return false;

		try {
			usersCollection
				.child(id)
				.set(rest);
			return true;
		} catch (error) {
			return false;
		}
	};

	const saveSlpData = async (d: ISlp) => {
		try {
			inventoryCollection
				.child(userId)
				.push({
					...d,
					datetime: d.datetime.toISOString()
				});
			return true;
		} catch (error) {
			return false;
		}
	};

	const managers = useMemo(() => users.filter(({ type }) => type === 'manager'), [users]);

	return (
		<DataContext.Provider value={{
			users,
			userId,
			slpData,
			managers,
			addPerson,
			updatePerson,
			saveSlpData,
		}}>
			{children}
		</DataContext.Provider>
	);
};