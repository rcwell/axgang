import { links } from '../../../../utils/constants/links';
import { Link, useHistory, } from 'react-router-dom';
import { useEffect, useState } from 'react';
import cx from 'classnames';
import { ReactComponent as Logo } from '../../../../assets/icons/logo.svg';

const inActiveLink = `
flex
flex-row
items-center
gap-5 
px-4 
py-2 
text-sm 
font-semibold
bg-transparent 
rounded-lg 
text-gray-400 
hover:text-gray-600 
focus:text-gray-600 
hover:bg-gray-100 
focus:bg-gray-100 
focus:outline-none 
focus:shadow-outline`;

const activeLink = `
flex
flex-row
items-center
gap-5 
px-4 
py-2 
text-sm 
font-semibold 
text-blue-500 
bg-blue-100 
rounded-lg 
hover:text-blue-600 
focus:text-blue-600 
hover:bg-blue-100 
focus:bg-blue-100 
focus:outline-none 
focus:shadow-outline`;

export const SideBar = () => {
	const history = useHistory();

	const [currentLocation, setCurrentLocation] = useState(history.location.pathname);

	useEffect(() => {
		history.listen((location) => {
			if (currentLocation !== location.pathname)
				setCurrentLocation(location.pathname);
		});
	}, [history, currentLocation]);

	return (
		<nav
			className={"bg-white hidden border-r border-gray-100 relative md:block"}>
			<div className={"flex items-center gap-1 lg:flex-1 cursor-pointer p-4"}>
				<Logo className="text-gray-800" />
			</div>

			<nav className={cx("flex-grow flex-col p-2 gap-2 flex mt-0 relative w-auto bg-transparent", {
			})}>
				{
					links.map(link => (
						<Link
							to={link.path}
							key={link.path}
							className={cx({
								[activeLink]: currentLocation === link.path,
								[inActiveLink]: currentLocation !== link.path
							})}>
							<link.icon
								className={cx("h-5 w-5 text-gray-600", {
									"text-blue-500": currentLocation === link.path,
								})} />
							<span className="mt-0.5">{link.display}</span>
						</Link>
					))
				}
			</nav>
		</nav>
	);
};