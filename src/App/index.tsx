import { useMemo, useState, useEffect } from "react";
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

const App = () => {
	const [user, setUser] = useState<IUser | null>(null);
	const isLoggedIn = useMemo(() => user !== null, [user]);

	useEffect(() => {
		itemsCollection.on('value', (snapshot) => {
			const data = snapshot.val();
			console.log(data);
		});
	}, []);

	return (
		<FirebaseDatabaseProvider firebase={firebase}>
			<ApolloProvider client={client}>
				<AlertsWrapper>
					<div className={"min-h-screen flex flex-col"}>
						<Router>
							{
								isLoggedIn
									? (
										<div className={"flex flex-row flex-grow"}>
											<SideBar />
											<div className={"flex flex-col flex-grow"}>
												<TopBar
													isLoggedIn={isLoggedIn}
													onSignIn={setUser}
													onSignOut={() => setUser(null)} />
												<Main isLoggedIn />
											</div>
										</div>
									) : (
										<>
											<TopBar
												isLoggedIn={isLoggedIn}
												onSignIn={setUser} />
											<Main />
										</>
									)
							}
							<Footer />
						</Router>
					</div>
				</AlertsWrapper>
			</ApolloProvider>
		</FirebaseDatabaseProvider >
	);
};

export default App;
