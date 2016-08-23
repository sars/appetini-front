import React, { Component, PropTypes } from 'react';
import styles from './styles.scss';
import OrderForm from 'components/OrderForm/OrderForm';
import { asyncConnect, loadSuccess } from 'redux-async-connect';
import { clearOrderItems, clearOrder } from 'redux/modules/purchase';
import { connect } from 'react-redux';
import { createOrder, updateOrder } from 'redux/modules/common';
import { setUser, setToken } from 'redux/modules/auth';
import normalizeErrors from 'helpers/normalizeErrors';
import fbEvent from 'components/fbEvent/fbEvent';
import ga from 'components/GaEvent/ga';
import filter from 'lodash/filter';
import difference from 'lodash/difference';

@asyncConnect([
  {key: 'tariffs', promise: ({helpers, store}) => {
    if (!store.getState().reduxAsyncConnect.tariffs) {
      return helpers.client.get('/delivery_tariffs').then(tariffs => tariffs.resources);
    }
  }}
])

@connect(
  state => ({ user: state.auth.user }),
  { createOrder, updateOrder, setUser, setToken, clearOrder, clearOrderItems, loadSuccess }
)
export default class Checkout extends Component {

  static propTypes = {
    tariffs: PropTypes.array.isRequired,
    createOrder: PropTypes.func.isRequired,
    loadSuccess: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired,
    clearOrderItems: PropTypes.func.isRequired,
    clearOrder: PropTypes.func.isRequired,
    updateOrder: PropTypes.func.isRequired,
    user: PropTypes.object,
    setToken: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired
  };

  state = {
    order: undefined
  };

  componentDidMount() {
    fbEvent('track', 'InitiateCheckout');
  }

  saveOrder(orderAttrs) {
    const { user } = this.props;
    const teamOrderItems = filter(orderAttrs.order_items_attributes, {resource_type: 'TeamOrder'});
    const itemsWithoutTeamOrders = difference(orderAttrs.order_items_attributes, teamOrderItems);

    return new Promise((resolve, reject) => {
      const saveOrder = orderAttrs.id ? this.props.updateOrder : this.props.createOrder;

      saveOrder({
        ...orderAttrs,
        team_order_ids: teamOrderItems.map(item => item.resource.id),
        location_attributes: orderAttrs.location,
        user_attributes: orderAttrs.user,
        order_items_attributes: itemsWithoutTeamOrders,
        user_id: orderAttrs.user.id
      }).then(response => {
        const order = response.resource;
        fbEvent('track', orderAttrs.id ? 'Update Order' : 'Purchase', {value: order.total_price.toString(), currency: 'USD'});
        // TODO this.props.loginSuccess(response) instead of setUser and setToken
        if (user && order.user.id === user.id || !user) {
          this.props.setUser({ ...user, ...order.user });
        }
        if (response.meta) {
          this.props.setToken(response.meta.access_token);
        }

        this.props.clearOrderItems();
        this.props.clearOrder();
        this.props.loadSuccess('lunch', undefined);
        this.setState({order});

        if (order.payment_type === 'liqpay') {
          this.refs.payForm.submit();
          ga('Purchase(liqpay)');
        } else {
          ga('Purchase(cash)');
          this.context.router.push(`/orders/${order.id}/success`);
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

    return (
      <div className={styles.root}>
        <OrderForm tariffs={this.props.tariffs} onSubmit={::this.saveOrder}/>
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
