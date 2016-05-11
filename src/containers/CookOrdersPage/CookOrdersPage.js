import React, { Component, PropTypes } from 'react';
import OrderPreview from 'components/OrderPreview/OrderPreview';
import OrdersForCookCourier from 'components/OrdersForCookCourier/OrdersForCookCourier';
import { asyncConnect } from 'redux-async-connect';
import {getParams} from 'helpers/ordersDateHelper';

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

  render() {
    const { orders, location } = this.props;
    return (
      <OrdersForCookCourier title="Страница кулинара" location={location}>
        <OrderPreview orders={orders}/>
      </OrdersForCookCourier>
    );
  }
}