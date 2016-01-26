import { combineReducers } from 'redux';
import multireducer from 'multireducer';
import { routeReducer } from 'react-router-redux';

import auth from './auth';
import counter from './counter';
import {reducer as form} from 'redux-form';
import info from './info';
import widgets from './widgets';
import loginModal from './loginModal';
import modals from './modals';
import toast from './toast';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';

export default combineReducers({
  routing: routeReducer,
  auth,
  form,
  multireducer: multireducer({
    counter1: counter,
    counter2: counter,
    counter3: counter
  }),
  info,
  widgets,
  loginModal,
  modals,
  toast,
  reduxAsyncConnect
});
