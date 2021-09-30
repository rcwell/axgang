import { BrowserRouter as Router } from "react-router-dom";
import { useAuth } from "../../../contexts";
import { SideBar } from "./SideBar";
import { TopBar } from "./TopBar";
import { Main } from "./Main";
import { Footer } from "./Footer";
import { Home } from "../../Routes";
import { DataContextProvider } from "../../../contexts/dataContext";

export const Layout = () => {

	const { isLoggedIn } = useAuth();

	return (
		<div className={"min-h-screen flex flex-col"}>
			<Router>
				{
					isLoggedIn
						? <Member />
						: <Guest />
				}
				<Footer />
			</Router>
		</div>
	);
};
const Member = () => (
	<DataContextProvider>
		<div className={"flex flex-row flex-grow"}>
			<SideBar />
			<div className={"flex flex-col flex-grow"}>
				<TopBar />
				<Main />
			</div>
		</div>
	</DataContextProvider>
);
const Guest = () => (
	<>
		<TopBar />
		<main className={"flex flex-grow overflow-y-auto bg-gray-50 bg-opacity-50"} style={{ maxHeight: 'calc(100vh - 94px)' }}>
			<Home />
		</main>
	</>
);

export default Layout;