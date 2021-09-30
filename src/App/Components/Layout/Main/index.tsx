import { Switch, Route, Redirect } from "react-router-dom";
import { Guide, Inbox, Reports, Axies, Dashboard, Users, Profile } from "../../../Routes";
import { Settings } from "../../../Routes/Settings";

export const Main = () => (
	<main className={"flex flex-grow overflow-y-auto bg-gray-50 bg-opacity-50"} style={{ maxHeight: 'calc(100vh - 94px)' }}>
		<Switch>

			<Route
				exact
				path={"/"}
				component={Dashboard} />

			<Route
				exact
				path={"/users"}
				component={Users} />

			<Route
				exact
				path={"/reports"}
				component={Reports} />

			<Route
				exact
				path={"/guide"}
				component={Guide} />

			<Route
				exact
				path={"/inbox"}
				component={Inbox} />

			<Route
				exact
				path={"/axies"}
				component={Axies} />

			<Route
				exact
				path={"/profile"}
				component={Profile} />

			<Route
				exact
				path={"/settings"}
				component={Settings} />

			<Redirect from={"*"} to={"/"} />

		</Switch>
	</main>
);
