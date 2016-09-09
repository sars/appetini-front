import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';

import auth from './auth';
import {reducer as form} from 'redux-form';
import info from './info';
import modals from './modals';
import toast from './toast';
import common from './common';
import purchase from './purchase';
import teamOrderPreferences from './teamOrderPreferences';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';
import {readyByDate, readyByTime} from 'helpers/readyByFields';

export default combineReducers({
  routing: routeReducer,
  auth,
  form: form.normalize({
    lunchForm: {
      cook_id: value => value && value.toString(),
      ready_by_date: readyByDate,
      ready_by_time: readyByTime,
      food_preference_ids: value => value && value.map(item => item.toString()),
      removing_photos: value => value || []
    }
  }),
  info,
  modals,
  toast,
  common,
  purchase,
  reduxAsyncConnect,
  teamOrderPreferences
});
