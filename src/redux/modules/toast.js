const CLOSE = 'toast/CLOSE';
const OPEN = 'toast/OPEN';

const initialState = {
  active: false,
  label: ''
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case OPEN:
      return {
        ...state,
        active: true,
        label: action.label,
        type: action.toastType,
        icon: action.icon
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

export function show(label, toastType, icon) {
  return {
    type: OPEN,
    label,
    toastType,
    icon
  };
}
