import React, { Component, PropTypes } from 'react';
import CourierOrderPreview from 'components/CourierOrderPreview/CourierOrderPreview';
import OrdersForCookCourier from 'components/OrdersForCookCourier/OrdersForCookCourier';
import { asyncConnect } from 'redux-async-connect';
import {getParams} from 'helpers/ordersDateHelper';

@asyncConnect([
  {key: 'orders', promise: ({helpers, location}) =>
      helpers.client.get(`/couriers/orders`, {params: getParams(location)})
        .then(response => response.resources)}
])

export default class CourierOrdersPage extends Component {

  static propTypes = {
    orders: PropTypes.array,
    location: PropTypes.object
  };

  render() {
    const { orders, location } = this.props;
    return (
      <OrdersForCookCourier title="Страница курьера" location={location}>
        <CourierOrderPreview orders={orders} />
      </OrdersForCookCourier>
    );
  }

}
