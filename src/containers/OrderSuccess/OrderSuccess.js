import React, { Component, PropTypes } from 'react';
import { asyncConnect } from 'redux-async-connect';
import styles from './styles.scss';

@asyncConnect([
  {key: 'order', promise: ({helpers, params}) => helpers.client.get(`/orders/${params.orderId}`)
                                                        .then(response => response.resource)}
])
export default class OrderSuccess extends Component {
  static propTypes = {
    order: PropTypes.object.isRequired
  };

  render() {
    const { order } = this.props;

    return (
      <div className={styles.root}>
        <h1>{order.payed ? 'Заказ успешно оплачен!' : 'Заказ успешно создан!'}</h1>
        <div className={styles.description}>
          {order.creating_user ? 'Для юзера который был создан' : 'Для зареганого юзера'}
        </div>
        <div className={styles.comment}>
          {order.payed ? 'Оплачен' : 'Не оплачен еще (возможно оплата обрабатывается)'}
        </div>
        <div className={styles.comment}>
          {order.order_items.some(item => item.resource_type === 'Lunch') ? 'С ланчем' : 'Без ланча'}
        </div>
        <div className={styles.comment}>
          {order.order_items.some(item => item.resource_type === 'DeliveryTariff') ? 'С тарифом' : 'Без тарифа'}
        </div>
        {order.order_items.some(item => item.resource_type === 'DeliveryTariff') && <div className={styles.comment}>
          {order.order_items.filter(item => item.resource_type === 'DeliveryTariff').every(item => item.resource.individual) ? 'Индивидуальный тариф' : 'Множественный тарифф (Подписка)'}
        </div>}
      </div>
    );
  }
}
