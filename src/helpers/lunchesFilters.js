import valueFromLocationQuery from 'helpers/valueFromLocationQuery';
import moment from 'moment';

export const filterNames = ['preferences', 'dishes', 'dates', 'time'];

export const deliveryTimeOptions = [
  { value: '12:30', label: '12:30 - 13:00' },
  { value: '13:30', label: '13:30 - 14:00' }
];

export function request({helpers, store}) {
  const filters = filterNames.reduce((result, name) => (
  {...result, [name]: valueFromLocationQuery(store.getState().routing, name)}
  ), {});

  const time = (filters.time || deliveryTimeOptions[0].value).split(':');
  const dates = (filters.dates || []).map(date => moment(date).set({hours: time[0], minutes: time[1]}).format());

  return helpers.client.get('/lunches', {params: {
    'food_preferences_ids[]': filters.preferences,
    'dishes[]': filters.dishes,
    'ready_by[]': dates
  }});
}
