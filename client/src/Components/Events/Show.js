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
import { apiPostInvite, apiPostComment, apiDeleteComment } from "../../api";

// The Event Show page
function ShowEvent(props) {
  // Redirection and url paramater hooks
  const history = useHistory();
  const { id } = useParams();

  const { events, session } = props;

  // Look for the event that needs to be shown
  const event = events.filter((event) => {
    return event.data.id === parseInt(id);
  })[0];

  // If event hasn't been fetched yet
  if (!event || event === undefined) {
    return (
      <p>
        Loading(Something may have gone wrong... refresh the page or
        logout/login)
      </p>
    );
  }

  const userId = session.id;
  const eventData = event.data;
  const ownerData = eventData.user.data;
  const invites = eventData.invites.data;
  const comments = eventData.comments.data;
  const isOwner = userId === ownerData.id;
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
            <Comments
              comments={comments}
              event={eventData}
              history={history}
              userId={userId}
            />
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

  const inviteLink = "http://events-spa.aryanshah.tech/events/" + event.id;

  // Submits the invite
  function submitInvite() {
    // Post the invite
    apiPostInvite(invite, event.id).then((_success) => {
      // Refresh the page with upadted event or error message
      history.push("/events/" + event.id);
    });

    // Clear the input field
    setInvite("");
  }

  return (
    <Row className="my-3">
      <Col className="col-lg-9 col-md-12">
        <Row>
          <Col className="mt-3">
            <h4>Invite Someone!</h4>
          </Col>
        </Row>
        <Row className="my-3">
          <Col>
            <Badge variant="info">Link: {inviteLink}</Badge>
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

// Comments display UI
function Comments({ comments, event, history, userId }) {
  // Deletes the comment
  function deleteComment(commentId) {
    apiDeleteComment(commentId).then((success) => {
      if (success) {
        window.location.reload();
        console.log("comment deleted");
      } else {
        console.log("comment not deleted");
      }
    });
  }

  // Checks if the logged in owner is authorised
  function commentOwner(comment) {
    return userId == comment.user_id || userId === event.user.data.id;
  }

  const commentList = comments.map((comment, idx) => {
    // If authorised to delete the comment, add delete button
    let deleteButton = null;
    if (commentOwner(comment)) {
      deleteButton = (
        <td>
          <button
            className="btn btn-link text-danger"
            onClick={() => deleteComment(comment.id)}
          >
            Delete
          </button>
        </td>
      );
    }

    return (
      <tr key={idx}>
        <td className="col-lg-6">{comment.content}</td>
        <td className="col-lg-3">
          <Badge variant="info">by {comment.user}</Badge>
        </td>
        {deleteButton}
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
        <CommentForm event={event} history={history} />
        <Row>
          <Col>
            <Table hover>
              <tbody>{commentList}</tbody>
            </Table>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

function CommentForm({ event, history }) {
  // Controlled comment form
  const [comment, setComment] = useState("");

  // Submits the comment
  function submitComment() {
    // Post the invite
    apiPostComment(comment, event.id).then((_success) => {
      // Refresh the page with upadated event or error message
      history.push("/events/" + event.id);
    });

    // Clear the input field
    setComment("");
  }

  return (
    <Row className="my-3">
      <Col className="col-lg-9 col-md-12">
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Comment"
                aria-label="Comment"
                aria-describedby="basic-addon2"
                value={comment}
                onChange={(ev) => setComment(ev.target.value)}
                onKeyPress={(ev) => {
                  if (ev.key === "Enter") {
                    submitComment();
                  }
                }}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button variant="primary" onClick={submitComment}>
              Comment
            </Button>
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
