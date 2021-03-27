import {
  Row,
  Col,
  Badge,
  Button,
  ListGroup,
  InputGroup,
  FormControl,
  Table,
} from "react-bootstrap";
import { connect } from "react-redux";
import { useParams, useHistory, NavLink } from "react-router-dom";
import { useState } from "react";
import { apiPostInvite } from "../../api";

// The Event Show page
function ShowEvent(props) {
  // Redirection and url paramater hooks
  const history = useHistory();
  const { id } = useParams();

  const { events, session } = props;
  const event = events.filter((event) => {
    return event.data.id === parseInt(id);
  })[0];

  // If event hasn't been fetched yet
  if (!event || event === undefined) {
    // history.push("/users/show");
    return (
      <p>
        Loading(Something may have gone wrong... refresh the page or
        logout/login)
      </p>
    );
  }

  const eventData = event.data;
  const ownerData = eventData.user.data;
  const invites = eventData.invites.data;
  const comments = eventData.comments.data;
  const isOwner = session.id === ownerData.id;
  const isInvite = invites.some(
    (invite) => invite.email === session.user_email
  );
  const editPath = "/events/" + eventData.id + "/edit";

  // If Owner, then provide invite link and input box
  let inviteForm = null;
  let editLink = null;
  if (isOwner) {
    inviteForm = <InviteForm event={eventData} history={history} />;
    editLink = <NavLink to={editPath}>Edit Event</NavLink>;
  }

  // If not Owner, then provide invite response options
  let inviteResponse = null;
  if (isInvite) {
    inviteResponse = <InviteResponse event={eventData} history={history} />;
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
                <EventInfo
                  event={eventData}
                  owner={ownerData}
                  editLink={editLink}
                />
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
          <Col className="col-lg-4 col-md-12 mx-2">
            <InviteList invites={invites} />
          </Col>
        </Row>
        <Row>
          <Col>
            <Comments comments={comments} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

function EventInfo({ event, owner, editLink }) {
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
        <Row>
          <Col>{editLink}</Col>
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

// Invite response UI
function InviteResponse({ event, history }) {
  // Update the invite with the new response
  function updateInvite(response) {
    // Make the post request for the new and updated invite
    apiPostInvite(null, event.id, response).then((_success) => {
      // Rerender the page
      history.push("/events/" + event.id);
    });
  }

  return (
    <Row className="my-3">
      <Col>
        <Row className="my-3">
          <Col>Your Response</Col>
        </Row>
        <Row>
          <Button
            variant="success"
            className="mx-2"
            onClick={() => updateInvite("yes")}
          >
            Yes
          </Button>
          <Button
            variant="danger"
            className="mx-2"
            onClick={() => updateInvite("no")}
          >
            No
          </Button>
          <Button
            variant="info"
            className="mx-2"
            onClick={() => updateInvite("maybe")}
          >
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
        {invite.email}: {invite.response}
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
        <Row>
          <ListGroup>{inviteList}</ListGroup>
        </Row>
      </Col>
    </Row>
  );
}

function InviteForm({ event, history }) {
  // Controlled invite form
  const [invite, setInvite] = useState("");

  // Submits the invite
  function submitInvite() {
    console.log("submit", invite);

    // Post the invite
    apiPostInvite(invite, event.id).then((_success) => {
      // Refresh the page with upadted event or error message
      history.push("/events/" + event.id);
    });
  }

  return (
    <Row className="my-3">
      <Col className="col-lg-9 col-md-12">
        <Row className="my-3">
          <Col>
            <h4>Invite Someone!</h4>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Invite's email"
                aria-label="Invite's email"
                aria-describedby="basic-addon2"
                value={invite}
                onChange={(ev) => setInvite(ev.target.value)}
                onKeyPress={(ev) => {
                  if (ev.key === "Enter") {
                    submitInvite();
                  }
                }}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button variant="primary" onClick={submitInvite}>
              Invite
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

function Comments({ comments }) {
  const commentList = comments.map((comment, idx) => {
    return (
      <tr key={idx}>
        <td>{comment.content}</td>
        <td>{comment.user}</td>
      </tr>
    );
  });

  return (
    <Row className="my-4">
      <Col>
        <Row>
          <Col>
            <h2>Comments</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table bordered hover>
              <tbody>{commentList}</tbody>
            </Table>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

function stateToProps(state) {
  // Find the right event and return it's information
  const { events, session } = state;
  return { events: events, session: session };
}

export default connect(stateToProps)(ShowEvent);
