import valueFromLocationQuery from 'helpers/valueFromLocationQuery';

export const filterNames = ['preferences', 'dishes', 'dates', 'time'];

export function request({helpers, store}) {
  const filters = filterNames.reduce((result, name) => (
  {...result, [name]: valueFromLocationQuery(store.getState().routing, name)}
  ), {});

  return helpers.client.get('/lunches', {params: {
    'food_preferences_ids[]': filters.preferences,
    'dishes[]': filters.dishes,
    'ready_dy_date[]': filters.dates,
    'ready_by_time': filters.time
  }});
}
