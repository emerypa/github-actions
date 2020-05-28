import React, { useState, useContext } from 'react';

import en from './en.json';
import fr from './fr.json';

const LOCALE_KEY = 'REACT_UI_LOCALE';
const LOCALE_EN = 'en';
const LOCALE_FR = 'fr';

// Get or initialize locale in localStorage
let initialLocale = localStorage.getItem(LOCALE_KEY);
if (initialLocale !== LOCALE_EN && initialLocale !== LOCALE_FR) {
  initialLocale = LOCALE_EN;
  localStorage.setItem(LOCALE_KEY, initialLocale);
}

export const LocalizationContext = React.createContext();

export function LocalizationContextProvider({ children }) {
  const [locale, setLocale] = useState(initialLocale);

  const toggleLocale = () => {
    const newLocale = locale === LOCALE_EN ? LOCALE_FR : LOCALE_EN;
    localStorage.setItem(LOCALE_KEY, newLocale);
    setLocale(newLocale);
  }

  const getLocalizedText = key => {
    let text = null;
    if (locale === LOCALE_EN) {
      text = en[key];
    } else if (locale === LOCALE_FR) {
      text = fr[key];
    }
    return text || 'LOCALIZED_TEXT_NOT_FOUND';
  }

  return (
    <LocalizationContext.Provider value={{ locale, toggleLocale, getLocalizedText }}>
      {children}
    </LocalizationContext.Provider>
  );
}

export const useLocalization = () => useContext(LocalizationContext);
