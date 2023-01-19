import {
  Button,
  ButtonToolbar,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
} from "rsuite";
import { Link } from "react-router-dom";
import "../App.css";

export default function SignUpBox({
  email,
  handleEmailChange,
  password,
  handlePasswordChange,
  signUp,
}) {
  return (
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
  );
}
