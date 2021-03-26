import { Row, Col, Badge, Button, ListGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { useParams, useHistory } from "react-router-dom";

// The Event Show page
function ShowEvent(props) {
  // Redirection and url paramater hooks
  const history = useHistory();
  const { eventId } = useParams();

  const { events, session } = props;
  const event = events.filter((event) => event.id == eventId)[0];

  // If event hasn't been fetched yet
  if (!event || event === undefined) {
    history.push("/users/show");
    return <p>Loading</p>;
  }

  const eventData = event.data;
  const ownerData = eventData.user.data;
  const invites = eventData.invites.data;
  const comments = eventData.comments.data;
  const isOwner = session.id === ownerData.id;
  console.log(eventData);

  // If Owner, then provide invite link and input box
  let inviteForm = null;
  if (isOwner) {
    inviteForm = <InviteForm event={eventData} />;
  }

  // If not Owner, then provide invite response options
  let inviteResponse = null;
  if (!isOwner) {
    inviteResponse = <InviteResponse event={eventData} />;
  }

  return (
    <Row className="my-5">
      <Col>
        <Row className="mb-5">
          <Col>
            <h1>{eventData.name}</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <Row>
              <Col>
                <EventInfo event={eventData} owner={ownerData} />
              </Col>
            </Row>
            <Row>
              <Col>
                <InviteInfo event={eventData} />
              </Col>
            </Row>
            <Row>
              <Col>{inviteResponse}</Col>
            </Row>
            <Row>
              <Col>{inviteForm}</Col>
            </Row>
          </Col>
          <Col className="col-lg-4 col-md-12">
            <InviteList invites={invites} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

function EventInfo({ event, owner }) {
  function cleanDate(date) {
    const dateInfo = date.split("T");
    const dateDate = dateInfo[0];
    const dateTime = dateInfo[1];
    return dateDate + ", at " + dateTime;
  }

  return (
    <Row>
      <Col>
        <Row>
          <Col>
            <p>
              <strong>Date:</strong> {cleanDate(event.date)}
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>
              <strong>Description: </strong>
              {event.description}
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>
              <strong>Host Name: </strong>
              {owner.name}
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>
              <strong>Host Email: </strong>
              {owner.email}
            </p>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

function InviteInfo({ event }) {
  return (
    <Row>
      <Button variant="primary" className="m-2">
        <p className="m-0 p-0">Invites</p>
        <Badge variant="light">{event.num_invites}</Badge>
      </Button>

      <Button variant="success" className="m-2">
        <p className="m-0 p-0">Yes</p>
        <Badge variant="light">{event.num_yes}</Badge>
      </Button>

      <Button variant="danger" className="m-2">
        <p className="m-0 p-0">No</p>
        <Badge variant="light">{event.num_no}</Badge>
      </Button>

      <Button variant="info" className="m-2">
        <p className="m-0 p-0">Maybe</p>
        <Badge variant="light">{event.num_maybe}</Badge>
      </Button>

      <Button variant="dark" className="m-2">
        <p className="m-0 p-0">No Response</p>
        <Badge variant="light">{event.num_no_response}</Badge>
      </Button>
    </Row>
  );
}

function InviteResponse({ event }) {
  return (
    <Row className="my-3">
      <Col>
        <Row className="my-3">
          <Col>Your Response</Col>
        </Row>
        <Row>
          <Button variant="success" className="mx-2">
            Yes
          </Button>
          <Button variant="danger" className="mx-2">
            No
          </Button>
          <Button variant="info" className="mx-2">
            Maybe
          </Button>
        </Row>
      </Col>
    </Row>
  );
}

function InviteList({ invites }) {
  const inviteList = invites.map((invite, idx) => {
    return (
      <ListGroup.Item key={idx}>
        <Col>{invite.email}</Col>
        <Col>{invite.response}</Col>
      </ListGroup.Item>
    );
  });
  return (
    <Row>
      <Col>
        <Row>
          <Col>
            <h2>Invites</h2>
          </Col>
        </Row>
        <Row>{inviteList}</Row>
      </Col>
    </Row>
  );
}

function InviteForm({ event }) {
  return (
    <Row>
      <Col>
        <h2>This is the invite form</h2>
      </Col>
    </Row>
  );
}

function stateToProps(state) {
  // Find the right event and return it's information
  console.log("Show events page state: ", state);
  const { events, session } = state;
  return { events: events, session: session };
}

export default connect(stateToProps)(ShowEvent);
