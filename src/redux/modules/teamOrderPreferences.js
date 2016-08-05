import { reducerWrapper } from 'helpers/memorizedStoreBranches';

const SET_TEAM_ORDER_USER = 'teamOrderPreferences/SET_TEAM_ORDER_USER';
const ADD_TEAM_ORDER_TO_OWNER = 'teamOrderPreferences/SET_TEAM_ORDER_OWNER_ARRAY';

const initialState = {
  user: {
    token: null,
    name: null
  },
  ownerArray: []
};

const reducer = (state, action) => {
  switch (action.type) {
    case SET_TEAM_ORDER_USER:
      return {
        ...state,
        user: action.user
      };
    case ADD_TEAM_ORDER_TO_OWNER:
      return {
        ...state,
        ownerArray: [...state.ownerArray, action.teamOrderId]
      };
    default:
      return state;
  }
};

export default reducerWrapper(reducer, initialState, 'teamOrderPreferences');

export function setTeamOrderUser(user) {
  return {
    type: SET_TEAM_ORDER_USER,
    user
  };
}

export function addTeamOrderToOwner(teamOrderId) {
  return {
    type: ADD_TEAM_ORDER_TO_OWNER,
    teamOrderId
  };
}
