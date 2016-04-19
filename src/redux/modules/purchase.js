import without from 'lodash/without';
import filter from 'lodash/filter';

const ADD_ORDER_ITEM = 'purchase/ADD_ORDER_ITEM';
const REMOVE_ORDER_ITEM = 'purchase/REMOVE_ORDER_ITEM';
const CLEAR_ORDER_ITEMS = 'purchase/CLEAR_ORDER_ITEMS';

const initialState = {
  orderItems: [],
  lunchesAmount: 0
};

function lunchesAmount(orderItems) {
  return filter(orderItems, {resource_type: 'Lunch'}).length;
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_ORDER_ITEM: {
      const newOrderItems = [...state.orderItems, action.payload.orderItem];

      return {
        ...state,
        orderItems: newOrderItems,
        lunchesAmount: lunchesAmount(newOrderItems)
      };
    }
    case REMOVE_ORDER_ITEM: {
      const newOrderItems = without(state.orderItems, action.payload.orderItem);
      return {
        ...state,
        orderItems: newOrderItems,
        lunchesAmount: lunchesAmount(newOrderItems)
      };
    }
    case CLEAR_ORDER_ITEMS:
      return {
        ...state,
        orderItems: [],
        lunchesAmount: 0
      };

    default:
      return state;
  }
}

export function orderItemStructure(type, resource, amount = 1) {
  return {
    resource_type: type,
    resource_id: resource.id,
    resource: resource,
    amount
  };
}

export function addOrderItem(user, type, resource, amount = 1) {
  return {
    type: ADD_ORDER_ITEM,
    payload: {
      orderItem: orderItemStructure(type, resource, amount)
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
