import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import { config } from "./config";

// INIT
firebase.initializeApp(config);

// PROVIDERS
const database = firebase.database();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const firebaseAuth = firebase.auth();

// COLLETIONS
const itemsCollection = database.ref("/Items");

// EXPORTS
export {
	firebase,
	database,
	itemsCollection,
	googleAuthProvider,
	firebaseAuth,
};
