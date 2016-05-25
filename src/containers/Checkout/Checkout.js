import React, { Component, PropTypes } from 'react';
import styles from './styles.scss';
import OrderForm from 'components/OrderForm/OrderForm';
import { asyncConnect } from 'redux-async-connect';
import { clearOrderItems } from 'redux/modules/purchase';
import { connect } from 'react-redux';
import { createOrder } from 'redux/modules/common';
import { setUser, setToken } from 'redux/modules/auth';
import normalizeErrors from 'helpers/normalizeErrors';
import fbEvent from 'components/fbEvent/fbEvent';
import ga from 'components/GaEvent/ga';

@asyncConnect([
  {key: 'tariffs', promise: ({helpers, store}) => {
    if (!store.getState().reduxAsyncConnect.tariffs) {
      return helpers.client.get('/delivery_tariffs').then(tariffs => tariffs.resources);
    }
  }}
])

@connect(
  state => ({orderItems: state.purchase.orderItems, user: state.auth.user}),
  { createOrder, setUser, setToken, clearOrderItems }
)
export default class Checkout extends Component {

  static propTypes = {
    tariffs: PropTypes.array.isRequired,
    createOrder: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired,
    clearOrderItems: PropTypes.func.isRequired,
    user: PropTypes.object,
    setToken: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  state = {
    order: undefined
  };

  componentDidMount() {
    fbEvent('track', 'InitiateCheckout');
  }

  createOrder(orderAttrs) {
    const { user } = this.props;
    return new Promise((resolve, reject) => {
      this.props.createOrder({
        ...orderAttrs,
        location_attributes: orderAttrs.location,
        user_attributes: orderAttrs.user,
        order_items_attributes: orderAttrs.order_items_attributes,
        user_id: orderAttrs.user.id
      }).then(response => {
        const order = response.resource;
        fbEvent('track', 'Purchase', {value: order.total_price.toString(), currency: 'USD'});
        // TODO this.props.loginSuccess(response) instead of setUser and setToken
        if (user && order.user.id === user.id || !user) {
          this.props.setUser(order.user);
        }
        if (response.meta) {
          this.props.setToken(response.meta.access_token);
        }

        this.props.clearOrderItems();

        this.setState({order});

        if (order.payment_type === 'liqpay') {
          this.refs.payForm.submit();
          ga('Purchase(liqpay)');
        } else {
          ga('Purchase(cash)');
          this.context.router.push(`/order/${order.id}/success`);
        }

        resolve(response);
      }).catch(response => {
        const errors = normalizeErrors(response.errors);
        reject({...errors, _error: errors});
      });
    });
  }

  render() {
    const { order } = this.state;
    const initialOrderValues = {...order};

    return (
      <div className={styles.root}>
        <OrderForm tariffs={this.props.tariffs} initialValues={initialOrderValues} onSubmit={::this.createOrder}/>
        {order &&
        <form ref="payForm" method="post" action="https://www.liqpay.com/api/3/checkout" acceptCharset="utf-8">
          <input type="hidden" name="data" value={order.liqpay_data.data}/>
          <input type="hidden" name="signature" value={order.liqpay_data.signature}/>
        </form>
        }
      </div>
    );
  }
}
