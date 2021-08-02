import { IUser } from '../../../../utils/constants/user';
import { GuestNav } from './GuestNav';
import { MemberNav } from './MemberNav';

interface TopBarProps {
	isLoggedIn: boolean;
	onSignIn: (user: IUser) => void;
	onSignOut?: () => void;
}

export const TopBar = (props: TopBarProps) => {
	const { isLoggedIn, onSignIn, onSignOut } = props;

	const handleOnLogout = () => onSignOut?.();

	return (
		isLoggedIn
			? <MemberNav onLogout={handleOnLogout} />
			: <GuestNav onSignIn={onSignIn} />
	);
};
