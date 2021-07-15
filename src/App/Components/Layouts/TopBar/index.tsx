import { IUser } from '../../../../utils/constants/user';
import { GuestNav } from './GuestNav';
import { MemberNav } from './MemberNav';

interface TopBarProps {
	isLoggedIn: boolean;
	onSignIn: (user: IUser) => void;
}

export const TopBar = (props: TopBarProps) => {
	const { isLoggedIn, onSignIn } = props;

	return (
		isLoggedIn
			? <MemberNav />
			: <GuestNav onSignIn={onSignIn} />
	);
};
