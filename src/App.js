import "./App.css";
import "rsuite/dist/styles/rsuite-default.css";
import firebase from "@firebase/app";
import "@firebase/firestore";
import "@firebase/analytics";
import "@firebase/auth";
import { BrowserRouter, Link, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import addNewAccountToAuth from "./functions/signUpFB.js";
import { signInFirebaseAuth, lookUpUserFirestore } from "./functions/signInFB";
import { Alert, Button, Loader, Navbar, Nav } from "rsuite";
import { Helmet } from "react-helmet";
import SignUpBox from "./components/SignUpBox";
import SignInBox from "./components/SignInBox";
import signOutFromAuth from "./functions/signOutFB";
import ModalList from "./components/ModalList";
import { firebaseConfig } from "./config/firebase";
import { BASIC_MESSAGE } from "./config/basicMessage";

let userData = { ans: false };

function setGlobal(thing) {
  userData = { ans: thing };
}

function App() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  let [user, setUser] = useState("");
  let [userContent, setUserContent] = useState(BASIC_MESSAGE);
  let [userButton, setUserButton] = useState();
  let [modal, setModal] = useState(false);
  let [newListTitle, setNewListTitle] = useState("");
  let [newTitleOK, setNewTitleOK] = useState(false);
  let [newListContent, setNewListContent] = useState([]);
  let [newListElement, setNewListElement] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  useEffect(() => {
    function checkForLoggedInUser() {
      if (firebase.auth().currentUser) {
        setUserButton(
          <Nav pullRight>
            <Nav.Item
              onClick={() => {
                setModal(true);
              }}
            >
              Add new list
            </Nav.Item>

            <Link to="/" className="LinkNormal">
              <Nav.Item onClick={signOut}>SIGN OUT</Nav.Item>
            </Link>
          </Nav>
        );
      } else {
        setUserButton(
          <Nav pullRight>
            <Link to="/sign-in" className="LinkNormal">
              <Nav.Item>SIGN IN</Nav.Item>
            </Link>
            <Link to="/sign-up" className="LinkNormal">
              <Nav.Item>SIGN UP</Nav.Item>
            </Link>
          </Nav>
        );
      }
    }
    checkForLoggedInUser();
  }, [user]);

  function cleanCredentials() {
    setPassword("");
    setEmail("");
  }
  function handleEmailChange(value) {
    setEmail(value);
  }

  function handlePasswordChange(value) {
    setPassword(value);
  }

  function processDBObject(dbObject) {
    let toRender = [
      <div className="TitleAnnounce">
        <p>Your saved lists:</p> <hr />
      </div>,
    ];
    for (let idx in dbObject) {
      let temp = [];
      for (let listElement of dbObject[idx]) {
        temp.push(<li>{listElement}</li>);
      }
      toRender.push(
        <div id={idx} className="List">
          <div className="ListContent">
            <h2>{idx}</h2>
            <ul>{temp}</ul>
          </div>
          <div>
            <Button
              color="red"
              onClick={() => {
                deleteList(idx);
              }}
            >
              Delete this list
            </Button>
          </div>
        </div>
      );
    }

    if (toRender.length === 1) {
      toRender = [
        <div>
          <p>You currently don't have any todo lists!</p>
          <hr />
        </div>,
      ];
    }
    return toRender;
  }

  async function deleteList(idx) {
    setUserContent(<Loader size="lg" />);
    let db = firebase.firestore();

    let ref = db.collection("users").doc(userData["ans"]);
    await ref.update({ [idx]: firebase.firestore.FieldValue.delete() });

    let newContent = await lookUpUserFirestore(userData["ans"]);
    setUserContent(processDBObject(newContent));
  }

  async function sendNewListToDB() {
    if (newListTitle === "") {
      Alert.info("Please enter a title.");
      return;
    }
    setUserContent(<Loader />);
    let contentToPush = [];

    for (let element of newListContent) {
      contentToPush.push(element.props.children);
    }

    let db = firebase.firestore();
    console.log(userData["ans"]);
    let dbQuery = db.collection("users").doc(userData["ans"]);

    setNewListElement("");
    setNewListTitle("");
    setNewTitleOK(false);
    setNewListContent([]);
    setModal(false);

    await dbQuery.update({ [newListTitle]: contentToPush });
    let newContent = await lookUpUserFirestore(userData["ans"]);
    setUserContent(processDBObject(newContent));
  }

  async function signUp() {
    if (!email.length || !password.length) {
      Alert.error("Credentials not entered correctly!");
      return;
    }

    cleanCredentials();
    setUserContent(<Loader size="lg" />);
    setUser(<Loader />);

    let authSuccess = await addNewAccountToAuth(email, password);
    if (!authSuccess) {
      setGlobal("");
      setUser("");
      setUserContent(BASIC_MESSAGE);
    } else {
      setGlobal(authSuccess.user.email);
      setUser(authSuccess.user.email);
      setUserContent(
        <div>
          <p>You currently don't have any todo lists!</p>
          <hr />
        </div>
      );
    }
  }

  async function signIn() {
    if (!email.length || !password.length) {
      Alert.error("Credentials not entered correctly!");
      return;
    }
    setUserContent(<Loader size="lg" />);
    setUser(<Loader />);
    cleanCredentials();
    try {
      let authSuccess = await signInFirebaseAuth(email, password);
      setGlobal(authSuccess[0].email);
      setUser(authSuccess[0].email);
      setUserContent(processDBObject(authSuccess[1]));
    } catch (err) {
      Alert.error("Credentials not entered correctly!");
      setUserContent(BASIC_MESSAGE);
      setUser("");
    }
  }

  function signOut() {
    setUser("");
    setUserContent(BASIC_MESSAGE);
    setGlobal(false);
    signOutFromAuth();
  }

  return (
    <div className="App">
      <Helmet>
        <title>remind-me-now</title>
      </Helmet>

      <ModalList
        modal={modal}
        setModal={setModal}
        newListTitle={newListTitle}
        setNewListTitle={setNewListTitle}
        newTitleOK={newTitleOK}
        setNewTitleOK={setNewTitleOK}
        newListElement={newListElement}
        setNewListElement={setNewListElement}
        newListContent={newListContent}
        setNewListContent={setNewListContent}
        sendNewListToDB={sendNewListToDB}
      />

      <BrowserRouter>
        <Navbar appearance="inverse" className="Header">
          <Navbar.Header>
            <Nav>
              <Nav.Item>
                <Link to="/" className="LinkNormal">
                  remind-me-now.
                </Link>
              </Nav.Item>
            </Nav>
          </Navbar.Header>
          <Navbar.Body>
            {user ? (
              <Nav pullRight>
                <Nav.Item>{<div>Hello, {user} </div>}</Nav.Item>
              </Nav>
            ) : (
              <></>
            )}

            {userButton}
          </Navbar.Body>
        </Navbar>

        <div className="BackgroundSet">
          <div className="Content">
            <Route exact path="/">
              {userContent}
            </Route>
            <Route exact path="/sign-up">
              <SignUpBox
                signUp={signUp}
                email={email}
                password={password}
                handleEmailChange={handleEmailChange}
                handlePasswordChange={handlePasswordChange}
              />
            </Route>

            <Route exact path="/sign-in">
              <SignInBox
                signIn={signIn}
                email={email}
                password={password}
                handleEmailChange={handleEmailChange}
                handlePasswordChange={handlePasswordChange}
              />
            </Route>
          </div>
          <div className="Footer">©remind-me-now 2023. All rights reserved.</div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
