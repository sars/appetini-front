import valueFromLocationQuery from 'helpers/valueFromLocationQuery';

export const filterNames = ['preferences', 'dishes', 'dates', 'time', 'cook_id'];

export function request() {
  return function lunchesRequest({helpers, store}) {
    const filters = filterNames.reduce((result, name) => (
    {...result, [name]: valueFromLocationQuery(store.getState().routing, name)}
    ), {});

    const params = {
      'food_preferences_ids[]': filters.preferences,
      'dishes[]': filters.dishes,
      'cook_id': filters.cook_id,
      'ready_dy_date[]': filters.dates,
      'ready_by_time': filters.time,
      'disable_by_gt': new Date,
      'per_page': 20,
      'page': 1
    };

    return helpers.client.get('/lunches', {params: params});
  };
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
