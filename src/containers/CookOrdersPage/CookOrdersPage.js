import React, { Component, PropTypes } from 'react';
import CookOrderPreview from 'components/CookOrderPreview/CookOrderPreview';
import OrdersForCookCourier from 'components/OrdersForCookCourier/OrdersForCookCourier';
import { asyncConnect } from 'redux-async-connect';
import {getParams} from 'helpers/ordersDateHelper';
import flatten from 'lodash/flatten';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';
import sumBy from 'lodash/sumBy';

const getOrderItems = (orders) => {
  return flatten(orders.map((order) => {
    return order.order_items.map((orderItem) => {
      return {...orderItem, order_id: order.id};
    });
  }));
};

@asyncConnect([
  {key: 'orders', promise: ({helpers, params, location}) =>
    helpers.client.get(`/cooks/${params.cookId}/orders`,
      {params: getParams(location)})
        .then(response => response.resources)}
])

export default class CookOrdersPage extends Component {

  static propTypes = {
    orders: PropTypes.array,
    location: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      groupedOrders: undefined
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && this.state.groupedOrders) {
      this.sortByOrderItem();
    }
  }

  sortByOrderItem() {
    const groupedOrdersByResourceId = groupBy(getOrderItems(this.props.orders), orderItem => orderItem.resource.id);
    const groupedOrders = reduce(groupedOrdersByResourceId, (result, orders) => {
      return [...result, {...orders[0],
        amount: sumBy(orders, 'amount'),
        order_id: orders.map(order => order.order_id).join(', ')}];
    }, []);
    this.setState({
      groupedOrders: groupedOrders
    });
  }

  clearSortByOrderItem() {
    this.setState({
      groupedOrders: undefined
    });
  }

  render() {
    const { location } = this.props;
    const { groupedOrders } = this.state;
    const ungroupedOrders = getOrderItems(this.props.orders);
    const orders = groupedOrders ? groupedOrders : ungroupedOrders;
    return (
      <OrdersForCookCourier title="Страница кулинара" location={location} clearSortByOrderItem={::this.clearSortByOrderItem}
                            sorted={groupedOrders} sortByOrderItem={::this.sortByOrderItem}>
        <CookOrderPreview orders={orders}/>
      </OrdersForCookCourier>
    );
  }
}
