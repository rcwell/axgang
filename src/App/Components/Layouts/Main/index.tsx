import { Switch, Route, Redirect } from "react-router-dom";
import { Guide, Home, Inbox, Reports, Axies } from "../../../Routes";

export const Main = () => {
	return (
		<main className={"flex flex-grow"}>
			<Switch>

				<Route
					exact
					path={"/"}
					component={Home} />

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

				<Redirect from={"*"} to={"/"} />

			</Switch>
		</main>
	);
};