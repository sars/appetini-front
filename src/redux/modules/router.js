const initialState = {
  loading: false
};

export default function router(state = initialState, action = {}) {
  switch (action.type) {
    case '@@reduxReactRouter/routerDidChangeStart':
      return {
        ...state,
        loading: true
      };
    case '@@reduxReactRouter/routerDidChange':
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
}
