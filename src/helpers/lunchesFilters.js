import valueFromLocationQuery from 'helpers/valueFromLocationQuery';

export const filterNames = ['preferences', 'dishes', 'dates', 'time'];

export const deliveryTimeOptions = [
  { value: '10:30:00', label: '12:30 - 13:00' }, // value in UTC
  { value: '11:30:00', label: '13:30 - 14:00' }  // value in UTC
];

export function request({helpers, store}) {
  const filters = filterNames.reduce((result, name) => (
  {...result, [name]: valueFromLocationQuery(store.getState().routing, name)}
  ), {});

  return helpers.client.get('/lunches', {params: {
    'food_preferences_ids[]': filters.preferences,
    'dishes[]': filters.dishes,
    'ready_dy_date[]': filters.dates,
    'ready_by_time': filters.time || deliveryTimeOptions[0].value
  }});
}
