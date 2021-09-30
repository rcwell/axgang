import { GuestNav } from './GuestNav';
import { MemberNav } from './MemberNav';
import { useAuth } from '../../../../contexts';

export const TopBar = () => {
	const { currentUser } = useAuth();
	return currentUser
		? <MemberNav />
		: <GuestNav />;
};
