import { AcademicCapIcon, ViewGridIcon } from '@heroicons/react/solid';
import axieTab from '../../../../assets/image/tab-axie.png';
import cx from 'classnames';
import { Fragment, useMemo } from 'react';
import { Popover, Transition } from '@headlessui/react';
import {
	ChartBarIcon,
	CursorClickIcon,
	MenuIcon,
	XIcon,
	CogIcon,
	BellIcon,
	UserCircleIcon,
	LogoutIcon,
	ExclamationIcon,
	InformationCircleIcon,
} from '@heroicons/react/outline';
import { links } from '../../../../utils/constants/links';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useWindowDimensions } from '../../../../hooks/useWindowDimensions';

interface IMemberNav {
	onLogout: () => void;
}
export const MemberNav = ({ onLogout }: IMemberNav) => {
	const settings = useMemo(() => {
		return buildSettings({
			onAcountClick: () => {},
			onSettingsClick: () => {},
			onLogout,
		});
	}, [onLogout]);

	const { width } = useWindowDimensions();
	const atMostTabView = useMemo(() => width <= 767, [width]);

	return (
		<Popover as={'header'} className="relative bg-white w-full flex justify-start items-center border-b border-gray-100  md:justify-between px-2 py-4">
			{({ open }: any) => (
				<>
					<div className="-mr-2 -my-2 md:hidden flex flex-row items-center">
						<Popover.Button className="mr-2 bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
							<span className="sr-only">Open menu</span>
							<MenuIcon className="h-5 w-5" aria-hidden="true" />
						</Popover.Button>
						<AcademicCapIcon className="h-6 w-6 text-blue-600" />
						<h1 className="text-2xl font-bold text-gray-800 accent-font ">
							AXGANG
						</h1>
					</div>

					<Popover.Group as="nav" className="flex -my-2 w-full justify-end">
						<Popover className="relative mr-auto hidden md:inline-block">
							{({ open }) => (
								<>
									<Popover.Button
										className={cx(
											open ? 'text-gray-900' : 'text-gray-500',
											'mr-2 bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500'
										)}>
										<ViewGridIcon className="h-5 w-5 hover:text-gray-900 focus:text-gray-900 text-gray-500" />
									</Popover.Button>

									<Transition
										show={open}
										as={Fragment}
										enter="transition ease-out duration-200"
										enterFrom="opacity-0 -translate-y-1"
										enterTo="opacity-100 translate-y-0"
										leave="transition ease-in duration-150"
										leaveFrom="opacity-100 translate-y-0"
										leaveTo="opacity-0 -translate-y-1">
										<Popover.Panel
											static
											className="absolute z-10 mt-3 transform w-screen max-w-md">
											<div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
												<div className="relative grid gap-1 bg-white p-2">
													{tools.map((item) => (
														<a
															key={item.name}
															href={item.href}
															className="p-3 flex items-start rounded-lg hover:bg-gray-50">
															<item.icon className="flex-shrink-0 h-6 w-6 text-blue-600" aria-hidden="true" />
															<div className="ml-4">
																<p className="text-base font-medium text-gray-900">{item.name}</p>
																<p className="mt-1 text-sm text-gray-500">{item.description}</p>
															</div>
														</a>
													))}
												</div>
											</div>
										</Popover.Panel>
									</Transition>
								</>
							)}
						</Popover>
						<Popover className="relative inline-block">
							{({ open }) => (
								<>
									<Popover.Button
										className={cx(
											open ? 'text-gray-900' : 'text-gray-500',
											'mr-2 bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500'
										)}>
										<BellIcon className="h-5 w-5 hover:text-gray-900 focus:text-gray-900 text-gray-500" />
									</Popover.Button>

									<Transition
										show={open}
										as={Fragment}
										enter="transition ease-out duration-200"
										enterFrom="opacity-0 -translate-y-1"
										enterTo="opacity-100 translate-y-0"
										leave="transition ease-in duration-150"
										leaveFrom="opacity-100 translate-y-0"
										leaveTo="opacity-0 -translate-y-1">
										<Popover.Panel
											static
											className="absolute z-10 mt-3 transform w-screen md:max-w-sm lg:max-w-md left-full -translate-x-full"
											style={atMostTabView
												? {
													left: "calc(-100vw + 200%)",
													transform: 'none'
												}
												: {}}>
											<div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
												<div className="relative grid gap-1 bg-white p-2">
													{notifications.map((item) => (
														<a
															key={item.name}
															href={item.href}
															className={classNames("p-3 flex items-start rounded-lg", {
																"hover:bg-yellow-50": item.color === 'yellow',
																"hover:bg-red-50": item.color === 'red',
																"hover:bg-gray-50": !item.color || item.color === 'default'
															})}>
															<item.icon
																aria-hidden="true"
																className={classNames("flex-shrink-0 h-6 w-6", {
																	"text-yellow-600": item.color === 'yellow',
																	"text-red-600": item.color === 'red',
																	"text-blue-600": !item.color || item.color === 'default'
																})} />
															<div className="ml-4">
																<p
																	className={classNames("text-base font-medium text-gray-900", {
																		"text-yellow-500": item.color === 'yellow',
																		"text-red-500": item.color === 'red',
																	})}>{item.name}</p>
																<p
																	className={classNames("mt-1 text-sm text-gray-500", {
																		"text-yellow-400": item.color === 'yellow',
																		"text-red-400": item.color === 'red',
																	})}>{item.description}</p>
															</div>
														</a>
													))}
												</div>
											</div>
										</Popover.Panel>
									</Transition>
								</>
							)}
						</Popover>
						<Popover className="relative text-right">
							{({ open }) => (
								<>
									<Popover.Button
										className={cx(
											open ? 'text-gray-900' : 'text-gray-500',
											'md:mr-2 bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500'
										)}>
										<UserCircleIcon className="h-5 w-5 text-gray-500" />
										<span className={"ml-2 hidden md:inline-flex"}>
											Username
										</span>
									</Popover.Button>

									<Transition
										show={open}
										as={Fragment}
										enter="transition ease-out duration-200"
										enterFrom="opacity-0 -translate-y-1"
										enterTo="opacity-100 translate-y-0"
										leave="transition ease-in duration-150"
										leaveFrom="opacity-100 translate-y-0"
										leaveTo="opacity-0 -translate-y-1">
										<Popover.Panel
											static
											className="absolute z-10 mt-3 transform w-52 left-full -translate-x-full">
											<div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
												<div className="relative bg-white flex flex-col p-2">
													{settings.map((item, i) => {
														if (item.name === 'divider') {
															return (
																<div
																	key={i}
																	className="bg-gray-100 h-px my-1">
																</div>
															);
														}
														return (
															<div
																onClick={item.onClick}
																key={item.name}
																className="cursor-pointer p-2 flex items-start rounded-lg hover:bg-gray-50">
																{
																	item.icon
																	&& <item.icon className="flex-shrink-0 h-6 w-6 text-blue-600" aria-hidden="true" />
																}
																<div className="ml-4">
																	<p className="text-base font-medium text-gray-900">{item.name}</p>
																</div>
															</div>
														);
													})}
												</div>
											</div>
										</Popover.Panel>
									</Transition>
								</>
							)}
						</Popover>
					</Popover.Group>

					<Transition
						show={open}
						as={Fragment}
						enter="duration-200 ease-out"
						enterFrom="opacity-0 scale-95"
						enterTo="opacity-100 scale-100"
						leave="duration-100 ease-in"
						leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0 scale-95">
						<Popover.Panel
							focus
							static
							className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
							<div className="rounded-lg p-4 shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
								<div className="flex items-center justify-between pb-4">
									<AcademicCapIcon className="h-8 w-auto text-blue-600" />
									<Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
										<span className="sr-only">Close menu</span>
										<XIcon className="h-6 w-6" aria-hidden="true" />
									</Popover.Button>
								</div>
								<nav className="grid gap-y-2 py-4">
									{links.map((link) => (
										<Link
											to={link.path}
											key={link.path}
											className="p-2 -mx-2 flex items-center rounded-md hover:bg-blue-50">
											<link.icon className="flex-shrink-0 h-6 w-6 text-blue-600" aria-hidden="true" />
											<span className="ml-3 text-base font-medium text-gray-900">{link.display}</span>
										</Link>
									))}
									<Link
										to={'/axies'}
										key={'/axies'}
										className="p-2 -mx-2 flex items-center rounded-md hover:bg-blue-50">
										<img src={axieTab}
											className={"flex-shrink-0 h-6 w-6 text-blue-600"} />
										<span className="ml-3 text-base font-medium text-gray-900">Axies</span>
									</Link>
								</nav>
								<div className="grid grid-cols-2 gap-y-4 gap-x-8 pt-4">
									{tools.map((item) => (
										<a
											key={item.name}
											href={item.href}
											className="text-base font-medium text-gray-900 hover:text-gray-700">
											{item.name}
										</a>
									))}
								</div>
							</div>
						</Popover.Panel>
					</Transition>
				</>
			)
			}
		</Popover >
	);
};

const tools = [
	{
		name: 'Gas Watch',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut congue id lectus at dapibus. Nunc nec ornare turpis, eget iaculis nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
		href: '#',
		icon: ChartBarIcon,
	},
	{
		name: 'Calculator',
		description: 'Curabitur eget neque in enim dignissim convallis nec at dui. Fusce justo velit, fringilla eu ex blandit, facilisis auctor lacus. Vestibulum pulvinar rutrum augue eu rhoncus.',
		href: '#',
		icon: CursorClickIcon,
	}
];
const notifications = [
	{
		name: 'Alert',
		description: 'Praesent consectetur mi ac nunc suscipit condimentum. Mauris urna tortor, tempus in dictum sit amet, malesuada quis lectus. Nam condimentum faucibus risus feugiat pulvinar.',
		href: '#',
		icon: BellIcon,
		color: 'yellow'
	},
	{
		name: 'Warning',
		description: 'Integer bibendum sollicitudin nulla vitae congue. Donec vitae risus purus. Sed vel erat ante.',
		href: '#',
		icon: ExclamationIcon,
		color: 'red'
	},
	{
		name: 'Info',
		description: 'Nulla facilisi. Donec vel turpis ipsum. Aliquam aliquam sagittis hendrerit. Suspendisse eu erat luctus, suscipit dolor id, vestibulum enim.',
		href: '#',
		icon: InformationCircleIcon,
	}
];

interface IBuildUserOptionsDropdown {
	onLogout: () => void,
	onAcountClick: () => void,
	onSettingsClick: () => void
}
const buildSettings = (props: IBuildUserOptionsDropdown) => {
	const { onLogout, onAcountClick, onSettingsClick } = props;
	return [
		{
			name: 'Account',
			icon: UserCircleIcon,
			onClick: onAcountClick
		},
		{
			name: 'Settings',
			icon: CogIcon,
			onClick: onSettingsClick
		},
		{
			name: 'divider',
			icon: null,
		},
		{
			name: 'Logout',
			icon: LogoutIcon,
			onClick: onLogout
		}
	];
};