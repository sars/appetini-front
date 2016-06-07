import React, { Component, PropTypes } from 'react';
import Checkbox from 'react-toolbox/lib/checkbox';
import Dropdown from 'components/Dropdown/Dropdown';
import ResourcesIndex from 'components/ResourcesIndex/ResourcesIndex';
import { updateOrder } from 'redux/modules/common';
import { asyncConnect } from 'redux-async-connect';
import { connect } from 'react-redux';
import styles from './styles.scss';

const statuses = [
  {label: 'Pending', value: 'pending' },
  {label: 'Approved', value: 'approved' },
  {label: 'Handled', value: 'handled' },
  {label: 'Canceled', value: 'canceled' }
];

@asyncConnect([
  {key: 'orders', promise: ({ helpers }) => helpers.client.get('/orders')}
])
@connect(null, { updateOrder })
export default class Orders extends Component {
  static propTypes = {
    orders: PropTypes.object.isRequired,
    updateOrder: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  updateOrder(order, attrs) {
    this.props.updateOrder({...attrs, id: order.id});
  }

  payedContent(order) {
    const yesNo = order.payed ? 'Да' : 'Нет';
    return order.payment_type === 'cash' ? <Checkbox className={styles.checkbox}
      checked={order.payed}
      onChange={payed => this.updateOrder(order, { payed })}
    /> : yesNo;
  }

  statusComponent(order) {
    return (
      <Dropdown auto source={statuses} size="15" value={order.status}
                onChange={status => this.updateOrder(order, { status })}/>
    );
  }

  render() {
    const { resources: orders } = this.props.orders;
    const fields = [
      { title: 'ID', value: order => order.id },
      { title: 'Тип оплаты', value: order => order.payment_type },
      { title: 'Оплачен', value: ::this.payedContent },
      { title: 'Статус', value: ::this.statusComponent },
      { title: 'Цена', value: order => Number(order.total_price) + 'грн' }
    ];
    const actions = [{
      action: (id) => this.context.router.push('/admin/orders/' + id),
      title: 'Подробнее'
    }];

    return (<ResourcesIndex resources={orders} title="Заказы" urlName="orders" fields={fields}
                            customActions={actions}/>);
  }
}
