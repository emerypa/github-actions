import React, { useEffect } from 'react';
import { H1 } from '@awesomecomponents/mux/core/typography';

import { useLoggedUser } from './LoggedUserContext';
import { LOCALE_Redirecting_Azure } from '../locale/keys';
import { useLocalization } from '../locale/LocalizationContext';
import { getOAuthSignoutUri } from './loginUtils';

export default function OidcLogout() {
  const { setLoggedUser } = useLoggedUser();
  const { getLocalizedText } = useLocalization();

  useEffect(() => {
    // Clear logged user from memory and redirect to Azure signout URI
    const signoutUri = getOAuthSignoutUri();
    setLoggedUser(null);
    window.location = signoutUri;
  }, [setLoggedUser]);

  return <H1>{getLocalizedText(LOCALE_Redirecting_Azure)}</H1>;
}
