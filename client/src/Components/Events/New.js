import { Row, Col, Form, Button } from "react-bootstrap";
import React, { useState } from "react";
import { apiCreateNewEvent, fetchUserData } from "../../api";
import Datetime from "react-datetime";
import { useHistory } from "react-router-dom";

function New() {
  return (
    <Row>
      <Col>
        <Row>
          <Col className="my-5">
            <h1>New Event</h1>
          </Col>
        </Row>
        <NewEventForm />
      </Col>
    </Row>
  );
}

function NewEventForm() {
  // For redirection
  const history = useHistory();

  // Controlled form state
  const [newEvent, setEvent] = useState({
    name: "",
    description: "",
    date: new Date(),
  });

  // Triggers POST to create an event
  function createNewEvent(ev) {
    ev.preventDefault();

    // POST request to the API
    apiCreateNewEvent(newEvent).then((eventId) => {
      if (eventId) {
        // If the event was successfully created, navigate to the event's page

        // Refetch the user data
        const userDataSuccess = fetchUserData();

        if (userDataSuccess) {
          history.push("/events/" + eventId);
        }
      } else {
        console.log("Event not created");
        history.push("/events/new");
      }
    });
  }

  // Controlled form
  return (
    <Row>
      <Col className="col-lg-9 col-md-12">
        <Form onSubmit={createNewEvent}>
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

export default New;
