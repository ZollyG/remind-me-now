import firebase from "@firebase/app";
import { Alert } from "rsuite";

export default async function signOutFromAuth() {
  try {
    let process = firebase.auth();
    process = await process.signOut();
    console.log("Signed out successfully!", process);
    Alert.info("Signed out");
  } catch (e) {
    console.error(e);
  }
}
