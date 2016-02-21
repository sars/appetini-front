import { combineReducers } from 'redux';
import multireducer from 'multireducer';
import { routeReducer } from 'react-router-redux';

import auth from './auth';
import counter from './counter';
import {reducer as form} from 'redux-form';
import info from './info';
import modals from './modals';
import toast from './toast';
import common from './common';
import creatingLunch from './creatingLunch';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';

export default combineReducers({
  routing: routeReducer,
  auth,
  form: form.normalize({
    lunchForm: {
      cook_id: value => value && value.toString(),
      ready_by_date: value => value && new Date(value),
      ready_by_time: value => {
        const date = value && new Date(value);
        return date && new Date(2000, 0, 1, date.getHours(), date.getMinutes()).toString();
      },
      food_preference_ids: value => value && value.map(item => item.toString()),
      removing_photos: value => value || []
    }
  }),
  multireducer: multireducer({
    counter1: counter,
    counter2: counter,
    counter3: counter
  }),
  info,
  modals,
  toast,
  common,
  creatingLunch,
  reduxAsyncConnect
});
