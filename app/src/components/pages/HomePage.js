import React from 'react';
import { LOCALE_Home_Page } from '../locale/keys';
import { useLocalization } from '../locale/LocalizationContext';

function HomePage() {
  const { getLocalizedText } = useLocalization();
  
  return (
    <div>
      <h1>{getLocalizedText(LOCALE_Home_Page)}</h1>
    </div>
  );
}

export default HomePage;