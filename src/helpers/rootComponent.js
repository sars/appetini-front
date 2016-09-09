import React from 'react';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { translationMessages } from 'i18n';

export default function rootComponent(store, component, langFromReq) {
  const userPreferLang = (__CLIENT__ ? (navigator.language || navigator.userLanguage) : langFromReq).match(/^[a-z]{2}/)[0];
  const lang = ['ru', 'uk'].find(item => item === userPreferLang) ? 'ru' : 'en';

  return (
    <Provider store={store} key="provider">
      <IntlProvider locale={lang} defaultLocale={lang} messages={translationMessages[lang]}>
        {component}
      </IntlProvider>
    </Provider>
  );
}
