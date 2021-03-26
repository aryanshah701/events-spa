import { Row, Col, Badge } from "react-bootstrap";
import { connect } from "react-redux";
import { fetchEventData } from "../../api";
import { useParams } from "react-router-dom";

// The Event Show page
function ShowEvent(props) {
  const { eventId } = useParams();
  const { events } = props;
  const event = events.filter((event) => event.id == eventId);
  console.log("Curr event" + event);

  return (
    <Row className="my-5">
      <Col>
        <Row>
          <Col>
            <h1>This is the event show page</h1>
          </Col>
        </Row>
        <Row>
          <Col></Col>
        </Row>
      </Col>
    </Row>
  );
}

function stateToProps(state) {
  // Find the right event and return it's information
  const { events } = state;
  return { events: events };
}

export default connect(stateToProps)(ShowEvent);
