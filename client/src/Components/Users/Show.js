// Show page for a user
import { Row, Col, ListGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { useHistory, NavLink } from "react-router-dom";

function ShowUser(props) {
  // For redirection
  const history = useHistory();
  const { user } = props;

  // If the user data wasn't loaded successfully
  if (!user) {
    return <h1>Loading</h1>;
  }

  const userData = user.data;
  const eventData = userData.events.data;
  const commentData = userData.comments.data;

  return (
    <Row className="my-5">
      <Col>
        <UserInfo userData={userData} eventData={eventData} />
        <Events eventData={eventData} />
        <Comments commentData={commentData} />
      </Col>
    </Row>
  );
}

function UserInfo({ userData, eventData }) {
  return (
    <Row>
      <Col>
        <Row className="my-2">
          <Col className="mx-auto">
            <h1>Welcome {userData.name}</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>Registered Email: {userData.email}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>Number of hosted events: {eventData.length}</p>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

function Events({ eventData }) {
  const events = eventData.map((event) => {
    const eventPath = "/events/" + event.id;
    return (
      <ListGroup>
        <ListGroup.Item>
          <NavLink to={eventPath}>{event.name}</NavLink>
        </ListGroup.Item>
      </ListGroup>
    );
  });

  return (
    <Row className="my-4">
      <Col className="col-lg-6 col-md-12">
        <Row>
          <Col>
            <h2>Your Hosted Events</h2>
          </Col>
        </Row>
        <Row>
          <Col>{events}</Col>
        </Row>
      </Col>
    </Row>
  );
}

function Comments({ commentData }) {
  const comments = commentData.map((comment) => {
    const eventPath = "/events/" + comment.event_id;
    return (
      <Row className="my-4">
        <Col>
          <Row>
            <Col>
              <h2>Activity</h2>
            </Col>
          </Row>
          <ListGroup>
            <ListGroup.Item>
              <NavLink to={eventPath}>{comment.content}</NavLink>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    );
  });

  return (
    <Row>
      <Col>
        <Row>
          <Col>
            <h2>Activity</h2>
          </Col>
        </Row>
        <Row>
          <Col>{comments}</Col>
        </Row>
      </Col>
    </Row>
  );
}

function stateToProps(state) {
  let { user } = state;
  return { user: user };
}

export default connect(stateToProps)(ShowUser);
