import {
	AcademicCapIcon,
	DesktopComputerIcon,
	UsersIcon,
	// InboxIcon,
	// LightBulbIcon,
	TableIcon,
} from "@heroicons/react/outline";
import { ReactComponent as AxiesIcon } from "../../assets/icons/axie.svg";

export const links = [
	{
		display: "Dashboard",
		path: "/",
		icon: DesktopComputerIcon,
	},
	{
		display: "Users",
		path: "/users",
		icon: UsersIcon,
	},
	{
		display: "Reports",
		path: "/reports",
		icon: TableIcon,
	},
	// {
	// 	display: "Guide",
	// 	path: "/guide",
	// 	icon: LightBulbIcon,
	// },
	// {
	// 	display: "Inbox",
	// 	path: "/inbox",
	// 	icon: InboxIcon,
	// },
	{
		display: "Axies",
		path: "/axies",
		icon: AxiesIcon,
	},
];
