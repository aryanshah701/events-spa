// Show page for a user
import { Row, Col, ListGroup, Badge } from "react-bootstrap";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";

function ShowUser(props) {
  const { user, events } = props;

  // If the user data wasn't loaded successfully
  if (!user) {
    return (
      <p>
        Loading(Something may have gone wrong... refresh the page or
        logout/login)
      </p>
    );
  }

  const userData = user.data;
  const eventData = events.map((eventInList) => eventInList.data);
  const commentData = userData.comments.data;

  return (
    <Row className="my-5">
      <Col>
        <UserInfo userData={userData} eventData={eventData} />
        <Events eventData={eventData} userId={userData.id} />
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
            <p>Number of events(hosted/invited): {eventData.length}</p>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

// Display all the events hosted by the user and the user is invited to
function Events({ eventData, userId }) {
  const events = eventData.map((event, idx) => {
    const attendeeType = isOwner(userId, event) ? "Host" : "Invite";
    const eventPath = "/events/" + event.id;
    return (
      <ListGroup.Item key={idx}>
        <NavLink to={eventPath}>
          {event.name}
          <Badge className="float-right" variant="info">
            {attendeeType}
          </Badge>
        </NavLink>
      </ListGroup.Item>
    );
  });

  return (
    <Row className="my-4">
      <Col className="col-lg-6 col-md-12">
        <Row>
          <Col>
            <h2>Your Events</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <ListGroup>{events}</ListGroup>
          </Col>
        </Row>
        <Row className="my-2">
          <Col>
            <NavLink to={"/events/new"}>Create New Event</NavLink>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

// Checks whether or not the user is the owner of the given event
function isOwner(userId, event) {
  return event.user.data.id === userId;
}

function Comments({ commentData }) {
  const comments = commentData.map((comment, idx) => {
    const eventPath = "/events/" + comment.event;
    return (
      <ListGroup.Item key={idx}>
        <NavLink to={eventPath}>{comment.content}</NavLink>
      </ListGroup.Item>
    );
  });

  return (
    <Row className="my-4">
      <Col>
        <Row>
          <Col>
            <h2>Activity</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <ListGroup>{comments}</ListGroup>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

function stateToProps(state) {
  let { user, events } = state;
  return { user: user, events: events };
}

export default connect(stateToProps)(ShowUser);
