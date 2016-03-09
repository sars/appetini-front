import React from 'react';
import { Provider } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';
import ruLocaleData from 'react-intl/locale-data/ru';

addLocaleData(ruLocaleData);

export default function rootComponent(store, component) {
  return (
    <Provider store={store} key="provider">
      <IntlProvider locale="ru">
        {component}
      </IntlProvider>
    </Provider>
  );
}
