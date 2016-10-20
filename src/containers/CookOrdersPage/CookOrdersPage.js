import React, { Component, PropTypes } from 'react';
import CookOrderPreview from 'components/CookOrderPreview/CookOrderPreview';
import OrdersForCookCourier from 'components/OrdersForCookCourier/OrdersForCookCourier';
import { asyncConnect, loadSuccess } from 'redux-async-connect';
import { connect } from 'react-redux';
import {getParams} from 'helpers/ordersDateHelper';
import flatten from 'lodash/flatten';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';
import sumBy from 'lodash/sumBy';
import isEmpty from 'lodash/isEmpty';
import reviewOrderItem from 'helpers/reviewOrderItem';
import Card, { CardContent } from 'components/Card/Card';
import styles from 'containers/CourierOrdersPage/styles.scss';

const getOrderItems = (orders) => {
  return flatten(orders.map((order) => {
    return order.order_items.map((orderItem) => {
      return {...orderItem, order_id: order.id};
    });
  }));
};

@asyncConnect([
  {
    key: 'orders', promise: ({helpers, params, location}) =>
    helpers.client.get(`/cooks/${params.cookId}/orders`,
      {params: getParams(location)})
  }
])
@connect(state => ({user: state.auth.user}), {loadSuccess})
export default class CookOrdersPage extends Component {

  static propTypes = {
    user: PropTypes.object,
    orders: PropTypes.object,
    loadSuccess: PropTypes.func.isRequired,
    location: PropTypes.object
  };

  static contextTypes = {
    client: PropTypes.object.isRequired
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

  onItemReviewed = (orderItem, checked) => {
    reviewOrderItem(orderItem, checked, this.props.user, this.context.client)
      .then(response => {
        const reviewedOrderItem = (response && checked) ? response.resource : null;
        this.setOrderItems(orderItem.id, reviewedOrderItem);
      });
  }

  setOrderItems = (currentOrderItemId, reviewedOrderItem) => {
    const { orders } = this.props;
    const newOrders = orders.resources.map((order) => {
      return {
        ...order,
        order_items: order.order_items.map((orderItem) => {
          if (orderItem.id === currentOrderItemId) return {...orderItem, reviewed_order_item: reviewedOrderItem};
          return orderItem;
        })
      };
    });

    this.props.loadSuccess('orders', {
      ...orders,
      resources: newOrders
    });
  }

  sortByOrderItem() {
    const groupedOrdersByResourceId = groupBy(getOrderItems(this.props.orders.resources), orderItem => orderItem.resource.id);
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
    const { location, user, orders } = this.props;
    const { groupedOrders } = this.state;
    const ungroupedOrders = getOrderItems(orders.resources);

    return (
      <OrdersForCookCourier title={`Страница кулинара ${orders.meta.cook.full_name_genitive}`} location={location}
                            clearSortByOrderItem={::this.clearSortByOrderItem}
                            sorted={groupedOrders} sortByOrderItem={::this.sortByOrderItem}>
        <div>
          {!isEmpty(user.cook) &&
            <Card className={styles.info}><CardContent>Баланс: {user.cook.balance} грн</CardContent></Card>
          }
          <CookOrderPreview orders={groupedOrders || ungroupedOrders} user={user}
                            onItemReviewed={groupedOrders ? null : ::this.onItemReviewed}/>
        </div>
      </OrdersForCookCourier>
    );
  }
}
