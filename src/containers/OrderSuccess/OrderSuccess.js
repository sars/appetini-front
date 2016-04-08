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
    const individualDelivery = order.order_items.filter(item => item.resource_type === 'DeliveryTariff').every(item => item.resource.individual);
    const liqpay = order.payment_type === 'liqpay';
    const withLunch = order.order_items.some(item => item.resource_type === 'Lunch');
    const cash = order.payment_type === 'cash';
    return (
      <div className={styles.root}>
        <h1>{order.payed ? 'Заказ успешно оплачен!' : 'Благодарим за оформление заказа!'}</h1>

        <div className={styles.description}>
          {order.creating_user && 'Вы были зарегистрированы, для входа в свой профиль проверьте почту: ' + order.user.email}
        </div>

        <div className={styles.comment}>

          {!individualDelivery && order.order_items.map((item) => {
            if (item.resource_type === 'DeliveryTariff') {
              return 'Вы подписались на тарифный план: ' + item.resource.amount + ' доставок в месяц.';
            }
          })
          }
          {!individualDelivery && withLunch && <div>А также: </div>}

          {order.order_items.map((item, index) => {
            if (item.resource_type === 'Lunch') {
              return <div key={index}>Вы заказали обед ({item.amount} шт.) </div>;
            }
          })}
        </div>

        <div className={styles.comment}>
          {liqpay && (order.payed ? 'Оплачен' : 'Не оплачен еще (возможно оплата обрабатывается)')}
        </div>

        <div className={styles.comment}>
          {cash && 'Оплата наличными курьеру.'}
        </div>

        <div className={styles.comment}>
          Сумма к оплате {order.total_price} грн.
        </div>

        <div className={styles.comment}>
          {withLunch ? 'Не забудьте сделать заказ на завтра!' : 'Не забудьте заказать обед!'}
        </div>
      </div>
    );
  }
}
