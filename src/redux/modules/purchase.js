import without from 'lodash/without';
import filter from 'lodash/filter';

const ADD_ORDER_ITEM = 'purchase/ADD_ORDER_ITEM';
const REMOVE_ORDER_ITEM = 'purchase/REMOVE_ORDER_ITEM';
const CLEAR_ORDER_ITEMS = 'purchase/CLEAR_ORDER_ITEMS';

const initialState = {
  orderItems: [],
  lunchesAmount: 0
};
/**
 * @description This function returns amount of ordered lunches.
 * @param orderItems Array of items in order list.
 * @returns {number}
 */
function lunchesAmount(orderItems) {
  return filter(orderItems, {resource_type: 'Lunch'}).length;
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_ORDER_ITEM: {
      /**
       * @description This is a new state of order list, when user added new item to cart.
       * @type {*[]}
       */
      const newOrderItems = [...state.orderItems, action.payload.orderItem];

      return {
        ...state,
        orderItems: newOrderItems,
        lunchesAmount: lunchesAmount(newOrderItems)
      };
    }
    case REMOVE_ORDER_ITEM: {
      /**
       * @description This is new state of order list, when user removed lunch from cart.
       * @type {*[]}
       */
      const newOrderItems = without(state.orderItems, action.payload.orderItem);
      return {
        ...state,
        orderItems: newOrderItems,
        lunchesAmount: lunchesAmount(newOrderItems)
      };
    }
    case CLEAR_ORDER_ITEMS:
      /**
       * @description This is new state of order list after clearing cart.
       * @type {*[]}
       */
      return {
        ...state,
        orderItems: [],
        lunchesAmount: 0
      };

    default:
      return state;
  }
}
/**
 * @description This function creates structure of last added item to cart.
 * @param type Type of added item("Lunch" || "DeliveryTariffs")
 * @param resource Resource of added item
 * @param amount Items amount
 * @returns {{resource_type: *, resource_id: *, resource: *, amount: number}}
 */
export function orderItemStructure(type, resource, amount = 1) {
  return {
    resource_type: type,
    resource_id: resource.id,
    resource: resource,
    amount
  };
}
/**
 * @description This function adds new item to order list.
 * @param user
 * @param type Type of added item("Lunch" || "DeliveryTariffs")
 * @param resource Resource of added item
 * @param amount Items amount
 * @returns {{type: string, payload: {orderItem: ({resource_type, resource_id, resource, amount}|{resource_type: *, resource_id: *, resource: *, amount: number})}}}
 */
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
