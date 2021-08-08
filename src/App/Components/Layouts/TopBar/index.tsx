import { useContext } from 'react';
import { UserContext } from '../../..';
import { GuestNav } from './GuestNav';
import { MemberNav } from './MemberNav';

export const TopBar = () => {
	const { user } = useContext(UserContext);
	return (
		user !== null
			? <MemberNav />
			: <GuestNav />
	);
};
