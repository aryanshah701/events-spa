import { Form, Button, Row, Col } from "react-bootstrap";

import { useState } from "react";
import { useHistory } from "react-router-dom";
import { apiLogin } from "../../api";
import { connect } from "react-redux";

// The login page
function LoginUser() {
  // For redirection
  const history = useHistory();

  // Controlled form state
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  // Authenticate the user and the redirect to the user's page
  function login(ev) {
    ev.preventDefault();
    apiLogin(user.email, user.password).then((isSuccess) => {
      if (isSuccess) {
        history.push("/users/show");
      } else {
        history.push("/login");
      }
    });
  }

  // Bootstrap controlled Login Form
  return (
    <Row>
      <Col className="my-5">
        <Row>
          <Col>
            <h1>Login</h1>
          </Col>
        </Row>
        <Row className="my-5">
          <Col className="col-md-12 col-lg-6">
            <Form onSubmit={login}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  onChange={(ev) =>
                    setUser({ ...user, email: ev.target.value })
                  }
                  value={user.email}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={(ev) =>
                    setUser({ ...user, password: ev.target.value })
                  }
                  value={user.password}
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Login
              </Button>
            </Form>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

function stateToProps(state) {
  const { session } = state;
  return {
    session: session,
  };
}

export default connect(stateToProps)(LoginUser);
