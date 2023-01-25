import firebase from "@firebase/app";
import { Alert } from "rsuite";

export default async function signOutFromAuth() {
  try {
    await firebase.auth().signOut();
    Alert.info("Signed out");
  } catch (e) {
    console.error(e);
  }
}
