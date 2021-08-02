import { LoginIcon } from '@heroicons/react/outline';
import { KeyboardEvent, useContext, useRef, useState } from 'react';
import cx from 'classnames';
import { IUser, IUserCredentials } from '../../../../utils/constants/user';
import { useOnClickOutside } from '../../../../hooks/onClickOutside';
import { firebaseAuth, googleAuthProvider } from '../../../../utils/firebase';
import { AlertContext } from '..';
import { AlertTypes } from '../../../../utils/constants/models/alert';

interface SignInProps {
	onOk: (user: IUser) => void;
	onCancel: () => void;
}

// const allowed_users = [
// 	'uspecify@gmail.com',
// 	'rowell.congzon@gmail.com'
// ];

export const SignIn = (props: SignInProps) => {
	const formRef = useRef<HTMLFormElement>(null);
	const [credentials, setCredentials] = useState<IUserCredentials<string>>(Object);
	const [errors, setErrors] = useState<IUserCredentials<boolean>>(Object);
	const [isSigningIn, setIsSigningIn] = useState(Boolean);

	useOnClickOutside(formRef, props.onCancel);
	const alertCtx = useContext(AlertContext);

	const handleOnSubmit = (withGoogle = false) => {
		if (withGoogle) {
			setIsSigningIn(true);
			firebaseAuth
				.signInWithPopup(googleAuthProvider)
				.then((result) => {
					const { additionalUserInfo } = result;
					const profile: any = additionalUserInfo?.profile;
					if (profile) {
						const { email, id, name, picture } = profile;
						props.onOk({
							email,
							id,
							name,
							picture
						});
					}
					console.log(result);
				});
		} else {

			const _errors: IUserCredentials<boolean> = ["Email", "Password"]
				.reduce((err, key) => {
					return {
						...err,
						[key]: !(
							{ ...credentials }[key]
							&& { ...credentials }[key] !== ""
						)
					};
				}, {
					Email: false,
					Password: false
				});

			if (!_errors.Password
				&& !_errors.Email) {

				setIsSigningIn(true);

				return firebaseAuth
					.signInWithEmailAndPassword(credentials.Email, credentials.Password)
					.then((userCredential) => {
						console.log({ userCredential });
					})
					.catch((error) => {
						console.log({ error });
						const errorMessages: any = {
							"auth/wrong-password": "Wrong Password",
							"auth/user-not-found": "User not Found",
							"auth/invalid-email": "Invalid Email"
						};
						alertCtx.addAlert({
							title: errorMessages[error.code] || "",
							message: error.message,
							type: AlertTypes.Error,
							show: true,
							id: new Date()
								.getTime()
								.toString()
						});
					})
					.finally(() => {
						setIsSigningIn(false);
					});
				// setTimeout(() => {
				// 	setIsSigningIn(false);
				// 	props.onOk({
				// 		Name: credentials.Username,
				// 		Id: credentials.Password
				// 	});
				// }, 1000);
			}

			setErrors(_errors);
		}
	};

	const handleOnChange = (event: KeyboardEvent<HTMLInputElement>) => {
		const { currentTarget: { id, value } } = event;
		setCredentials(p => ({
			...p,
			[id]: value
		}));
		setErrors(p => ({
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
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
							Username
						</label>
						<input
							onKeyUp={handleOnChange}
							id="Email"
							type="text"
							placeholder="Email"
							className={cx("appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline", {
								"border-red-500 ": errors.Email
							})} />
						{errors.Email && (
							<p style={{ bottom: -8 }} className="text-red-500 text-xs italic absolute">Please enter a username.</p>
						)}
					</div>
					<div className="relative">
						<label className="block text-gray-700 text-sm font-bold" htmlFor="password">
							Password
						</label>
						<input
							onKeyUp={handleOnChange}
							id="Password"
							type="password"
							placeholder="Password"
							className={cx("appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline", {
								"border-red-500 ": errors.Password
							})} />
						{errors.Password && (
							<p style={{ bottom: -8 }} className="text-red-500 text-xs italic absolute">Please enter a password.</p>
						)}
					</div>
					<div className="py-3 sm:flex sm:flex-row-reverse">
						<button
							onClick={() => handleOnSubmit()}
							type="button"
							className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-1/2 sm:text-sm">
							{
								isSigningIn
									? "Signing In"
									: "Sign In"
							}
						</button>
						<button type="button" onClick={props.onCancel} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-1/2 sm:text-sm">
							Cancel
						</button>
					</div>
					<span className="text-gray-500 block text-center">OR</span>
					<button
						onClick={() => handleOnSubmit(true)}
						type="button"
						className="uppercase h-9 font-bold mt-3 text-white w-full rounded bg-red-500 hover:bg-red-600">
						Sign in with Google
					</button>
				</div>
			</div>
		</form>
	);
};