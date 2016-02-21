import without from 'lodash/without';

const ADD_TEMP_IMAGE = 'creatingLunch/ADD_TEMP_IMAGE';
const REMOVE_TEMP_IMAGE = 'creatingLunch/REMOVE_TEMP_IMAGE';
const CREATE_LUNCH = 'creatingLunch/CREATE_LUNCH';
const CREATE_LUNCH_SUCCESS = 'creatingLunch/CREATE_LUNCH_SUCCESS';
const CREATE_LUNCH_FAIL = 'creatingLunch/CREATE_LUNCH_FAIL';

const initialState = {
  tempImages: []
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_TEMP_IMAGE:
      return {
        ...state,
        tempImages: [...state.tempImages, action.tempImage]
      };
    case REMOVE_TEMP_IMAGE:
      return {
        ...state,
        tempImages: without(state.tempImages, action.tempImage)
      };
    default:
      return state;
  }
}

export function addTempImage(tempImage) {
  return {
    type: ADD_TEMP_IMAGE,
    tempImage
  };
}

export function removeTempImage(tempImage) {
  return {
    type: REMOVE_TEMP_IMAGE,
    tempImage
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
