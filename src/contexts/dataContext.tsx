import { createContext, FC, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from ".";
import { ICredentials, IUser } from "../utils/constants/models";
import { ISlp } from "../utils/constants/models/slp";
import { createAuth, inventoryCollection, usersCollection } from "../utils/firebase";
import { snapshotToModel } from "./mapper";

type NewUser = Omit<IUser, 'id'> & Pick<ICredentials, 'password'>
interface IDataContext {
	users: IUser[],
	managers: IUser[],
	userId: string;
	walletAddress: string;
	mandatePasswordChange: boolean;
	slpData: ISlp[];
	addPerson: (person: NewUser) => Promise<any>
	updatePerson: (person: Partial<IUser>) => Promise<any>
	saveSlpData: (slpData: ISlp) => Promise<boolean>
	setMandatePasswordChange: React.Dispatch<React.SetStateAction<boolean>>
}
const DataContext = createContext<IDataContext>({} as any);

export const useData = () => useContext(DataContext);

export const DataContextProvider: FC = ({ children }) => {
	const { currentUser } = useAuth();
	const [mandatePasswordChange, setMandatePasswordChange] = useState(Boolean);
	const [users, setUsers] = useState<IUser[]>(Array);
	const [slpData, setSlpData] = useState<ISlp[]>(Array);
	const [userId, setUserId] = useState(String);
	const [user, setUser] = useState<IUser>();
	const [walletAddress, setWalletAddress] = useState(String);

	useEffect(() => {
		usersCollection.on("value", (snapshot) => {
			const data = snapshot.val();
			setUsers(snapshotToModel<IUser>(data));
		});
	}, []);

	useEffect(() => {
		if (!userId) return;
		inventoryCollection
			.child(userId)
			.on("value", (snapshot) => {
				const data = snapshot.val();
				setSlpData(snapshotToModel<ISlp>(data));
			});
	}, [userId]);

	useEffect(() => {
		if (!userId && currentUser) {
			const user = users.find(({ email }) => email === currentUser.email);
			setUser(user);
			setUserId(user?.id ?? "");
			setWalletAddress(user?.address ?? "");
			setMandatePasswordChange(!user?.passwordChanged);
		}
	}, [users, userId]);

	useEffect(() => {
		if (user && mandatePasswordChange) {
			setMandatePasswordChange(!user.passwordChanged);
		}
	}, [user, mandatePasswordChange]);

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

	const updatePerson = async (newValues: Partial<IUser>) => {
		const { id, ...currentUserProps } = user ?? {};
		if (!id) return false;
		try {
			usersCollection
				.child(id)
				.set({
					...currentUserProps,
					...newValues,
				});
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
			walletAddress,
			mandatePasswordChange,
			setMandatePasswordChange,
		}}>
			{children}
		</DataContext.Provider>
	);
};