const GET_COOKS = 'common/GET_COOKS';
const GET_COOKS_SUCCESS = 'common/GET_COOKS_SUCCESS';
const GET_COOK_FAIL = 'common/GET_COOK_FAIL';
const GET_FOOD_PREFERENCES = 'common/GET_FOOD_PREFERENCES';
const GET_FOOD_PREFERENCES_SUCCESS = 'common/GET_FOOD_PREFERENCES_SUCCESS';
const GET_FOOD_PREFERENCES_FAIL = 'common/GET_FOOD_PREFERENCES_FAIL';
const CREATE_COOK = 'common/CREATE_LUNCH';
const CREATE_COOK_SUCCESS = 'common/CREATE_LUNCH_SUCCESS';
const CREATE_COOK_FAIL = 'common/CREATE_LUNCH_FAIL';
const CREATE_LUNCH = 'common/CREATE_LUNCH';
const CREATE_LUNCH_SUCCESS = 'common/CREATE_LUNCH_SUCCESS';
const CREATE_LUNCH_FAIL = 'common/CREATE_LUNCH_FAIL';
const CREATE_ORDER = 'common/CREATE_ORDER';
const CREATE_ORDER_SUCCESS = 'common/CREATE_ORDER_SUCCESS';
const CREATE_ORDER_FAIL = 'common/CREATE_ORDER_FAIL';

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

export function createCook(cook) {
  return {
    types: [CREATE_COOK, CREATE_COOK_SUCCESS, CREATE_COOK_FAIL],
    promise: client => client.post('/cooks', { data: { resource: cook}})
  };
}

export function updateCook(cook) {
  return {
    types: [CREATE_COOK, CREATE_COOK_SUCCESS, CREATE_COOK_FAIL],
    promise: client => client.put(`/cooks/${cook.id}`, { data: { resource: cook}})
  };
}

export function createLunch(lunch) {
  return {
    types: [CREATE_LUNCH, CREATE_LUNCH_SUCCESS, CREATE_LUNCH_FAIL],
    promise: client => client.post('/lunches', { data: { resource: lunch}})
  };
}

export function updateLunch(lunch) {
  return {
    types: [CREATE_LUNCH, CREATE_LUNCH_SUCCESS, CREATE_LUNCH_FAIL],
    promise: client => client.put(`/lunches/${lunch.id}`, { data: { resource: lunch}})
  };
}

export function createOrder(order) {
  return {
    types: [CREATE_ORDER, CREATE_ORDER_SUCCESS, CREATE_ORDER_FAIL],
    promise: client => client.post('/orders', { data: { resource: order}})
  };
}

export function updateOrder(order) {
  return {
    types: [CREATE_ORDER, CREATE_ORDER_SUCCESS, CREATE_ORDER_FAIL],
    promise: client => client.put(`/orders/${order.id}`, { data: { resource: order}})
  };
}
