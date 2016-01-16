const CLOSE = 'modals/CLOSE';
const OPEN = 'modals/OPEN';

const initialState = {
  active: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case OPEN:
      return {
        ...state,
        active: true,
        component: action.component,
        title: action.title
      };

    case CLOSE:
      return {
        ...state,
        active: false
      };

    default:
      return state;
  }
}

export function close() {
  return { type: CLOSE };
}

export function open(component, title) {
  return {
    type: OPEN,
    component,
    title
  };
}
