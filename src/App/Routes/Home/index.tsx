import { ReactComponent as Logo } from '../../../assets/icons/logo.svg';

export const Home = () => {

	return (
		<div className={"w-full flex justify-center items-center"}>
			<Logo className="text-gray-200 max-h-full max-w-full h-3/4 w-3/4" />
		</div>
	);
};
