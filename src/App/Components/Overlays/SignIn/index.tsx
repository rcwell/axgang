import { LoginIcon } from '@heroicons/react/outline';
import { KeyboardEvent, useContext, useRef, useState } from 'react';
import cx from 'classnames';
import { ICredentials } from '../../../../utils/constants/models/user';
import { useOnClickOutside } from '../../../../hooks/onClickOutside';
import { signIn } from '../../../../utils/services';
import { useAlert } from '../../../../contexts/alertContext';

interface SignInProps {
	onOk: (user: ICredentials) => void;
	onCancel: () => void;
}

export const SignIn = (props: SignInProps) => {
	const formRef = useRef<HTMLFormElement>(null);
	const [credentials, setCredentials] = useState<any>(Object);
	const [errors, setErrors] = useState<any>(Object);
	const [isSigningIn, setIsSigningIn] = useState(Boolean);
	const { addAlert } = useAlert();

	useOnClickOutside(formRef, props.onCancel);

	const handleOnSubmit = () => {
		const _errors: any = ["email", "password"]
			.reduce((err, key) => {
				return {
					...err,
					[key]: !(
						{ ...credentials }[key]
						&& { ...credentials }[key] !== ""
					)
				};
			}, {
				email: false,
				password: false
			});

		if (!_errors.password
			&& !_errors.email) {

			setIsSigningIn(true);

			return signIn(credentials, addAlert)
				.then((res) => {
					if (res?.user) {
						props.onOk(credentials);
					}
					setIsSigningIn(false);
				});
		}

		setErrors(_errors);
	};

	const handleOnChange = (event: KeyboardEvent<HTMLInputElement>) => {
		const { currentTarget: { id, value, parentElement }, key } = event;

		if (key === 'Enter') {
			if (id === 'email') {
				(parentElement
					?.nextElementSibling
					?.childNodes
					?.[1] as HTMLElement)
					.focus();
			} else {
				handleOnSubmit();
			}
		}

		setCredentials((p: any) => ({
			...p,
			[id]: value
		}));
		setErrors((p: any) => ({
			...p,
			[id]: value === ""
		}));
	};

	return (
		<form ref={formRef} className="text-left w-full">
			<div className="flex flex-col px-4 pt-5">
				<div className="flex flex-row items-center gap-2">
					<div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 ">
						<LoginIcon className="h-6 w-6 text-blue-600" />
					</div>
					<h3 className="text-lg leading-6 font-medium text-gray-900">
						Sign In
					</h3>
				</div>
				<div className="w-full pt-4 pb-4">
					<div className="mb-4 relative">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Email">
							Email
						</label>
						<input
							onKeyUp={handleOnChange}
							id="email"
							type="text"
							placeholder="Email"
							className={cx("appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline", {
								"border-red-500 ": errors.email
							})} />
						{errors.email && (
							<p style={{ bottom: -8 }} className="text-red-500 text-xs italic absolute">Please enter a username.</p>
						)}
					</div>
					<div className="relative">
						<label className="block text-gray-700 text-sm font-bold" htmlFor="Password">
							Password
						</label>
						<input
							onKeyUp={handleOnChange}
							id="password"
							type="password"
							placeholder="Password"
							className={cx("appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline", {
								"border-red-500 ": errors.password
							})} />
						{errors.password && (
							<p style={{ bottom: -8 }} className="text-red-500 text-xs italic absolute">Please enter a password.</p>
						)}
					</div>
				</div>
			</div>
			<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
				<button onClick={handleOnSubmit} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
					{
						isSigningIn
							? "Signing In"
							: "Sign In"
					}
				</button>
				<button type="button" onClick={props.onCancel} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
					Cancel
				</button>
			</div>
		</form>
	);
};