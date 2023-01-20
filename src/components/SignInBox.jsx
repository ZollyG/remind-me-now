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

export default function SignInBox({
  email,
  handleEmailChange,
  password,
  handlePasswordChange,
  signIn,
}) {
  return (
    <div className="CredBox">
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
  );
}
