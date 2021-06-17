import "./App.css";
import "rsuite/dist/styles/rsuite-default.css";
import firebase from "@firebase/app";
import "@firebase/firestore";
import "@firebase/analytics";
import "@firebase/auth";
import { BrowserRouter, Link, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import addNewAccountToAuth from "./signUp.js";
import signInFirebaseAuth from "./signIn";
import {
  Alert,
  Button,
  ButtonToolbar,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Input,
  Loader,
  Modal,
  Panel,
} from "rsuite";
import PlaceholderParagraph from "rsuite/lib/Placeholder/PlaceholderParagraph";

function App() {
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

  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [user, setUser] = useState("");
  let [userContent, setUserContent] = useState(<Loader></Loader>);
  let [userButton, setUserButton] = useState("");
  let [modal, setModal] = useState(false);
  let [newListTitle, setNewListTitle] = useState("");
  let [newTitleOK, setNewTitleOK] = useState(false);
  let [newListContent, setNewListContent] = useState([]);
  let [newListElement, setNewListElement] = useState("");

  useEffect(() => {
    function checkForLoggedInUser() {
      if (firebase.auth().currentUser) {
        setUserButton(
          <ButtonToolbar className="Buttons">
            <Link to="/" className="LinkNormal">
              <Button color="green" onClick={signOutFromAuth}>
                SIGN OUT
              </Button>
            </Link>

            <Button
              color="red"
              onClick={() => {
                setModal(true);
              }}
            >
              Create new list
            </Button>
          </ButtonToolbar>
        );
      } else {
        setUserButton(
          <ButtonToolbar className="Buttons">
            <Link to="/sign-in" className="LinkNormal">
              <Button color="blue">SIGN IN</Button>
            </Link>
            <Link to="/sign-up" className="LinkNormal">
              <Button color="red">SIGN UP</Button>
            </Link>
          </ButtonToolbar>
        );
      }
    }
    checkForLoggedInUser();
  }, [user]);

  function handleEmailChange(value) {
    setEmail(value);
  }

  function handlePasswordChange(value) {
    setPassword(value);
  }

  function cleanCredentials() {
    setPassword("");
    setEmail("");
  }

  function handleTitleChange(value) {
    setNewListTitle(value);
  }

  function updateTitle() {
    setNewTitleOK(true);
  }

  function handleNewElementChange(value) {
    setNewListElement(value);
  }

  function updateNewList() {
    setNewListContent([...newListContent, <li>{newListElement}</li>]);
    setNewListElement("");
  }

  function deleteLastElement() {
    let aux = [...newListContent];
    if (aux.length === 0) {
      Alert.info("Nothing else to delete!");
      return;
    }
    aux.pop();
    setNewListContent(aux);
  }

  async function sendNewListToDB() {
    let contentToPush = [];

    for (let element of newListContent) {
      contentToPush.push(element.props.children);
    }

    let db = firebase.firestore();
    let dbQuery = db.collection("users").doc(user);
    await dbQuery.update({ [newListTitle]: contentToPush });
    setNewListElement("");
    setNewListTitle("");
    setNewTitleOK(false);
    setNewListContent([]);
    setModal(false);
  }

  async function signUp() {
    if (!email.length || !password.length) {
      Alert.error("Credentials not entered correctly!");
      return;
    }
    console.log(email, password);
    cleanCredentials();

    let authSuccess = await addNewAccountToAuth(email, password);
    setUser(authSuccess.user.email);
  }

  async function signIn() {
    if (!email.length || !password.length) {
      console.log(email, password);
      Alert.error("Credentials not entered correctly!");
      return;
    }
    console.log(email, password);
    cleanCredentials();

    let authSuccess = await signInFirebaseAuth(email, password);
    setUser(authSuccess[0].email);

    setUserContent(authSuccess[1]);
  }

  function signOutFromAuth() {
    setUser("");
    setUserContent("");
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("Signed out successfully!");
        Alert.info("Signed out");
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="App">
      <Modal
        full
        show={modal}
        onHide={() => {
          setModal(false);
        }}
      >
        <Modal.Header>
          <Modal.Title>
            {newTitleOK ? newListTitle : <p>Create new to-do list</p>}
            <hr />
            {!newTitleOK ? (
              <div className="TitleCreate">
                <Input placeholder="Title of todo list" onChange={handleTitleChange} />
                <Button appearance="primary" onClick={updateTitle}>
                  Submit
                </Button>
              </div>
            ) : (
              <div />
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <ul>{newListContent}</ul>
          </div>
          {newTitleOK ? (
            <div className="TitleCreate">
              <Input
                placeholder="Add element to list"
                value={newListElement}
                onChange={handleNewElementChange}
              />
              <Button appearance="primary" onClick={updateNewList}>
                Submit
              </Button>
              <Button appearance="primary" color="red" onClick={deleteLastElement}>
                Delete last
              </Button>
            </div>
          ) : (
            <div />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button appearance="primary" onClick={sendNewListToDB}>
            OK
          </Button>
          <Button appearance="subtle">Cancel</Button>
        </Modal.Footer>
      </Modal>
      <BrowserRouter>
        <div className="Header">
          <div className="WebTitle">
            <Link to="/" className="LinkNormal">
              remind-me-now.
            </Link>
          </div>

          {user}
          {userButton}
        </div>

        <div className="BackgroundSet">
          <div className="Content">
            <Route exact path="/">
              <div> {userContent}</div>
            </Route>
            <Route exact path="/sign-up">
              <div className="SignUpBox">
                <h4>Sign up for a new remind-me-now account</h4>
                <Form fluid>
                  <FormGroup>
                    <ControlLabel>Email</ControlLabel>
                    <FormControl
                      name="email"
                      type="email"
                      onChange={handleEmailChange}
                      value={email}
                    />
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel>Password</ControlLabel>
                    <FormControl
                      name="password"
                      type="password"
                      onChange={handlePasswordChange}
                      value={password}
                    />
                  </FormGroup>
                  <FormGroup>
                    <ButtonToolbar>
                      <Link to="/" className="LinkNormal">
                        <Button color="blue" onClick={signUp}>
                          Submit
                        </Button>
                      </Link>
                    </ButtonToolbar>
                  </FormGroup>
                </Form>
              </div>
            </Route>

            <Route exact path="/sign-in">
              <div className="SignInBox">
                <h4>Log In</h4>
                <Form fluid>
                  <FormGroup>
                    <ControlLabel>Email</ControlLabel>
                    <FormControl
                      name="email"
                      type="email"
                      onChange={handleEmailChange}
                      value={email}
                    />
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel>Password</ControlLabel>
                    <FormControl
                      onChange={handlePasswordChange}
                      value={password}
                      name="password"
                      type="password"
                    />
                  </FormGroup>
                  <FormGroup>
                    <ButtonToolbar>
                      <Link to="/" className="LinkNormal">
                        <Button color="blue" onClick={signIn}>
                          Login
                        </Button>
                      </Link>
                    </ButtonToolbar>
                  </FormGroup>
                </Form>
              </div>
            </Route>
          </div>
          <div className="Footer">©remind-me-now 2021. All rights reserved.</div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
