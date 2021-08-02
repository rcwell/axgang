import { useMemo, ComponentType } from "react";
import { Switch, Route, Redirect, RouteProps, RouteComponentProps } from "react-router-dom";
import { Guide, Home, Inbox, Reports, Axies, Dashboard } from "../../../Routes";

export const Main = ({ isLoggedIn }: any) => {
	return (
		<main className={"flex flex-grow overflow-y-auto"} style={{ maxHeight: 'calc(100vh - 94px)' }}>
			<Switch>

				<ProtectedRoute
					exact
					path={"/"}
					component={Dashboard}
					isLoggedIn={isLoggedIn} />

				<ProtectedRoute
					exact
					path={"/reports"}
					component={Reports}
					isLoggedIn={isLoggedIn} />

				<ProtectedRoute
					exact
					path={"/guide"}
					component={Guide}
					isLoggedIn={isLoggedIn} />

				<ProtectedRoute
					exact
					path={"/inbox"}
					component={Inbox}
					isLoggedIn={isLoggedIn} />

				<ProtectedRoute
					exact
					path={"/axies"}
					component={Axies}
					isLoggedIn={isLoggedIn} />

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