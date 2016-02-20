const GET_COOKS = 'common/GET_COOKS';
const GET_COOKS_SUCCESS = 'common/GET_COOKS_SUCCESS';
const GET_COOK_FAIL = 'common/GET_COOK_FAIL';
const GET_FOOD_PREFERENCES = 'common/GET_FOOD_PREFERENCES';
const GET_FOOD_PREFERENCES_SUCCESS = 'common/GET_FOOD_PREFERENCES_SUCCESS';
const GET_FOOD_PREFERENCES_FAIL = 'common/GET_FOOD_PREFERENCES_FAIL';

const initialState = {
  loadState: {}
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GET_COOKS:
      return {
        ...state,
        loadState: {
          ...state.loadState,
          cooks: {
            loading: true
          }
        }
      };
    case GET_COOKS_SUCCESS:
      return {
        ...state,
        cooks: action.result.resources,
        loadState: {
          ...state.loadState,
          cooks: {
            loading: false,
            loaded: true
          }
        }
      };
    case GET_COOK_FAIL:
      return {
        ...state,
        cooks: null,
        loadState: {
          ...state.loadState,
          cooks: {
            loading: false,
            loaded: false
          }
        }
      };
    case GET_FOOD_PREFERENCES:
      return {
        ...state,
        loadState: {
          ...state.loadState,
          foodPreferences: {
            loading: true
          }
        }
      };
    case GET_FOOD_PREFERENCES_SUCCESS:
      return {
        ...state,
        foodPreferences: action.result.resources,
        loadState: {
          ...state.loadState,
          foodPreferences: {
            loading: false,
            loaded: true
          }
        }
      };
    case GET_FOOD_PREFERENCES_FAIL:
      return {
        ...state,
        foodPreferences: null,
        loadState: {
          ...state.loadState,
          foodPreferences: {
            loading: false,
            loaded: false
          }
        }
      };
    default:
      return state;
  }
}

export function getCooks() {
  return {
    types: [GET_COOKS, GET_COOKS_SUCCESS, GET_COOK_FAIL],
    promise: client => client.get('/cooks')
  };
}

export function getFoodPreferences() {
  return {
    types: [GET_FOOD_PREFERENCES, GET_FOOD_PREFERENCES_SUCCESS, GET_FOOD_PREFERENCES_FAIL],
    promise: client => client.get('/food_preferences')
  };
}
