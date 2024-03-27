// Register.js
import React from 'react';
import { gql, useMutation } from '@apollo/client';
import {Container, Row, Col, Image, Form, Button} from 'react-bootstrap';
import register from '../register.png';

const REGISTER_USER = gql`
mutation RegisterUser(
    $username: String!,
    $firstName: String!,
    $lastName: String!,
    $email: String!,
    $password: String!,
    $userType: String!) {
    register(
      username: $username,
      firstName: $firstName,
      lastName: $lastName,
      email: $email,
      password: $password,
      userType: $userType
    ){
      username,
      email,
      userType
    }
}
`;

//function component to add a user
const RegisterUser = () => {
    const [registerUser, { data, loading, error }] = useMutation(REGISTER_USER);

    let username, firstName, lastName, email, password, userType;

    const handleRegister = async (event) => {
        event.preventDefault();
        try {
            const { data } = await registerUser({
                variables: {
                    username: username.value,
                    firstName: firstName.value,
                    lastName: lastName.value,
                    email: email.value,
                    password: password.value,
                    userType
                }
            });
            console.log('Registered as:', data.register);

            username = '';
            firstName = '';
            lastName = '';
            email = '';
            password = '';
            userType = '';

            window.location.href = '/login';
        } catch (error) {
            console.error('Register error:', error);
        }
    };

    return (
        <div className="App">
            <Container fluid>
                <Row>
                    <Col>
                        <Image
                            src={register}
                            width="100%"
                            alt="Register Icon"
                            fluid
                            rounded="true" />
                    </Col>
                    <Col xs={8}>
                        <h2>Register</h2>
                        <p>Register today to get in touch with the hospital!</p>
                        <form onSubmit={handleRegister}>
                            <Form.Group>
                                <Form.Control
                                    className="mb-3"
                                    type="text"
                                    name="username"
                                    required
                                    ref={node => { username = node; }}
                                    placeholder="&#xF007; username" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Control
                                    className="mb-3"
                                    type="text"
                                    name="firstName"
                                    required
                                    ref={node => { firstName = node; }}
                                    placeholder="&#xF007; first name" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Control
                                    className="mb-3"
                                    type="text"
                                    name="lastName"
                                    required
                                    ref={node => { lastName = node; }}
                                    placeholder="&#xF007; last name" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Control
                                    className="mb-3"
                                    type="email"
                                    name="email"
                                    required
                                    ref={node => { email = node; }}
                                    placeholder="&#xF0E0;  email" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Control
                                    className="mb-3"
                                    type="password"
                                    name="password"
                                    required
                                    ref={node => { password = node; }}
                                    placeholder="&#xF023; password" />
                            </Form.Group>
                            
                            <Form.Group>
                                <Form.Label> User Type:</Form.Label>
                                {['radio'].map((type) => (
                                    <div key={`inline-${type}`} className="mb-3">
                                        <Form.Check
                                            inline
                                            label="Patient"
                                            name="userType"
                                            value="patient"
                                            required
                                            onChange={(e) => {
                                                userType = e.target.value
                                            }}
                                            type={type}
                                            id={`inline-${type}-patient`}
                                        />
                                        <Form.Check
                                            inline
                                            label="Nurse"
                                            name="userType"
                                            value="nurse"
                                            required
                                            onChange={(e) => {
                                                userType = e.target.value
                                            }}
                                            type={type}
                                            id={`inline-${type}-nurse`}
                                        />
                                    </div>
                                ))}
                            </Form.Group>
                            {loading ? <p style={{ color: 'blue' }}>Submitting</p> : <div></div>}
                            {error ? <p style={{ color: 'red' }}>{error.message}</p> : <div></div>}

                            <div className="d-flex justify-content-center App">
                                <Button
                                    variant="success"
                                    className="btn btn-success mx-auto"
                                    type="submit">
                                    &#xF234; Register
                                </Button>
                            </div>

                        </form>
                    </Col>
                </Row>
            </Container>

        </div>
    );
}

export default RegisterUser
