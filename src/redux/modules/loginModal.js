const TOGGLE = 'login-modal/TOGGLE';
const LOGIN = 'login-modal/LOGIN';
const LOGIN_SUCCESS = 'login-modal/LOGIN_SUCCESS';
const LOGIN_FAIL = 'login-modal/LOGIN_FAIL';

const initialState = {
  opened: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case TOGGLE:
      return {
        ...state,
        opened: !state.opened
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        opened: false
      };

    default:
      return state;
  }
}

export function toggle() {
  return { type: TOGGLE };
}

export function submit(user) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: (client) => client.post('/api/login', {
      data: { user }
    })
  };
}
