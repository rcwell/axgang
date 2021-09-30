import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import { config } from "./config";
import { ICredentials } from "../constants/models";

const initializedApps = firebase.apps;

// INIT
const primaryFirebase = initializedApps.find(({ name }) => name === "[DEFAULT]")
	? firebase.app("[DEFAULT]")
	: firebase.initializeApp(config, "[DEFAULT]");

// Instace for Creating USER ##HACK##
const subFirebase = initializedApps.find(({ name }) => name === "[AUTH]")
	? firebase.app("[AUTH]")
	: firebase.initializeApp(config, "[AUTH]");

// PROVIDERS
const database = firebase.database();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const firebaseAuth = firebase.auth();
const secondaryAuth = subFirebase.auth();
const createAuth = async ({ email, password }: ICredentials) => {
	await secondaryAuth.createUserWithEmailAndPassword(email, password);
	secondaryAuth.signOut();
};

// COLLETIONS
const usersCollection = database.ref("/users");
const inventoryCollection = database.ref("/inventory"); // SLP, Date

const cashoutsCollection = database.ref("/cashouts"); // All Cashout dates, current prices

// EXPORTS
export {
	primaryFirebase as firebase,
	database,
	googleAuthProvider,
	firebaseAuth,
	createAuth,
	usersCollection,
	inventoryCollection,
	cashoutsCollection,
};
