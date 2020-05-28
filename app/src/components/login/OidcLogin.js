import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { H1 } from '@awesomecomponents/mux/core/typography';

import {
  generateAndStoreOAuthState,
  generateAndStoreOAuthCodeVerifierAndChallenge,
  storeOriginalPath,
  getOAuthAuthorizeUri,
} from './loginUtils';
import { useLocalization } from '../locale/LocalizationContext';
import { LOCALE_Redirecting_Azure } from '../locale/keys';

export default function OidcLogin() {
  const { getLocalizedText } = useLocalization();
  const location = useLocation();

  useEffect(() => {
    // Generate OAuth state: https://auth0.com/docs/protocols/oauth2/oauth-state
    // Generate OAuth code verifier and challenge for PKCE: https://auth0.com/docs/flows/concepts/auth-code-pkce
    const state = generateAndStoreOAuthState();
    const challenge = generateAndStoreOAuthCodeVerifierAndChallenge();

    // Get OAuth authorize URI to redirect the user:
    // https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow
    const oauthAuthorizeUri = getOAuthAuthorizeUri(state, challenge);

    // Store original path then redirect to Azure AD authorize endpoint
    storeOriginalPath(location);
    window.location = oauthAuthorizeUri;
  }, [location]);

  return <H1>{getLocalizedText(LOCALE_Redirecting_Azure)}</H1>;
}
