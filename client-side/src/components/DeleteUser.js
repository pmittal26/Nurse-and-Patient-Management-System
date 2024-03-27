// DeleteUser.js
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { gql, useMutation } from '@apollo/client';

// mutation for user login
const DELETE_USER = gql`
    mutation DeleteUser( $username: String! ) {
        deleteUser( username: $username )  
    }
`;

// Login function component
function Login() {
  const [deleteUser, { data, loading, error }] = useMutation(DELETE_USER);
  let [username, setUsername] = useState('');

  const handleDeleteUser = async (event) => {
    event.preventDefault();
    try {
      const { data } = await deleteUser({
        variables: { username },
      });
      console.log('Deleted user as:', data.deletedUser);
      if (sessionStorage.getItem("username") !== undefined
        && username === sessionStorage.getItem("username")) {
        sessionStorage.setItem("username", '');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Delete user error:', error);
    }
  };

  return (
    <div className="App">
      <Form onSubmit={handleDeleteUser}>
        <Form.Group>
          <Form.Control
            className="mb-3"
            id="username"
            type="username"
            onChange={(event) => setUsername(event.target.value)}
            placeholder="&#xF007; Please enter username to confirm" />
        </Form.Group>
        {data ? <p style={{ color: 'green' }}>User deleted</p> : <div></div>}
        {loading ? <p style={{ color: 'blue' }}>Submitting</p> : <div></div>}
        {error ? <p style={{ color: 'red' }}>{error.message}</p> : <div></div>}
        <Button size="sm" variant="danger" type="submit" >&#xF1F8; Delete User </Button>
      </Form>
    </div>
  );
}
//
export default Login;