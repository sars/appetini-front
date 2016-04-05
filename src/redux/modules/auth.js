import Oauth from 'redux/modules/oauth';
import tokenPayload from 'helpers/tokenPayload';
import normalizeOauthData from 'helpers/normalizeOauthData';

const LOGIN = 'auth/LOGIN';
const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'auth/LOGIN_FAIL';
const LOGOUT = 'auth/LOGOUT';
const LOGOUT_SUCCESS = 'auth/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'auth/LOGOUT_FAIL';
const SET_USER = 'auth/SET_USER';
const REGISTRATION = 'auth/REGISTRATION';
const REGISTRATION_INIT = 'auth/REGISTRATION_INIT';
const REGISTRATION_RESET = 'auth/REGISTRATION_RESET';
const RECOVERY_SENT = 'auth/RECOVERY_SENT';
const RECOVERY_PASSWORD_CHANGED = 'auth/RECOVERY_PASSWORD_CHANGED';
const SET_TOKEN = 'auth/SET_TOKEN';
const OAUTH_SIGN_UP = 'auth/OAUTH_SIGN_UP';
const OAUTH_SIGN_UP_SUCCESS = 'auth/OAUTH_SIGN_UP_SUCCESS';
const OAUTH_SIGN_UP_FAIL = 'auth/OAUTH_SIGN_UP_FAIL';

const initialState = {
  tokenPayload: null,
  user: null
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
        user: null,
        tokenPayload: null
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
    case REGISTRATION_INIT:
      return {
        ...state,
        registrationInitial: action.data
      };
    case REGISTRATION_RESET:
      return {
        ...state,
        registrationInitial: null
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

export function clearToken() {
  return {
    type: SET_TOKEN,
    tokenPayload: null
  };
}

export function setToken(token) {
  return {
    type: SET_TOKEN,
    tokenPayload: tokenPayload(token)
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
    promise: (client, getState, dispatch) => client.post('/login', { data: { user }}).then(response => {
      dispatch(setToken(response.auth_token));
      return response;
    })
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

export function join(user) {
  return (dispatch, client) => {
    return client.post('/registration', { data: { user }}).then(response => {
      dispatch({
        type: REGISTRATION
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
    promise: (client, getState, dispatch) => oauthClient.retrieveData(provider).then(response => {
      dispatch(setToken(response.auth_token));
      return response;
    })
  };
}

export function oauthSingUp(provider) {
  const oauthClient = new Oauth({
    facebook: {
      clientId: '1732728180271989'
    },
    vkontakte: {
      clientId: '5223874'
    }
  });

  return {
    types: [OAUTH_SIGN_UP, OAUTH_SIGN_UP_SUCCESS, OAUTH_SIGN_UP_FAIL],
    promise: () => oauthClient.retrieveData(provider)
  };
}

export function initRegistration(provider, data) {
  return {
    type: REGISTRATION_INIT,
    data: normalizeOauthData(provider, data)
  };
}

export function resetRegistration() {
  return {
    type: REGISTRATION_RESET
  };
}
