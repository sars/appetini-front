/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import createStore from './redux/create';
import ApiClient from './helpers/ApiClient';
import { Router, browserHistory } from 'react-router';
import { ReduxAsyncConnect } from 'redux-async-connect';
import rootComponent from 'helpers/rootComponent';
import useScroll from 'scroll-behavior/lib/useStandardScroll';
import { close as closeModal } from './redux/modules/modals';
import intlPolyfill from 'helpers/intlPolyfill';
import i18next from 'i18next';

import getRoutes from './routes';

const client = new ApiClient();

const history = useScroll(() => browserHistory)();
const dest = document.getElementById('content');
const memorizedStoreBranchesFromLS = window.localStorage.getItem('memorizedStoreBranches');
const memorizedStoreBranches = memorizedStoreBranchesFromLS ? JSON.parse(memorizedStoreBranchesFromLS) : {};
const store = createStore(history, client, {...window.__data, ...memorizedStoreBranches});
client.setStore(store);

history.listenBefore(() => {
  store.dispatch(closeModal());
});

const component = (
  <Router render={(props) =>
        <ReduxAsyncConnect {...props} helpers={{client}} />
      } history={browserHistory}>
    {getRoutes(store, client)}
  </Router>
);

const getTranslations = (lang = (navigator.language || navigator.userLanguage || '').split('-')[0]) => {
  if ( lang === 'ru' || lang === 'uk' ) {
    return {
      lng: 'ru',
      resources: require('locales/ru.json')
    };
  }
  return {
    lng: 'en',
    resources: require('locales/en.json')
  };
};

i18next.init({
  ...getTranslations('ru'),
  saveMissing: true,
  missingKeyHandler: (lng, ns, key) => key
});

intlPolyfill(() => {
  ReactDOM.render(
    rootComponent(store, component),
    dest
  );
});

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger

  if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  }
}

if (__DEVTOOLS__ && !window.devToolsExtension) {
  const DevTools = require('./containers/DevTools/DevTools');
  ReactDOM.render(
    rootComponent(store, (
      <div>
        {component}
        <DevTools />
      </div>
    )),
    dest
  );
}
