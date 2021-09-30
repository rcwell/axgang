import Layout from "./Components/Layout";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { FirebaseDatabaseProvider } from "@react-firebase/database";
import { firebase } from '../utils/firebase';
import { AuthProvider } from "../contexts";
import { AlertsProvider } from "../contexts/alertContext";
import "react-datepicker/dist/react-datepicker.css";

const client = new ApolloClient({
	uri: process.env.REACT_APP_AXIE_API,
	cache: new InMemoryCache()
});

const App = () => (
	<FirebaseDatabaseProvider firebase={firebase}>
		<ApolloProvider client={client}>
			<AlertsProvider>
				<AuthProvider>
					<Layout />
				</AuthProvider>
			</AlertsProvider>
		</ApolloProvider>
	</FirebaseDatabaseProvider >
);

export default App;
