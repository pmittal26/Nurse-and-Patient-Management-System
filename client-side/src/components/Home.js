// Home.js
import React from 'react';
import "../App.css"
import {Container, Row, Col, Image} from 'react-bootstrap';
import logo from '../logo.png';
import nurseRecord from '../nurseRecord.png';


function Home(props)
{
    return (
        <div className="App">
            <Container fluid>
                <Row>
                    <Col>
                        <Image
                            src={nurseRecord}
                            width="100%"
                            alt="Nurse Icon"
                            fluid
                            rounded="true" />
                    </Col>
                    <Col>
                        <img src={logo} alt="Hospital Icon" />
                        <h4>Welcome to the Released Patient Care</h4>
                        <p>Nurses monitor patients during the first week of their release from the hospital and also help the patients to monitor their daily activities</p>
                    </Col>
                </Row>
            </Container>

        </div>
    );
}

export default Home;