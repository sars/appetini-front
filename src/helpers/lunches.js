import valueFromLocationQuery from 'helpers/valueFromLocationQuery';
import values from 'lodash/values';
import compact from 'lodash/compact';

export const filterNames = ['preferences', 'dishes', 'dates', 'time'];

export function request(requestParams) {
  return function lunchesRequest({helpers, store}) {
    const filters = filterNames.reduce((result, name) => (
    {...result, [name]: valueFromLocationQuery(store.getState().routing, name)}
    ), {});

    const params = {
      'food_preferences_ids[]': filters.preferences,
      'dishes[]': filters.dishes,
      'ready_dy_date[]': filters.dates,
      'ready_by_time': filters.time
    };

    if (requestParams.nearest && !compact(values(filters)).length) {
      params.include_nearest = true;
    }

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
