const LOAD = 'lunch/LOAD';
const LOAD_SUCCESS = 'lunch/LOAD_SUCCESS';
const LOAD_FAIL = 'lunch/LOAD_FAIL';

const initialState = {
  loaded: false
};

export default function info(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result.resource
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    default:
      return state;
  }
}

export function load(id) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/lunches/' + id)
  };
}
