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

export function getLunch(update = false) {
  return ({params, helpers, store: { getState }}) => {
    const oldLunch = getState().reduxAsyncConnect.lunch;
    return Promise.resolve(
      !update && oldLunch && (oldLunch.id.toString() === params.lunchId)
        ? oldLunch
        : helpers.client.get('/lunches/' + params.lunchId).then(response => response.resource)
    );
  };
}
