import { useMemo, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { IUser } from "../utils/constants/user";
import { TopBar, Main, Footer, SideBar } from "./Components/Layouts";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
	uri: 'https://axieinfinity.com/graphql-server-v2/graphql',
	cache: new InMemoryCache()
});

const App = () => {
	const [user, setUser] = useState<IUser | null>(null);
	const isLoggedIn = useMemo(() => user !== null, [user]);

	return (
		<ApolloProvider client={client}>
			<div className={"min-h-screen flex flex-col"}>
				<Router>
					{
						isLoggedIn
							? (
								<div className={"flex flex-row flex-grow"}>
									<SideBar />
									<div className={"flex flex-col flex-grow px-0 md:px-4"}>
										<TopBar
											isLoggedIn={isLoggedIn}
											onSignIn={setUser} />
										<Main />
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
		</ApolloProvider>
	);
};

export default App;
