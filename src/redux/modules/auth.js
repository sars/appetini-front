import Oauth from 'redux/modules/oauth';
import tokenPayload from 'helpers/tokenPayload';

const LOGIN = 'auth/LOGIN';
const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'auth/LOGIN_FAIL';
const LOGOUT = 'auth/LOGOUT';
const LOGOUT_SUCCESS = 'auth/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'auth/LOGOUT_FAIL';
const SET_USER = 'auth/SET_USER';
const RECOVERY_SENT = 'auth/RECOVERY_SENT';
const RECOVERY_PASSWORD_CHANGED = 'auth/RECOVERY_PASSWORD_CHANGED';
const SET_TOKEN = 'auth/SET_TOKEN';

const initialState = {
  loaded: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        loggingIn: true
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        user: action.result.resource
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        user: null,
        loginError: action.error
      };
    case LOGOUT:
      return {
        ...state,
        loggingOut: true
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        user: null
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        logoutError: action.error
      };
    case SET_USER:
      return {
        ...state,
        user: action.user
      };
    case SET_TOKEN:
      return {
        ...state,
        tokenPayload: action.tokenPayload
      };
    default:
      return state;
  }
}

export function setUser(user) {
  return {
    type: SET_USER,
    user
  };
}

export function logout() {
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: (client) => client.del('/logout')
  };
}

export function login(user) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: (client) => client.post('/login', { data: { user }})
  };
}

export function setToken(token) {
  return {
    type: SET_TOKEN,
    tokenPayload: tokenPayload(token)
  };
}

export function sendRecovery(user) {
  return (dispatch, client) => {
    return client.post('/passwords', { data: { user }}).then(response => {
      dispatch({
        type: RECOVERY_SENT
      });
      return response;
    });
  };
}

export function recoveryPasswordChange(user) {
  return (dispatch, client) => {
    return client.put('/passwords', { data: { user }}).then(response => {
      dispatch({
        type: RECOVERY_PASSWORD_CHANGED
      });
      return response;
    });
  };
}

export function oauth(provider) {
  const oauthClient = new Oauth({
    facebook: {
      clientId: '1732728180271989'
    },
    vkontakte: {
      clientId: '5223874'
    }
  });

  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: () => oauthClient.authenticate(provider)
  };
}
