import React, { Component, PropTypes } from 'react';
import Checkbox from 'react-toolbox/lib/checkbox';
import ResourcesIndex from 'components/ResourcesIndex/ResourcesIndex';
import { updateOrder } from 'redux/modules/common';
import { asyncConnect } from 'redux-async-connect';
import { connect } from 'react-redux';
import styles from './styles.scss';

@asyncConnect([
  {key: 'orders', promise: ({ helpers }) => helpers.client.get('/orders')}
])
@connect(null, { updateOrder })
export default class Orders extends Component {
  static propTypes = {
    orders: PropTypes.object.isRequired,
    updateOrder: PropTypes.func.isRequired
  };

  payedContent(order) {
    const yesNo = order.payed ? 'Да' : 'Нет';
    return order.payment_type === 'cash' ? <Checkbox className={styles.checkbox}
      checked={order.payed}
      onChange={checked => this.props.updateOrder({payed: checked, id: order.id})}
    /> : yesNo;
  }

  render() {
    const { resources: orders } = this.props.orders;
    const fields = [
      { title: 'ID', value: order => order.id },
      { title: 'Тип оплаты', value: order => order.payment_type },
      { title: 'Оплачен', value: ::this.payedContent },
      { title: 'Цена', value: order => Number(order.total_price) + 'грн' }
    ];

    return (<ResourcesIndex resources={orders} title="Заказы" urlName="orders" fields={fields}/>);
  }
}
