import React, { Component, PropTypes } from 'react';
import CourierOrderPreview from 'components/CourierOrderPreview/CourierOrderPreview';
import OrdersForCookCourier from 'components/OrdersForCookCourier/OrdersForCookCourier';
import { asyncConnect, loadSuccess } from 'redux-async-connect';
import { connect } from 'react-redux';
import Card, { CardContent } from 'components/Card/Card';
import { setUser } from 'redux/modules/auth';
import { getParams } from 'helpers/ordersDateHelper';
import styles from './styles.scss';

@asyncConnect([
  {key: 'orders', promise: ({helpers, location}) =>
      helpers.client.get(`/couriers/orders`, {params: getParams(location)})
        .then(response => response.resources)}
])
@connect(state => ({user: state.auth.user}), {loadSuccess, setUser})
export default class CourierOrdersPage extends Component {

  static propTypes = {
    user: PropTypes.object,
    orders: PropTypes.array,
    loadSuccess: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired,
    location: PropTypes.object
  };

  static contextTypes = {
    client: PropTypes.object.isRequired
  };

  updatePayed = ( checked, order ) => {
    const { user } = this.props;
    const client = this.context.client;
    if (checked) {
      client.post(`/order_payments`, {data: {resource: {order_id: order.id, courier_id: user.courier.id}}})
        .then(response => {
          const newOrderPayment = {...response.resource, courier: {...response.resource.courier, name: user.name}};
          this.updateOrders(order, newOrderPayment, response.resource.courier);
        });
    } else {
      client.del(`/order_payments/${order.order_payment.id}`)
        .then(() => client.get(`couriers/${user.courier.id}`))
        .then(response => {
          this.updateOrders(order, null, response.resource);
        });
    }
  }

  updateOrders = (order, newPayed, courier) => {
    const { user, orders } = this.props;
    const newOrders = orders.map((ord) => {
      if (ord.id === order.id) {
        return {...order, order_payment: newPayed, payed: Boolean(newPayed)};
      }
      return ord;
    });
    this.props.loadSuccess('orders', newOrders);
    this.props.setUser({
      ...user,
      courier: courier
    });
  }

  render() {
    const { orders, location, user } = this.props;
    return (
        <OrdersForCookCourier title="Страница курьера" location={location}>
          <div>
            {user.courier && user.courier.id &&
              <Card className={styles.courierInfo}><CardContent>Баланс: {user.courier.balance} грн.</CardContent></Card>
            }
            <CourierOrderPreview orders={orders} user={user} updatePayed={::this.updatePayed}/>
          </div>
        </OrdersForCookCourier>
    );
  }
}
