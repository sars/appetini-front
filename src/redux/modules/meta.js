const UPDATE_META = 'meta/UPDATE_META';

const initialState = {
  title: '',
  description: '',
  image: '',
  url: '',
  site_name: 'Appetini.com'
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE_META:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}

export function updateMeta(meta) {
  return {
    type: UPDATE_META,
    payload: meta
  };
}
