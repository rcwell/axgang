import { Transition, Dialog } from '@headlessui/react';
import { useState, Fragment } from 'react';
import { SignIn } from '../../Overlays';

export const GuestNav = () => {
	const [doSignIn, setDoSignIn] = useState(Boolean);

	return (
		<header className="relative bg-white w-full flex items-center border-b-2 border-gray-100 justify-between px-6 py-4 shadow-sm">
			<div className="-mr-2 -my-2 flex flex-row items-center">
				<h1 className="text-2xl font-bold text-gray-800 accent-font ">
					AXGANG
				</h1>
			</div>

			<button
				onClick={() => setDoSignIn(true)}
				className={'flex -my-2 rounded-md p-2 text-sm -flex items-center justify-center font-medium text-white bg-blue-600 hover:bg-blue-700'}>
				Sign in
			</button>

			<Transition appear show={doSignIn} as={Fragment}>
				<Dialog
					as="div"
					className="fixed inset-0 z-10 overflow-y-auto"
					onClose={() => setDoSignIn(false)}>
					<div className="min-h-screen px-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100"
							leaveTo="opacity-0">
							<Dialog.Overlay className="fixed inset-0 bg-blue-900 bg-opacity-30" />
						</Transition.Child>
						<span
							className="inline-block h-screen align-middle"
							aria-hidden="true">
							&#8203;
						</span>
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95">
							<div className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
								<SignIn
									onOk={() => setDoSignIn(false)}
									onCancel={() => setDoSignIn(false)} />
							</div>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
		</header>
	);
};