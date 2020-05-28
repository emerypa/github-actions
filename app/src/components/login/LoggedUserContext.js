import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';

export const LoggedUserContext = React.createContext();

const getDefaultLoggedUserValue = () => {
  // Fake auto-login for local dev and unit tests when the proper env variable is set
  // You can also add any specific user app data as part of the returned object
  if (process.env.REACT_APP_ALLOW_FAKE_LOGIN === 'active') {
    return {
      id: 'fakejohnsmith',
      fullName: 'fakejohnsmith@MFCGD.COM',
      email: 'fakejohnsmith@manulife.ca',
      roles: ['User'],
      idToken: 'fakejohnsmith',
    };
  }
  return null;
};

export function LoggedUserContextProvider({ children }) {
  const [loggedUser, setLoggedUser] = useState(getDefaultLoggedUserValue());

  return <LoggedUserContext.Provider value={{ loggedUser, setLoggedUser }}>{children}</LoggedUserContext.Provider>;
}

LoggedUserContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export const useLoggedUser = () => useContext(LoggedUserContext);
