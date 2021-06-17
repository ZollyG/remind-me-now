import firebase from "@firebase/app";
import "@firebase/firestore";
import "@firebase/analytics";
import "@firebase/auth";
import "rsuite/dist/styles/rsuite-default.css";
import "./App.css";

async function signInFirebaseAuth(emailToAdd, passwordToAdd) {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: "AIzaSyAv3uUkpk3mJTOalaEpQtD599j7Utkl5pQ",
      authDomain: "to-do-list-multi-user.firebaseapp.com",
      projectId: "to-do-list-multi-user",
      storageBucket: "to-do-list-multi-user.appspot.com",
      messagingSenderId: "410197619988",
      appId: "1:410197619988:web:f990de0662b51e56a73e01",
      measurementId: "G-CE5CPM0L1D",
    });
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

  return Object.keys(findings.data());
}

export default signInFirebaseAuth;
