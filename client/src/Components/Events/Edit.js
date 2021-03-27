import { Row, Col, Form, Button } from "react-bootstrap";
import React, { useState } from "react";
import Datetime from "react-datetime";
import { useParams, useHistory, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { apiUpdateEvent, fetchUserData } from "../../api";

function EditEvent({ events }) {
  const { id } = useParams();
  const eventPath = "/events/" + id;

  // Look for the event that needs to be edited
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

  const eventData = event.data;

  return (
    <Row>
      <Col>
        <Row>
          <Col className="my-5">
            <h1>Edit Event</h1>
          </Col>
        </Row>
        <EditEventForm event={eventData} />
        <Row className="my-3">
          <Col>
            <NavLink to={eventPath}>Back</NavLink>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

// Controlled event edit form
function EditEventForm({ event }) {
  // For redirection
  const history = useHistory();

  const [newEvent, setEvent] = useState({
    name: event.name,
    description: event.description,
    date: new Date(),
  });

  function editEvent(ev) {
    ev.preventDefault();

    // PATCH request to the API
    apiUpdateEvent(newEvent, event.id).then((success) => {
      if (success) {
        // If the event was successfully updated, navigate to the event's page
        console.log("Event updated");

        // Refetch the user data
        const userDataSuccess = fetchUserData();

        if (userDataSuccess) {
          history.push("/events/" + event.id);
        }
      } else {
        console.log("Event not updated");
        history.push("/events/" + event.id + "/edit");
      }
    });
  }

  return (
    <Row>
      <Col className="col-lg-9 col-md-12">
        <Form onSubmit={editEvent}>
          <Form.Group controlId="formBasicText">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="event name"
              onChange={(ev) =>
                setEvent({ ...newEvent, name: ev.target.value })
              }
              value={newEvent.name}
            />
          </Form.Group>

          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="event description"
              onChange={(ev) =>
                setEvent({ ...newEvent, description: ev.target.value })
              }
              value={newEvent.description}
            />
          </Form.Group>

          <Form.Group controlId="formDate">
            <Form.Label className="mx-2">Date: </Form.Label>
            <Datetime
              initialValue={new Date()}
              value={newEvent.date}
              onChange={(date) => {
                setEvent({ ...newEvent, date: date.toDate() });
              }}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Col>
    </Row>
  );
}

function stateToProps(state) {
  console.log(state);
  const { events } = state;
  return { events: events };
}

export default connect(stateToProps)(EditEvent);
