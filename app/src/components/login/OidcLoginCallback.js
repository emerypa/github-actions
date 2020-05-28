import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { useLocation, Link, Redirect } from 'react-router-dom';
import { H1 } from '@awesomecomponents/mux/core/typography';

import { useLoggedUser } from './LoggedUserContext';
import { LOCALE_Completing_Login, LOCALE_Error_Return_Home_Page } from '../locale/keys';
import { useLocalization } from '../locale/LocalizationContext';
import {
  getAndClearStoredOAuthState,
  getAndClearStoredOAuthVerifier,
  fetchAndDecodeOAuthTokens,
  getAndClearStoredOriginalPath,
  injectUserAppData,
} from './loginUtils';

export default function OidcLoginCallback() {
  const [error, setError] = useState(false);
  const location = useLocation();
  const { loggedUser, setLoggedUser } = useLoggedUser();
  const { getLocalizedText } = useLocalization();

  useEffect(() => {
    // Parse query parameters returned on redirect from Azure AD to here
    const queryParams = queryString.parse(location.search);

    // Get stored OAuth state and code verifier
    const state = getAndClearStoredOAuthState();
    const verifier = getAndClearStoredOAuthVerifier();

    // Verify query parameters are valid and compare its state to the initial stored state (CSRF protection)
    if (!queryParams || !queryParams.code || !queryParams.state || queryParams.state !== state) {
      console.warn('Invalid OIDC query parameters or state does not match.');
      setError(true);
      return;
    }

    fetchAndDecodeOAuthTokens(queryParams.code, verifier)
      .then((user) => injectUserAppData(user))
      .then((userWithAppData) => setLoggedUser(userWithAppData))
      .catch((err) => {
        console.error('Error occurred in OIDC login callback.', err);
        setError(true);
      });
  }, [location, setLoggedUser]);

  // If an error occurred, stop redirecting to avoid infinite login loops,
  // and provide a link to the home page (clicking on which would restart the login process)
  if (error) {
    return (
      <H1>
        <Link to="/">{getLocalizedText(LOCALE_Error_Return_Home_Page)}</Link>
      </H1>
    );
  }

  // If the effect completed successfully and loggedUser information was set,
  // redirect to the original page requested before the login proccess
  if (loggedUser) {
    return <Redirect to={getAndClearStoredOriginalPath()} />;
  }

  // Otherwise, show loading message
  return <H1>{getLocalizedText(LOCALE_Completing_Login)}</H1>;
}
