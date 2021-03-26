import { Row, Col, Form, Button } from "react-bootstrap";
import React, { useState } from "react";
import DateTimePicker from "react-datetime-picker";
import { useParams } from "react-router-dom";

function EditEvent() {
  const { id } = useParams();

  return (
    <Row>
      <Col>
        <Row>
          <Col className="my-5">
            <h1>Edit Event</h1>
          </Col>
        </Row>
        <EditEventForm />
      </Col>
    </Row>
  );
}

function EditEventForm() {
  const [value, onChange] = useState(new Date());
  const [newEvent, setEvent] = useState({
    name: "",
    description: "",
  });

  function editEvent(ev) {
    ev.preventDefault();
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
            <DateTimePicker onChange={onChange} value={value} />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Col>
    </Row>
  );
}

export default EditEvent;
