import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, useLocation } from 'react-router-dom';

import Layout from './Layout';
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';
import OidcLogin from '../login/OidcLogin';
import OidcLoginCallback from '../login/OidcLoginCallback';
import OidcLogout from '../login/OidcLogout';
import FakeLogin from '../login/FakeLogin';
import { LocalizationContextProvider } from '../locale/LocalizationContext';
import { LoggedUserContextProvider, useLoggedUser } from '../login/LoggedUserContext';

function App() {
  return (
    <LocalizationContextProvider>
      <LoggedUserContextProvider>
        <Router>
          <Layout>
            <AppInContextAndRouter />
          </Layout>
        </Router>
      </LoggedUserContextProvider>
    </LocalizationContextProvider>
  );
}

function AppInContextAndRouter() {
  const { loggedUser } = useLoggedUser();
  const location = useLocation();

  // If not currently logged in nor in the login process, redirect to login components,
  // while passing current location in "state" prop, so that the login components
  // know where the user originated to return them back there after the login process.
  // The following example illustrates the redirect journey:
  // (app/user-page -> app/oidc-login -> azure authorize -> app/oidc-login/callback -> app/user-page)
  if (
    !loggedUser &&
    location.pathname !== '/oidc-login' &&
    location.pathname !== '/oidc-login/callback' &&
    location.pathname !== '/oidc-logout' &&
    location.pathname !== '/fake-login'
  ) {
    return (
      <Redirect
        to={{
          pathname: '/oidc-login',
          state: { from: location },
        }}
      />
    );
  }

  return (
    <Switch>
      <Route path="/" exact component={HomePage} />
      <Route path="/oidc-login" exact component={OidcLogin} />
      <Route path="/oidc-login/callback" component={OidcLoginCallback} />
      <Route path="/oidc-logout" component={OidcLogout} />
      {process.env.REACT_APP_ALLOW_FAKE_LOGIN === 'active' && <Route path="/fake-login" component={FakeLogin} />}
      <Route path="*" component={NotFoundPage} />
    </Switch>
  );
}

export default App;
