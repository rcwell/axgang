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

const usersCollection = database.ref("/users");
const accountsCollection = database.ref("/accounts");
const inventoryCollection = database.ref("/inventory");
const cashoutsCollection = database.ref("/cashouts");

// EXPORTS
export {
	firebase,
	database,
	googleAuthProvider,
	firebaseAuth,
	itemsCollection,
	usersCollection,
	accountsCollection,
	inventoryCollection,
	cashoutsCollection,
};
