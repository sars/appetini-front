import React, { PropTypes, Component } from 'react';
import courierStyles from '../styles.scss';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import OrderItem from './OrderItem';

export default class OrderModal extends Component {
  static propTypes = {
    order: PropTypes.object.isRequired,
    orderNotices: PropTypes.func.isRequired
  };

  render() {
    const { order, orderNotices } = this.props;
    const groupedSelectedOrderItems = groupBy(order.order_items, 'resource.ready_by');

    return (
      <div>
        <div className={courierStyles.modalField}>
          <span>Номер заказа: </span>
          <strong>{order.id}</strong>
        </div>
        <div className={courierStyles.modalField}>
          <span>Имя: </span>
          <strong>{order.user.name}</strong>
        </div>
        <div className={courierStyles.modalField}>
          <span>Телефон: </span>
          <strong>{order.user.phone}</strong>
        </div>
        <div className={courierStyles.modalField}>
          <span>Адрес доставки: </span>
          <strong>{order.location.full_address}{order.location.description && ` (${order.location.description})`}</strong>
        </div>
        <div className={courierStyles.modalField}>
          <span>Статус оплаты: </span>
          <strong>{order.payed ? 'Оплачено' : 'Не оплачено'}</strong>
        </div>
        <div className={courierStyles.modalField}>
          <span>Тип оплаты: </span>
          <strong>{order.payment_type}</strong>
        </div>
        <div className={courierStyles.modalField}>
          <span>Общая цена: </span>
          <strong>{Number(order.total_price)} грн</strong>
        </div>
        <div className={courierStyles.modalItems}>
          <h3 className={courierStyles.modalItemsTitle}>Блюда</h3>
          {map(groupedSelectedOrderItems, (orderItems, readyBy) =>
            [
              orderItems.map(item =>
                <OrderItem orderItem={item}/>
              ),
              <div className={courierStyles.modalItem}>
                {orderNotices(order, readyBy, courierStyles.modalOrderNotices)}
              </div>
            ]
          )}
        </div>
      </div>
    );
  }
}
