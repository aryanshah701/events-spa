import { Row, Col, Form, Button, Badge } from "react-bootstrap";
import { useState } from "react";
import { apiLogin, apiRegister } from "../../api";
import { useHistory } from "react-router-dom";

// Register Page
function NewUser() {
  return (
    <Row>
      <Col>
        <Row className="my-5">
          <Col>
            <h1>Register</h1>
          </Col>
        </Row>
        <Row className="my-5">
          <Col className="col-md-12 col-lg-6">
            <RegisterForm />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

// Registeration controlled form
function RegisterForm() {
  // For redirection
  const history = useHistory();

  // Controlled form input
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    passErrorMessage: "",
    nameErrorMessage: "",
    emailErrorMessage: "",
  });

  // From Tuck notes 0323 New.js in Users dir
  function updateState(field, ev) {
    let updatedNewUser = Object.assign({}, newUser);
    updatedNewUser[field] = ev.target.value;
    updatedNewUser.passErrorMessage = checkPassword(
      updatedNewUser.password,
      updatedNewUser.confirmPassword
    );

    updatedNewUser.nameErrorMessage =
      updatedNewUser.name === "" ? "Name cannot be empty" : "";

    updatedNewUser.emailErrorMessage =
      updatedNewUser.email === "" ? "Email cannot be empty" : "";

    setNewUser(updatedNewUser);
  }

  function checkPassword(password, confirmPassword) {
    if (password !== confirmPassword) {
      return "The passwords do not match!";
    } else {
      return "";
    }
  }

  function newUserIsValid() {
    return (
      newUser.nameErrorMessage === "" &&
      newUser.emailErrorMessage === "" &&
      newUser.passErrorMessage === ""
    );
  }

  function registerUser(ev) {
    ev.preventDefault();
    const userToCreate = {
      email: newUser.email,
      name: newUser.name,
      password: newUser.password,
    };

    // Register the user and log him/her in if successful
    apiRegister(userToCreate).then((isSuccess) => {
      if (isSuccess) {
        apiLogin(userToCreate.email, userToCreate.password).then(
          (isLoginSuccess) => {
            if (isLoginSuccess) {
              // Logged in, so redirect to user page
              history.push("/users/show");
            } else {
              // Something went wrong when attempting to login
              history.push("/login");
            }
          }
        );
      }
    });
  }

  return (
    <Form onSubmit={registerUser}>
      <Form.Group controlId="formBasicName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter name"
          onChange={(ev) => updateState("name", ev)}
          value={newUser.name}
        />
        <Badge variant="warning">{newUser.nameErrorMessage}</Badge>
      </Form.Group>

      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          onChange={(ev) => updateState("email", ev)}
          value={newUser.email}
        />
        <Badge variant="warning">{newUser.emailErrorMessage}</Badge>
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          onChange={(ev) => updateState("password", ev)}
          value={newUser.password}
        />
        <Badge variant="warning">{newUser.passErrorMessage}</Badge>
      </Form.Group>

      <Form.Group controlId="formBasicConfirmPassword">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Confirm password"
          onChange={(ev) => updateState("confirmPassword", ev)}
          value={newUser.confirmPassword}
        />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={!newUserIsValid()}>
        Register
      </Button>
    </Form>
  );
}

export default NewUser;
