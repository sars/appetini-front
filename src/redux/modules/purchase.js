import find from 'lodash/find';
import without from 'lodash/without';

const ADD_ORDER_ITEM = 'purchase/ADD_ORDER_ITEM';
const REMOVE_ORDER_ITEM = 'purchase/REMOVE_ORDER_ITEM';
const CLEAR_ORDER_ITEMS = 'purchase/CLEAR_ORDER_ITEMS';

const initialState = {
  orderItems: []
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_ORDER_ITEM:
      const old = find(state.orderItems, {resource_type: action.payload.resource_type});
      const newOrderItems = [...without(state.orderItems, old), action.payload];
      return {
        ...state,
        orderItems: newOrderItems
      };

    case REMOVE_ORDER_ITEM:
      return {
        ...state,
        orderItems: without(state.orderItems, action.payload.orderItem)
      };

    case CLEAR_ORDER_ITEMS:
      return {
        ...state,
        orderItems: []
      };

    default:
      return state;
  }
}

export function addOrderItem(type, resource, amount = 1) {
  return {
    type: ADD_ORDER_ITEM,
    payload: {
      resource_type: type,
      resource_id: resource.id,
      resource: resource,
      amount
    }
  };
}

export function removeOrderItem(orderItem) {
  return {
    type: REMOVE_ORDER_ITEM,
    payload: { orderItem }
  };
}

export function clearOrderItems() {
  return {
    type: CLEAR_ORDER_ITEMS
  };
}
