import firebase from "@firebase/app";
import "@firebase/firestore";
import "@firebase/analytics";
import "@firebase/auth";
import "rsuite/dist/styles/rsuite-default.css";
import { firebaseConfig } from "../config/firebase";

async function signInFirebaseAuth(emailToAdd, passwordToAdd) {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  let credential = await firebase
    .auth()
    .signInWithEmailAndPassword(emailToAdd, passwordToAdd);
  let userContent = await lookUpUserFirestore(credential.user.email);

  return [credential.user, userContent];
}

async function lookUpUserFirestore(emailToFind) {
  let db = firebase.firestore();
  let dbQuery = db.collection("users").doc(emailToFind);
  let findings = await dbQuery.get();

  return findings.data();
}

export { lookUpUserFirestore, signInFirebaseAuth };
