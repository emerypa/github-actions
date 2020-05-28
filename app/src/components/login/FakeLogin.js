import React, { useState } from 'react';
import { TextInput, Button } from '@awesomecomponents/mux/core/components';
import { useHistory } from 'react-router';

import { useLoggedUser } from './LoggedUserContext';

// This page is for testing purposes only and should never be used in production -- no need to localize
export default function FakeLogin() {
  const [username, setUsername] = useState('');
  const { setLoggedUser } = useLoggedUser();
  const history = useHistory();

  const onLoginClick = () => {
    const user = {
      id: username,
      fullName: `${username}@MFCGD.COM`,
      email: `${username}@manulife.ca`,
      roles: ['User'],
      idToken: username,
    };
    // You can put specific user app data here to store with the logged user info
    const userAppData = {};

    setLoggedUser({ ...user, ...userAppData });
    history.push('/');
  };

  return (
    <div style={{ border: '1px solid black', padding: '30px' }}>
      <TextInput
        label="Manulife LAN ID"
        onChange={(value) => setUsername(value)}
        value={username}
        width="400px"
        placeholder="Enter your Manulife LAN ID. ex: alsamya"
      />{' '}
      <Button variant="primary" onClick={onLoginClick}>
        Login
      </Button>
    </div>
  );
}
