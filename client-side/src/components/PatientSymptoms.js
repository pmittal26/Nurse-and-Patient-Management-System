import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";

const PatientSymptoms = () => {

  const apiUrl = 'http://localhost:4000/runWithParam';

  const [data, setData] = useState({});
  const [showLoading, setShowLoading] = useState(false);
  const initialInput = {
    age: null,
    sex: '',
    bmi: null,
    fever: '',
    fatigue: '',
    respiratory_symptoms: '',
    gastrointestinal_symptoms: '',
    headache: '',
    skin_symptoms: '',
    joint_pain: '',
    muscle_pain: '',
    swollen_lymph_nodes: '',
    mental_health_symptoms: '',
  };
  const [currentInput, setCurrentInput] = useState(initialInput);

  const handleInputChange = (e) => {
    const value = e.target.name === 'fever'
      || e.target.name === 'fatigue'
      || e.target.name === 'respiratory_symptoms'
      || e.target.name === 'gastrointestinal_symptoms'
      || e.target.name === 'headache'
      || e.target.name === 'skin_symptoms'
      || e.target.name === 'joint_pain'
      || e.target.name === 'muscle_pain'
      || e.target.name === 'swollen_lymph_nodes'
      || e.target.name === 'mental_health_symptoms'
      ? (e.target.checked ? '1' : '0')
      : e.target.value;
    setCurrentInput({ ...currentInput, [e.target.name]: value });
  };
  const getPrediction = (prediction) => {
    const maxValue = Math.max(...Object.values(prediction));
    const maxKey = Object.keys(prediction).find(key => prediction[key] === maxValue);


    switch (maxKey) {
      case 'row1':
        return "You are fine! However, Checkup is always recommended";
      case 'row2':
        return "Go to Doctor to confirm your diagnosis";
      default:
        return "Insufficient data to predict!";
    }
  };

  const handleRun = (e) => {
    e.preventDefault();
    setShowLoading(true);
    setData(null);
    axios
      .post(apiUrl, currentInput)
      .then((result) => {
        setData(result.data);

      })
      .catch((error) => {
        console.log("error in fetchData:", error);
        alert("An error occurred. Please try again later.");
      });
  };
  useEffect(() => {
    if (data) {
      setShowLoading(false);
    }
  }, [data]);


  return (
    <div className="App">
      <Container>
        <div className="warning-box ">
          <p>This assessment is only an aid and cannot replace a diagnosis from a doctor. If this is a medical emergency, please call 911 or go directly to your nearest emergency department.</p>       
        </div>
        <h2>Assessment Tool</h2>
        <Form onSubmit={handleRun}>
          <h5>Basic Information</h5>
          <Form.Group controlId="age" as={Row} className="mb-3">
            <Form.Label column sm="2">Age:</Form.Label>
            <Col sm="10">
              <Form.Control
                className="mb-2"
                type="number"
                min="1"
                max="100"
                defaultValue={currentInput.age}
                onChange={handleInputChange}
                isInvalid={(currentInput.age !== undefined && currentInput.age !== null)
                  && (currentInput.age > 100 || currentInput.age < 1)}
                placeholder="Enter Age"
                name='age'
                required
              />
            </Col>
          </Form.Group>
          <Form.Group controlId="sex" as={Row} className="mb-3">
            <Form.Label column sm="2">Sex:</Form.Label>
            <Col sm="10">
              <Form.Select
                className="mb-2"
                defaultValue={currentInput.sex}
                onChange={handleInputChange}
                name='sex'
                required
              >
                <option value="">Please Select</option>
                <option value={0}>Female</option>
                <option value={1}>Male</option>
              </Form.Select>
            </Col>
          </Form.Group>
          <Form.Group controlId="bmi" as={Row} className="mb-3">
            <Form.Label column sm="2">BMI:</Form.Label>
            <Col sm="10">
              <Form.Control
                className="mb-2"
                type="number"
                step="0.01"
                placeholder='Enter BMI'
                defaultValue={currentInput.bmi}
                onChange={handleInputChange}
                isInvalid={currentInput.bmi !== undefined && currentInput.bmi !== null && currentInput.bmi <= 0}
                name='bmi'
                required
              />
            </Col>
          </Form.Group>

          <h5>Common Signs and Symptoms</h5>
          <p><b>Do you have any of these symptoms?</b> Choose any or all that are new, worsening and not related to other known causes or conditions.</p>

          <Row>
            <Col>
              <Form.Check
                type='checkbox'
                label='Fever'
                onChange={handleInputChange}
                name='fever'
              />
            </Col>
            <Col>
              <Form.Check
                type='checkbox'
                label='Fatigue'
                onChange={handleInputChange}
                name='fatigue'
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Check
                type='checkbox'
                label='Respiratory Symptoms'
                onChange={handleInputChange}
                name='respiratory_symptoms'
              />
            </Col>
            <Col>
              <Form.Check
                type='checkbox'
                label='Gastrointestinal Symptoms'
                onChange={handleInputChange}
                name='gastrointestinal_symptoms'
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Check
                type='checkbox'
                label='Headache'
                onChange={handleInputChange}
                name='headache'
              />
            </Col>
            <Col>
              <Form.Check
                type='checkbox'
                label='Skin Symptoms'
                onChange={handleInputChange}
                name='skin_symptoms'
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Check
                type='checkbox'
                label='Joint Pain'
                onChange={handleInputChange}
                name='joint_pain'
              />
            </Col>
            <Col>
              <Form.Check
                type='checkbox'
                label='Muscle Pain'
                onChange={handleInputChange}
                name='muscle_pain'
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Check
                type='checkbox'
                label='Swollen Lymph Nodes'
                onChange={handleInputChange}
                name='swollen_lymph_nodes'
              />
            </Col>
            <Col>
              <Form.Check
                type='checkbox'
                label='Mental Health Symptoms'
                onChange={handleInputChange}
                name='mental_health_symptoms'
              />
            </Col>
          </Row>

          <div className="d-flex justify-content-center App">
            <Button
              variant="success"
              className="btn btn-success mx-auto"
              type="submit">
              Submit
            </Button>
          </div>

        </Form>
        {data ?(
          <div>
            <h2>Assessment Result</h2>
            <p> {getPrediction(data)}</p>
          </div>
        ) : (
          <div>
            {showLoading && (
              <>
                <p>
                  {" "}
                  <span className="sr-only">Waiting for results...</span>
                </p>
                <Spinner animation="border" />
              </>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export default PatientSymptoms;