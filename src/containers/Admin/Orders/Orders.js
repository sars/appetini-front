import React, { Component, PropTypes } from 'react';
import { asyncConnect } from 'redux-async-connect';

import ResourcesIndex from 'components/ResourcesIndex/ResourcesIndex';

@asyncConnect([
  {key: 'orders', promise: ({ helpers }) => helpers.client.get('/orders')}
])
export default class Orders extends Component {
  static propTypes = {
    orders: PropTypes.object.isRequired
  };

  render() {
    const { resources: orders } = this.props.orders;
    const fields = [
      { title: 'ID', value: order => order.id },
      { title: 'Тип оплаты', value: order => order.payment_type },
      { title: 'Оплачен', value: order => order.payed ? 'Да' : 'Нет' },
      { title: 'Цена', value: order => Number(order.total_price) + 'грн' }
    ];

    return (<ResourcesIndex resources={orders} title="Заказы" urlName="orders" fields={fields}/>);
  }
}
