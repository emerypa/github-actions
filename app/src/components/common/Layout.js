import React from 'react';
import PropTypes from 'prop-types';
import { SideNav, Footer, UtilityHeader } from '@awesomecomponents/mux/core/components';
import { LANG } from '@awesomecomponents/mux/core/lang';
import { useHistory } from 'react-router-dom';

import { LOCALE_App_Title, LOCALE_Logout_From_Azure } from '../locale/keys';
import { useLocalization } from '../locale/LocalizationContext';
import { useLoggedUser } from '../login/LoggedUserContext';
import './Layout.css';

function Layout({ children }) {
  const { locale, toggleLocale, getLocalizedText } = useLocalization();
  const { loggedUser } = useLoggedUser();
  const history = useHistory();

  const leftItems = [
    {
      id: 'header-title',
      label: getLocalizedText(LOCALE_App_Title),
    },
  ];

  const signinSubItems = [];

  if (process.env.REACT_APP_ALLOW_FAKE_LOGIN === 'active') {
    signinSubItems.push({
      label: 'Sign out and fake sign in', // For testing only -- no need to localize
      action: () => history.push('/fake-login'),
    });
  } else {
    signinSubItems.push({
      label: getLocalizedText(LOCALE_Logout_From_Azure),
      action: () => history.push('/oidc-logout'),
    });
  }

  return (
    <div className="Layout">
      <div className="Layout-header">
        <UtilityHeader
          lang={locale === 'en' ? LANG.EN : LANG.FR}
          langToggle={toggleLocale}
          leftItems={leftItems}
          isSignedIn={!!loggedUser}
          signinLabel={loggedUser && loggedUser.fullName}
          signinSubItems={signinSubItems}
        />
      </div>
      <div className="Layout-sideNav">
        <SideNav brandLink={process.env.REACT_APP_BASE_URI} />
      </div>
      <div className="Layout-container">
        <div className="Layout-content">{children}</div>
        <div className="Layout-footer">
          <Footer lang={locale === 'en' ? LANG.EN : LANG.FR} />
        </div>
      </div>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Layout;
