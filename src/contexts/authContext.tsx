import { createContext, FC, useContext, useEffect, useState } from "react";
import { ICredentials } from "../utils/constants/models";
import { firebaseAuth } from "../utils/firebase";

interface IAuthContext {
	currentUser: firebase.default.User | null;
	isLoggedIn: boolean;
	login: (credentials: ICredentials) => Promise<firebase.default.auth.UserCredential>;
	logout: () => Promise<void>;
	resetPassword: (email: string) => Promise<void>;
	updatePassword: (password: string) => Promise<void> | undefined;
}

const AuthContext = createContext<IAuthContext>({} as any);

export const useAuth = () => {
	return useContext(AuthContext);
};

export const AuthProvider: FC = ({ children }) => {

	const [currentUser, setCurrentUser] = useState<firebase.default.User | null>(null);
	const [loading, setLoading] = useState(true);

	const login = ({ email, password }: ICredentials) => {
		return firebaseAuth.signInWithEmailAndPassword(email, password);
	};

	const logout = () => {
		return firebaseAuth.signOut();
	};

	const updatePassword = (password: string) => {
		return currentUser?.updatePassword?.(password);
	};

	const resetPassword = (email: string) => {
		return firebaseAuth.sendPasswordResetEmail(email);
	};

	useEffect(() => {
		const unsubscribe = firebaseAuth.onAuthStateChanged(user => {
			setCurrentUser(user);
			setLoading(false);
		});

		return unsubscribe;
	}, []);

	const values: IAuthContext = {
		currentUser,
		login,
		logout,
		resetPassword,
		updatePassword,
		isLoggedIn: currentUser !== null
	};

	return (
		<AuthContext.Provider value={values}>
			{!loading && children}
		</AuthContext.Provider>
	);
};