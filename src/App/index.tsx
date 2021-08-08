import { useMemo, useState, useEffect, createContext } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { IUser } from "../utils/constants/user";
import { TopBar, Main, Footer, SideBar } from "./Components/Layouts";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { FirebaseDatabaseProvider } from "@react-firebase/database";
import { itemsCollection, firebase } from '../utils/firebase';
import { AlertsWrapper } from "./Components/Overlays";

const client = new ApolloClient({
	uri: process.env.REACT_APP_AXIE_API,
	cache: new InMemoryCache()
});

export const UserContext = createContext<{ user: IUser | null, onSetUser: (user: IUser | null) => void }>({
	user: null,
	onSetUser: () => { }
});

export const dummyUser = {
	email:"Test",
	name:"Name",
	id:"ID",
	picture:""
};

const App = () => {
	const [user, setUser] = useState<IUser | null>(null);
	const isLoggedIn = useMemo(() => user !== null, [user]);

	useEffect(() => {
		itemsCollection.on('value', () => {
			// const data = snapshot.val();
			// if (1 > 2)
			// 	console.log(data);
		});
	}, []);

	return (
		<FirebaseDatabaseProvider firebase={firebase}>
			<ApolloProvider client={client}>
				<AlertsWrapper>
					<UserContext.Provider value={{
						user,
						onSetUser: (user: IUser | null) => setUser(user)
					}}>
						<div className={"min-h-screen flex flex-col"}>
							<Router>
								{
									isLoggedIn
										? (
											<div className={"flex flex-row flex-grow"}>
												<SideBar />
												<div className={"flex flex-col flex-grow"}>
													<TopBar />
													<Main />
												</div>
											</div>
										) : (
											<>
												<TopBar />
												<Main />
											</>
										)
								}
								<Footer />
							</Router>
						</div>
					</UserContext.Provider>
				</AlertsWrapper>
			</ApolloProvider>
		</FirebaseDatabaseProvider >
	);
};

export default App;
