import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';


const CovidCheckIn = () => {

  const [minor, setMinor] = useState(1);
  const [severe, setSevere] = useState(1);
  const [num, setNum] = useState();
  
  const handleSubmit = () => {
    if (minor <= 3)
    {
        setNum(0)
    }
    else if (minor >= 3)
    {
        setNum(1)
    }

    if (severe > 1)
    {
        setNum(2)
    }
  };

  const handleMinorChange = (e) => {
    const value = (e.target.checked ? 1 : -1)
    let count = minor;
    setMinor(count + value);
    console.log(minor)
  }

  const handleSevereChange = (e) => {
    const value = (e.target.checked ? 1 : -1)
    let count = severe;
    setSevere(count + value);
  }
  
  const showResult = (num) => {
    switch (num) {
        case 0:
            return "You are likely Healthy! If you still feel unwell, consulting a doctor is recommended."
        case 1:
            return "You probably an infection! It is recommended to get some rest or consult a doctor if the symptoms persist."
        case 2:
            return "It is highly recommend that you take a test!"
        default:
            return null
        }
  }

  return (
    <div className="App">
      <Container>
        <h2>COVID-19 Self Check In</h2>
        <Form>
          <h5>Which of the following symptoms do you have?</h5>          
          <p> Choose all that are new, worsening and not related to other known causes or conditions.</p>

          <Row>
            <Col>
              <Form.Check
                type='checkbox'
                label='Fever or Chills'
                onChange={handleMinorChange}
              />
            </Col>
            <Col>
              <Form.Check
                type='checkbox'
                label='Muscle or Body Aches'
                onChange={handleSevereChange}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Check
                type='checkbox'
                label='Cough'
                onChange={handleMinorChange}
              />
            </Col>
            <Col>
              <Form.Check
                type='checkbox'
                label='Diarrhea'
                onChange={handleSevereChange}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Check
                type='checkbox'
                label='Congestion or Runny Nose'
                onChange={handleMinorChange}
              />
            </Col>
            <Col>
              <Form.Check
                type='checkbox'
                label='Nausea or vomiting'
                onChange={handleSevereChange}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Check
                type='checkbox'
                label='Fatigue'
                onChange={handleMinorChange}
              />
            </Col>
            <Col>
              <Form.Check
                type='checkbox'
                label='Loss of Taste or Smell'
                onChange={handleSevereChange}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Check
                type='checkbox'
                label='Headache'
                onChange={handleMinorChange}
              />
            </Col>
            <Col>
              <Form.Check
                type='checkbox'
                label='Shortness of Breath or Difficulty Breathing'
                onChange={handleSevereChange}
              />
            </Col>
          </Row>

          <div className="d-flex justify-content-center App">
            <Button
              variant="success"
              className="btn btn-success mx-auto"
              onClick={handleSubmit}>
              Submit
            </Button>
          </div>

        </Form>
          <div>
            <h3 style={{color: "green"}}>{showResult(num)}</h3>
          </div>        
      </Container>
    </div>
  );
};

export default CovidCheckIn;