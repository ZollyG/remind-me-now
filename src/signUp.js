import firebase from "@firebase/app";
import "@firebase/firestore";
import "@firebase/analytics";
import "@firebase/auth";

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
  addNewAccountToFirebaseFirestore(emailToAdd);
  let credentials = await firebase
    .auth()
    .createUserWithEmailAndPassword(emailToAdd, passwordToAdd);

  return credentials;
}

function addNewAccountToFirebaseFirestore(emailToAdd) {
  let db = firebase.firestore();
  return db.collection("users").doc(emailToAdd).set({});
}

export default addNewAccountToAuth;
