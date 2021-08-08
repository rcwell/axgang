import { useMemo, ComponentType, useContext } from "react";
import { Switch, Route, Redirect, RouteProps, RouteComponentProps } from "react-router-dom";
import { UserContext } from "../../..";
import { Guide, Home, Inbox, Reports, Axies, Dashboard, Scholars } from "../../../Routes";

export const Main = () => {
	const { user } = useContext(UserContext);
	return (
		<main className={"flex flex-grow overflow-y-auto bg-gray-50 bg-opacity-50"} style={{ maxHeight: 'calc(100vh - 94px)' }}>
			<Switch>

				<ProtectedRoute
					exact
					path={"/"}
					component={Dashboard}
					isLoggedIn={user !== null} />

				<ProtectedRoute
					exact
					path={"/scholars"}
					component={Scholars}
					isLoggedIn={user !== null} />

				<ProtectedRoute
					exact
					path={"/reports"}
					component={Reports}
					isLoggedIn={user !== null} />

				<ProtectedRoute
					exact
					path={"/guide"}
					component={Guide}
					isLoggedIn={user !== null} />

				<ProtectedRoute
					exact
					path={"/inbox"}
					component={Inbox}
					isLoggedIn={user !== null} />

				<ProtectedRoute
					exact
					path={"/axies"}
					component={Axies}
					isLoggedIn={user !== null} />

				<Redirect from={"*"} to={"/"} />

			</Switch>
		</main>
	);
};

const ProtectedRoute = (props: RouteProps & { isLoggedIn: boolean }) => {
	const { isLoggedIn, component, ...routeProps } = props;
	const routeComponent: ComponentType<RouteComponentProps<any>> = useMemo(() => {
		return isLoggedIn && component ? component : Home;
	}, [props]);
	return (
		<Route
			component={routeComponent}
			{...routeProps} />
	);
};