import firebase from "@firebase/app";
import "@firebase/firestore";
import "@firebase/analytics";
import "@firebase/auth";
import { Alert } from "rsuite";

async function addNewAccountToAuth(emailToAdd, passwordToAdd) {
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

  let credentials = false;
  try {
    credentials = await firebase
      .auth()
      .createUserWithEmailAndPassword(emailToAdd, passwordToAdd);
    console.log("here");
    await addNewAccountToFirebaseFirestore(emailToAdd);
    console.log("added acc to firestore");
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
