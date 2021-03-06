import without from 'lodash/without';
import some from 'lodash/some';
import pick from 'lodash/pick';
import { reducerWrapper } from 'helpers/memorizedStoreBranches';

const ADD_ORDER_ITEM = 'purchase/ADD_ORDER_ITEM';
const UPDATE_ORDER = 'purchase/UPDATE_ORDER';
const CHANGE_AMOUNT_ORDER_ITEM = 'purchase/CHANGE_AMOUNT_ORDER_ITEM';
const REMOVE_ORDER_ITEM = 'purchase/REMOVE_ORDER_ITEM';
const CLEAR_ORDER_ITEMS = 'purchase/CLEAR_ORDER_ITEMS';
const CLEAR_ORDER = 'purchase/CLEAR_ORDER';

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
  return orderItems.filter(items => (items.resource_type === 'Lunch' || items.resource_type === 'TeamOrder')).length;
}

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case ADD_ORDER_ITEM: {
      /**
       * @description This is a new state of order list, when user added new item to cart.
       * @type {*[]}
       */

      let newOrderItems;
      const orderItems = state.orderItems;
      const newItem = action.payload.orderItem;
      if (some(orderItems, {resource_id: newItem.resource_id, resource_type: newItem.resource_type})) {
        newOrderItems = orderItems.map((item) => {
          if (item.resource_id === newItem.resource_id && item.resource_type === newItem.resource_type) {
            item.amount = item.amount + newItem.amount;
          }
          return item;
        });
      } else {
        newOrderItems = [...orderItems, newItem];
      }

      return {
        ...state,
        orderItems: newOrderItems,
        lunchesAmount: lunchesAmount(newOrderItems)
      };
    }

    case CHANGE_AMOUNT_ORDER_ITEM: {
      /**
       * @description This is new state of order list, when user change amount of lunch from cart.
       * @type {*[]}
       */
      const { orderItem, amountDelta } = action.payload;
      const newOrderItems = state.orderItems.map((item) => {
        const currentAmount = amountDelta + item.amount;
        if ( item === orderItem && currentAmount > 0 && currentAmount <= item.resource.available_count ) {
          return {
            ...item,
            amount: currentAmount
          };
        }
        return item;
      });
      return {
        ...state,
        orderItems: newOrderItems
      };
    }
    case UPDATE_ORDER: {
      /**
       * @description This is new state of order, when admin updates order.
       * @type {*}
       */
      return {
        ...state,
        order: action.payload.order
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
    case CLEAR_ORDER:
      /**
       * @description This is new state of order after end of edit order.
       * @type {*[]}
       */
      return {
        ...state,
        order: undefined
      };

    default:
      return state;
  }
};

export default reducerWrapper(reducer, initialState, 'purchase');

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
 * @param type Type of added item("Lunch" || "DeliveryTariffs" || "TeamOrder")
 * @param resource Resource of added item
 * @param amount Items amount
 * @returns {{type: string, payload: {orderItem: ({resource_type, resource_id, resource, amount}|{resource_type: *, resource_id: *, resource: *, amount: number})}}}
 */
export function addOrderItem(type, resource, amount = 1) {
  return {
    type: ADD_ORDER_ITEM,
    payload: {
      orderItem: orderItemStructure(type, resource, amount)
    }
  };
}

export function addTeamOrder(teamOrder) {
  const preparedTeamOrder = {...teamOrder, ...pick(teamOrder.team_offer, ['cook', 'ready_by'])};
  return addOrderItem('TeamOrder', preparedTeamOrder);
}

export function updateOrder(order) {
  return {
    type: UPDATE_ORDER,
    payload: {
      order
    }
  };
}

export function changeAmountOrderItem(orderItem, amountDelta = 0) {
  return {
    type: CHANGE_AMOUNT_ORDER_ITEM,
    payload: {
      orderItem,
      amountDelta
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

export function clearOrder() {
  return {
    type: CLEAR_ORDER
  };
}
