import { LockClosedIcon } from '@heroicons/react/outline';
import { KeyboardEvent, useRef, useState } from 'react';
import cx from 'classnames';
import { useOnClickOutside } from '../../../../hooks/onClickOutside';
import { useAlert } from '../../../../contexts/alertContext';
import { useAuth } from "../../../../contexts";
import { AlertTypes } from "../../../../utils/constants/models";
import { useData } from '../../../../contexts/dataContext';

const emptyCredentials = {
	password: '',
	confirmPassword: ''
};
export const PasswordForm = (props: { onClose: () => void, mandate: boolean }) => {
	const formRef = useRef<HTMLFormElement>(null);
	const [credentials, setCredentials] = useState(emptyCredentials);
	const [errors, setErrors] = useState(emptyCredentials);
	const [dirty, setDirty] = useState(Boolean);
	const [isSigningIn, setIsSigningIn] = useState(Boolean);
	const { addAlert } = useAlert();
	const { updatePassword, logout } = useAuth();
	const { updatePerson, setMandatePasswordChange } = useData();

	useOnClickOutside(formRef, props.onClose);

	const handleOnSubmit = () => {
		setDirty(true);
		const _errors = ["password", "confirmPassword"]
			.reduce((err, key) => {
				const value = { ...credentials }[key];
				let msg = '';

				if (key === 'password') {
					msg = value === '' ? 'Please enter password.' : '';
				} else {
					msg = value !== credentials.password ? 'Passwords don\'t match.' : '';
				}

				return {
					...err,
					[key]: msg
				};
			}, {
				password: '',
				confirmPassword: '',
			});

		if (!_errors.password
			&& !_errors.confirmPassword) {
			setIsSigningIn(true);

			return updatePassword(credentials.password)
				?.then(() => {
					if (props.mandate) {
						updatePerson({
							passwordChanged: true
						});
						setMandatePasswordChange(false);
					}
					addAlert({
						title: "Success",
						message: "Password has been updated!",
						type: AlertTypes.Success,
						show: true,
					});
					props.onClose();
				})
				.catch(() => addAlert({
					title: "Failed",
					message: "Password change failed!",
					type: AlertTypes.Error,
					show: true,
				}))
				.finally(() => setIsSigningIn(false));
		}

		setErrors(_errors);
	};

	const handleOnChange = (event: KeyboardEvent<HTMLInputElement>) => {
		const { currentTarget: { id, value, parentElement }, key } = event;

		if (key === 'Enter') {
			if (id === 'password') {
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
	};

	const handleOnCancel = () => {
		if (props.mandate) {
			logout();
		} else {
			props.onClose();
		}
	};

	return (
		<form ref={formRef} className="text-left w-full">
			<div className="flex flex-col px-4 pt-5">
				<div className="flex flex-row items-center gap-2">
					<div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 ">
						<LockClosedIcon className="h-6 w-6 text-blue-600" />
					</div>
					<h3 className="text-lg leading-6 font-medium text-gray-900">
						Change Password
					</h3>
				</div>
				<div className="w-full pt-4 pb-4">
					<div className="relative">
						<label className="block text-gray-700 text-sm font-bold" htmlFor="Password">
							New Password
						</label>
						<input
							onKeyUp={handleOnChange}
							id="password"
							type="password"
							placeholder="Password"
							className={cx("appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline", {
								"border-red-500 ": dirty && errors.password !== ''
							})} />
						{errors.password && (
							<p style={{ bottom: -4 }} className="text-red-500 text-xs italic absolute">{errors.password}</p>
						)}
					</div>
					<div className="relative">
						<label className="block text-gray-700 text-sm font-bold" htmlFor="Password">
							Confirm Password
						</label>
						<input
							onKeyUp={handleOnChange}
							id="confirmPassword"
							type="password"
							placeholder="Password"
							className={cx("appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline", {
								"border-red-500 ": dirty && errors.confirmPassword !== ''
							})} />
						{errors.confirmPassword && (
							<p style={{ bottom: -4 }} className="text-red-500 text-xs italic absolute">{errors.confirmPassword}</p>
						)}
					</div>
					{props.mandate && (
						<p className="text-gray-400 text-xs italic mt-4">
							Mandatory password change for first time login.
						</p>
					)}
				</div>
			</div>
			<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
				<button onClick={handleOnSubmit} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
					{
						isSigningIn
							? "Saving"
							: "Save"
					}
				</button>
				<button
					type="button"
					onClick={handleOnCancel}
					className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
					{props.mandate ? "Logout" : "Cancel"}
				</button>
			</div>
		</form>
	);
};