import { signInErrorMessages } from "../constants/errorMessages";
import { AlertTypes, IAlert } from "../constants/models";
import { ICredentials } from "../constants/models/user";
import { firebaseAuth } from "../firebase";

export const signIn = async (
	credentials: ICredentials,
	alert?: (alert: IAlert) => void
) => {
	return await firebaseAuth
		.signInWithEmailAndPassword(credentials.email, credentials.password)
		.catch((error) => {
			alert?.({
				title: signInErrorMessages[error.code] || "",
				message: error.message,
				type: AlertTypes.Error,
				show: true,
			});
			return null;
		});
};
