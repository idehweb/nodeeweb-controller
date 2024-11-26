import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { store } from '@/functions/store';
import fa from '@/language/fa/translation';
import { setLanguage } from '@/functions/index';

if (!store.getState().store.lan) setLanguage('fa');

// the translations
const resources = {
  fa: {
    translation: fa(),
  },
};

export default i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'fa',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });
