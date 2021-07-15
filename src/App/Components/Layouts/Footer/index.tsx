import { AcademicCapIcon } from '@heroicons/react/solid';

export const Footer = () => {
	return (
		<footer className={'bg-gray-50 border-t border-gray-200 py-2 px-6 text-sm flex flex-col items-center sm:flex-row w-full gap-2'}>
			<AcademicCapIcon className="h-5 w-5 text-blue-600" />
			<p>Axgang Academy 2021</p>
		</footer>
	);
};