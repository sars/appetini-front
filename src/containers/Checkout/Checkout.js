import React, { Component, PropTypes } from 'react';
import styles from './styles.scss';
import { connect } from 'react-redux';
import OrderForm from 'components/OrderForm/OrderForm';
import { createOrder } from 'redux/modules/common';
import normalizeErrors from 'helpers/normalizeErrors';
import { setUser, setToken } from 'redux/modules/auth';

@connect(
  state => ({orderItems: state.purchase.orderItems, user: state.auth.user}),
  { createOrder, setUser, setToken }
)
export default class Checkout extends Component {
  static propTypes = {
    orderItems: PropTypes.array.isRequired,
    user: PropTypes.object,
    createOrder: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired,
    setToken: PropTypes.func.isRequired
  };

  state = {};

  createOrder(orderAttrs) {
    const { user } = this.props;
    return new Promise((resolve, reject) => {
      this.props.createOrder({
        ...orderAttrs,
        user_attributes: orderAttrs.user,
        order_items_attributes: this.props.orderItems,
        user_id: user && user.id
      }).then(response => {
        const order = response.resource;

        this.props.setUser(order.user);
        this.props.setToken(response.auth_token);

        this.setState({order});
        resolve(response);
        if (order.payment_type === 'liqpay') {
          this.refs.payForm.submit();
        }
      }).catch(response => {
        const errors = normalizeErrors(response.errors);
        reject({...errors, _error: errors});
      });
    });
  }

  render() {
    const { order } = this.state;
    const initialOrderValues = {...order, user: this.props.user};
    return (
      <div className={styles.root}>
        <OrderForm order={order} onSubmit={::this.createOrder} initialValues={initialOrderValues}/>

        {order &&
          <div className={styles.payment}>
            <div>
              № Вашего заказа: {order.id}
            </div>

            <form ref="payForm" className={styles.paymentButton} method="post"
                  action="https://www.liqpay.com/api/3/checkout" acceptCharset="utf-8">
              <input type="hidden" name="data" value={order.liqpay_data.data}/>
              <input type="hidden" name="signature" value={order.liqpay_data.signature}/>
            </form>
          </div>
        }

      </div>
    );
  }
}
