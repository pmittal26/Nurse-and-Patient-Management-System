
import React, {useState,useEffect} from 'react';
import { gql, useQuery } from "@apollo/client";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate, useParams} from 'react-router-dom';
import { Container, Row, Col, Image, Form } from 'react-bootstrap';
import patient from '../patientRecord.png';
import { useMutation} from '@apollo/client';
import { useHistory } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';

const ADD_PATIENT_RECORD = gql`
mutation addRecord( $patientId:String!, $nurseId:String!,
$date:String!, $bodyTemperature: Int!,
$bloodPressure:Int!, $heartRate:Int!
$respiratoryRate:Int!)
{
    addRecord( patientId: $patientId
        nurseId: $nurseId
        date: $date
        bodyTemperature:$bodyTemperature
        bloodPressure: $bloodPressure
        heartRate: $heartRate
        respiratoryRate: $respiratoryRate) {
            patientId
            nurseId
            date
            bodyTemperature
            bloodPressure
            heartRate
            respiratoryRate
        
        }
    }
`;

function AddPatientRecord (props){
    let navigate = useNavigate();
    // read the info from props, coming from the ancestor component
    const { nurseId } = props;
    console.log('this is the nurse id:', nurseId.payload._id)
    let {patientIdnew} = useParams();
    console.log('this is the patient id:', patientIdnew);

    const [addRecord, { data, loading, error, refetch }] = useMutation(ADD_PATIENT_RECORD);
    const [record, setRecord] = React.useState({ patientId: '', nurseId: '', date: '',
     bodyTemperature: '', bloodPressure: '', heartRate: '', respiratoryRate: '' });
    const [showLoading, setShowLoading] = useState(false);

  
    if (loading) return 'Submitting...';
    if (error) return `Submission error! ${error.message}`;
  
    
    const saveRecord = (e) => {
        setShowLoading(true);
        e.preventDefault();
        addRecord({variables:{patientId: record.patientId,
            nurseId: nurseId.payload._id,
            date: record.date,
            bodyTemperature:record.bodyTemperature,
            bloodPressure: record.bloodPressure,
            heartRate: record.heartRate,
            respiratoryRate: record.respiratoryRate}
        });
        //
        setRecord({...record, [e.target.name]: ''})
        console.log('nav to record/:',record)
        navigate('/record/' + patientIdnew)

    };
    
    const onChange = (e) => {
        e.persist();   
        const value = e.target.name === 'bodyTemperature' || e.target.name === 'bloodPressure' || e.target.name === 'heartRate' || e.target.name === 'respiratoryRate'
            ? parseInt(e.target.value)
            : e.target.value;
        setRecord({...record, [e.target.name]: value});

      }

    return (
        <div className="App">
            {showLoading && 
            <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
            </Spinner> 
        } 
          <Container fluid>
            <Row>
              <Col>
                <Image
                  src={patient}
                  width="100%"
                  height="100%"
                  alt="Nurse Icon"
                  fluid
                  rounded="true" />
              </Col>
              <Col xs={4.5}>
                <br></br><br></br>
                <h2>NEW RECORD</h2>
                <p style={{color: 'red'}}>Enter vital signs: body temperature, heart rate, blood pressure, or respiratory rate!</p>
                <Form onSubmit={saveRecord}>
                  <Form.Group>
                    <Form.Control
                      className="mb-3"
                      id="patientId"
                      name="patientId"
                      type="text"
                      defaultValue={record.patientId}
                      onChange={onChange} 
                      placeholder="&#xf007; Patient Id" />
                  </Form.Group>
                    <Form.Group>
                    <Form.Control
                      className="mb-3"
                      id="date"
                      name="date"
                      type="text"
                      defaultValue={record.date}
                      onChange={onChange} 
                      placeholder="&#xf073; Date" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Control
                      className="mb-3"
                      id="bodyTemperature"
                      type='number'
                      name="bodyTemperature"
                      defaultValue={record.bodyTemperature}
                      onChange={onChange} 
                      placeholder="&#xf182; Body Temperature" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Control
                      className="mb-3"
                      id="bloodPressure"
                      name="bloodPressure"
                      type="number"
                      defaultValue={record.bloodPressure}
                      onChange={onChange} 
                      placeholder="&#xf043; Blood Pressure" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Control
                      className="mb-3"
                      id="heartRate"
                      name="heartRate"
                      type="number"
                      defaultValue={record.heartRate}
                      onChange={onChange} 
                      placeholder="&#xf004; Heart Rate" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Control
                      className="mb-3"
                      id="respiratoryRate"
                      name="respiratoryRate"
                      type="number"
                      defaultValue={record.respiratoryRate}
                      onChange={onChange} 
                      placeholder="&#xf080; Respiratory Rate" />
                  </Form.Group>
                  {loading ? <p style={{ color: 'blue' }}>Submitting</p> : <div></div>}
                  {error ? <p style={{ color: 'red' }}>{error.message}</p> : <div></div>}
                  <Button size="sm" variant="success" type="submit" >&#xF090; SAVE</Button>
                </Form>
              </Col>
            </Row>
          </Container>
    
        </div>
      );
}

export default AddPatientRecord
