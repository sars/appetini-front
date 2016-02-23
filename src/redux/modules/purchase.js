const INCREMENT_AMOUNT = 'purchase/INCREMENT_AMOUNT';

const initialState = {
  amount: 1
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case INCREMENT_AMOUNT:
      const amount = state.amount + action.amount;
      return {
        ...state,
        amount: amount < 1 ? 1 : amount
      };

    default:
      return state;
  }
}

export function incrementAmount(amount) {
  return {
    type: INCREMENT_AMOUNT,
    amount
  };
}
