import React, { Component, PropTypes } from 'react';
import styles from './styles.scss';
import { connect } from 'react-redux';
import OrderForm from 'components/OrderForm/OrderForm';
import { createOrder } from 'redux/modules/common';
import { orderItemStructure, clearOrderItems } from 'redux/modules/purchase';
import normalizeErrors from 'helpers/normalizeErrors';
import { setUser, setToken } from 'redux/modules/auth';
import ga from 'components/GaEvent/ga';
import find from 'lodash/find';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';
import transform from 'lodash/transform';
import { asyncConnect } from 'redux-async-connect';

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
    orderItems: PropTypes.array.isRequired,
    user: PropTypes.object,
    createOrder: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired,
    setToken: PropTypes.func.isRequired,
    tariffs: PropTypes.array.isRequired,
    clearOrderItems: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  state = {
    preparedOrderItems: this.preparedOrderItems(this.props.orderItems, this.props.user)
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.orderItems !== nextProps.orderItems || this.props.user !== nextProps.user) {
      this.setState({preparedOrderItems: this.preparedOrderItems(nextProps.orderItems, nextProps.user)});
    }
  }
  /**
   * @description This function returns deliveries amount.
   * @param items Array of "Lunch" objects.
   * @returns {*}
     */
  purchasedTariffsCount(items) {
    return items.reduce((result, item) => result + (item.resource_type === 'DeliveryTariff' ? item.resource.amount : 0), 0);
  }

  /**
   * @description This function prepares array of lunches to display in order list.
   * @param items Array of "Lunch" objects.
   * @param user User.
   * @returns {{purchasing: null[], grouped}}
     */
  preparedOrderItems(items, user) {
    const { tariffs } = this.props;
    const groupedItems = this.groupedItems(items);
    const individualTariffItem = orderItemStructure('DeliveryTariff', find(tariffs, {individual: true}));
    const zeroTariffItem = orderItemStructure('DeliveryTariff', { price: 0, zero: true });
    const individualTariffItems = [];
    /**
     * @description This variable represents deliveries amount for current order including user's deliveries available and purchasing deliveries in order.
     * @constant { number }
     */
    let deliveriesAvailable = (user ? user.deliveries_available : 0) + this.purchasedTariffsCount(items);
    /**
     * @description This function adds delivery to each group in order list. If user has available deliveries, function will add delivery with zero price;
     * @constant {object}
     */
    const itemsWithDelivers = transform(groupedItems, (groupedItemsResult, dateItems, date) => {
      groupedItemsResult[date] = transform(dateItems, (dateItemsResult, cookItems, cookId) => {
        if (deliveriesAvailable > 0) {
          deliveriesAvailable--;
          dateItemsResult[cookId] = [...cookItems, zeroTariffItem];
        } else {
          dateItemsResult[cookId] = [...cookItems, individualTariffItem];
          individualTariffItems.push(individualTariffItem);
        }
      }, {});
    }, {});

    return {
      purchasing: [...items, ...individualTariffItems],
      grouped: itemsWithDelivers
    };
  }

  /**
   * @description This function returns object grouped by delivery time and cooks.
   * @param orderItems Array of lunches.
   */
  groupedItems(orderItems) {
    const lunchesItems = filter(orderItems, {resource_type: 'Lunch'});
    const groupedByDate = groupBy(lunchesItems, 'resource.ready_by');
    return mapValues(groupedByDate, items => groupBy(items, 'resource.cook.id'));
  }

  createOrder(orderAttrs) {
    const { user } = this.props;
    return new Promise((resolve, reject) => {
      this.props.createOrder({
        ...orderAttrs,
        location_attributes: orderAttrs.location,
        user_attributes: orderAttrs.user,
        order_items_attributes: this.state.preparedOrderItems.purchasing,
        user_id: orderAttrs.user.id
      }).then(response => {
        const order = response.resource;

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
    const hasLunches = this.props.orderItems.some(item => item.resource_type === 'Lunch');

    return (
      <div className={styles.root}>
        <OrderForm onSubmit={::this.createOrder} initialValues={initialOrderValues} user={this.props.user} orderItems={this.state.preparedOrderItems}
          showAddressField={hasLunches}/>
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
