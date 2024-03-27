// Login.js
import React, { useState } from 'react';
import { Container, Row, Col, Image, Form, Button } from 'react-bootstrap';
import { gql, useMutation } from '@apollo/client';
import login from '../login.png';
import {
  useAuthToken,
  useAuthUserToken,
  useAuthUserType,
} from "./config/auth";
// mutation for user login
const LOGIN_USER = gql`
mutation Login( $emailOrUsername: String!, $password: String! ) {
	login( emailOrUsername: $emailOrUsername, password: $password)
  {
      username
      email
      userType
      token
      _id
  }
}
`;

// Login function component
function Login() {
  const [loginUser, { data, loading, error }] = useMutation(LOGIN_USER);
  let [emailOrUsername, setEmailOrUsername] = useState('');
  let [password, setPassword] = useState('');
  const [_, setAuthToken, removeAuthtoken] = useAuthToken();
  const [__, setAuthUserToken, removeAuthUsertoken] = useAuthUserToken();
  const [___, setAuthUserType, removeAuthUserType] = useAuthUserType();
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const { data } = await loginUser({
        variables: { 
          emailOrUsername, 
          password },
      });
      console.log('Logged in as:>>>>>>>>>>>', data);
      console.log('Logged in as:', data.login);
      sessionStorage.setItem("username", data.login.username);

      setAuthToken(data.login.token);
      setAuthUserToken(data.login.username);
      setAuthUserType(data.login.userType);
      window.location.href = '/home';
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="App">
      <Container fluid>
        <Row>
          <Col>
            <Image
              src={login}
              width="100%"
              alt="Nurse Icon"
              fluid
              rounded="true" />
          </Col>
          <Col xs={8}>
            <h2>Login</h2>
            <p>Login to access and record daily medical information!</p>
            <Form onSubmit={handleLogin}>
              <Form.Group>
                <Form.Control
                  className="mb-3"
                  id="emailOrUsername"
                  onChange={(event) => setEmailOrUsername(event.target.value)}
                  placeholder="&#xF0E0; email or username" />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  className="mb-3"
                  id="password"
                  type="password"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="&#xF023; password" />
              </Form.Group>
              {loading ? <p style={{ color: 'blue' }}>Submitting</p> : <div></div>}
              {error ? <p style={{ color: 'red' }}>{error.message}</p> : <div></div>}

              <div className="d-flex justify-content-center App">
                <Button
                  variant="success"
                  className="btn btn-success mx-auto"
                  type="submit">
                  &#xF090; Login
                </Button>
              </div>

            </Form>
          </Col>
        </Row>
      </Container>

    </div>
  );
}
//
export default Login;