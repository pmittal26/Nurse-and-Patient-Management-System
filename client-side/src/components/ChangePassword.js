// ChangePassword.js
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { gql, useMutation } from '@apollo/client';

// mutation for user login
const CHANGE_USER_PASSWORD = gql`
mutation ChangePassword(
  $oldPassword: String!,
  $newPassword: String!) {
  changeUserPassword(
    oldPassword: $oldPassword,
    newPassword: $newPassword      
  )
}
`;

// Login function component
function Login() {
  const [changeUserPassword, { data, loading, error }] = useMutation(CHANGE_USER_PASSWORD);
  let [oldPassword, setOldPassword] = useState('');
  let [newPassword, setNewPassword] = useState('');

  const handleChangeUserPassword = async (event) => {
    event.preventDefault();
    try {
      const { data } = await changeUserPassword({
        variables: { oldPassword, newPassword },
      });
      console.log('Changed user password for:', data.changeUserPassword);
    } catch (error) {
      console.error('Change password error:', error);
    }
  };

  return (
    <div className="App">
      <Form onSubmit={handleChangeUserPassword}>
        <Form.Group>
          <Form.Control
            className="mb-3"
            id="oldPassword"
            type="password"
            required
            onChange={(event) => setOldPassword(event.target.value)}
            placeholder="&#xF023; old password" />
        </Form.Group>
        <Form.Group>
          <Form.Control
            className="mb-3"
            id="newPassword"
            type="password"
            required
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="&#xF023; new password" />
        </Form.Group>
        {data ? <p style={{ color: 'green' }}>Password changed successfully!</p> : <div></div>}
        {loading ? <p style={{ color: 'blue' }}>Submitting</p> : <div></div>}
        {error ? <p style={{ color: 'red' }}>{error.message}</p> : <div></div>}
        <Button size="sm" variant="success" type="submit" >&#xF044; Change Password </Button>
      </Form>
    </div>
  );
}

export default Login;