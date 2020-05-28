import React from 'react';
import { LOCALE_Not_Found_Page } from '../locale/keys';
import { useLocalization } from '../locale/LocalizationContext';

function NotFoundPage() {
  const { getLocalizedText } = useLocalization();

  return (
    <div>
      <h1>{getLocalizedText(LOCALE_Not_Found_Page)}</h1>
    </div>
  );
}

export default NotFoundPage;