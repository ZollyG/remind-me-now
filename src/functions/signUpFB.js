import firebase from "@firebase/app";
import "@firebase/firestore";
import "@firebase/analytics";
import "@firebase/auth";
import { Alert } from "rsuite";
import { firebaseConfig } from "../config/firebase";

async function addNewAccountToAuth(emailToAdd, passwordToAdd) {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  let credentials = false;
  try {
    credentials = await firebase
      .auth()
      .createUserWithEmailAndPassword(emailToAdd, passwordToAdd);

    await addNewAccountToFirebaseFirestore(emailToAdd);
  } catch (err) {
    console.error(err);
    Alert.error(err.message);
  }

  return credentials;
}

async function addNewAccountToFirebaseFirestore(emailToAdd) {
  let db = firebase.firestore();
  let dummyObj = {};
  try {
    db.collection("users").doc(String(emailToAdd)).set(dummyObj);
  } catch (err) {
    console.error(err);
  }
}

export default addNewAccountToAuth;
