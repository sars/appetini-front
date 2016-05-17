import React, {Component, PropTypes} from 'react';
import { Card } from 'react-toolbox/lib/card';
import moment from 'moment';
import styles from '../OrderPreview/styles.scss';
import OrdersMap from 'components/OrdersMap/OrdersMap';
import courierStyles from './styles.scss';
import classNames from 'classnames';
import reduce from 'lodash/reduce';

export default class CourierOrderPreview extends Component {
  static propTypes = {
    orders: PropTypes.array
  }

  state = {
    orderPosition: undefined
  }

  setMapCenter = (order) => {
    this.setState({
      orderPosition: {lat: order.location.lat, lng: order.location.lng}
    });
  }

  clearOrderLocationHandler = () => {
    this.setState({
      orderPosition: undefined
    });
  }

  totalPrice = (array) => {
    return reduce(array, (sum, item) => {
      return sum + parseFloat(item.total_price);
    }, 0);
  };

  render() {
    const { orders } = this.props;
    const { orderPosition } = this.state;
    return (
      <div>
        <Card className={styles.orderPreviewWrapper}>
          {orders.length > 0 ?
            <table className={classNames(styles.table, courierStyles.table)}>
              <thead>
                <tr>
                  <td>ИД</td>
                  <td>Имя</td>
                  <td>Адрес</td>
                  <td>Телефон</td>
                  <td>Доставка</td>
                  <td>Блюда</td>
                  <td>
                    <span className={styles.nowrap}>К-во</span>
                  </td>
                  <td>Тип оплаты</td>
                  <td>Статус оплаты</td>
                  <td>Общая цена</td>
                </tr>
              </thead>
              {orders.map((order, indx) => {
                return (
                  <tbody onClick={() => this.setMapCenter(order)} key={indx}>
                    {order.order_items.map((item, index) =>
                      <tr key={index}>
                        {index === 0 && <td rowSpan={order.order_items.length}>{order.id}</td>}
                        {index === 0 && <td rowSpan={order.order_items.length}>{order.user.name}</td>}
                        {index === 0 && <td rowSpan={order.order_items.length}>{order.location.full_address}{order.location.description && '(' + order.location.description + ')'}</td>}
                        {index === 0 && <td rowSpan={order.order_items.length}>{order.user.phone}</td>}
                        <td className={styles.borderLeft}>
                          <div>{moment(item.resource.ready_by).format('DD MMMM HH:mm')}</div>
                        </td>
                        <td>
                          <div>
                            {
                              item.resource.dishes.map((dish, idx) => {
                                return (<span key={idx} className={styles.dishName}>{dish.name}</span>);
                              })
                            }
                          </div>
                        </td>
                        <td className={styles.borderRight}>
                          <div>{item.amount}</div>
                        </td>
                        {index === 0 && <td rowSpan={order.order_items.length}>{order.payment_type}</td>}
                        {index === 0 &&
                        <td rowSpan={order.order_items.length}>{order.payed ? 'Оплачено' : 'Не оплачено'}</td>}
                        {index === 0 && <td rowSpan={order.order_items.length}>{order.total_price} грн.</td>}
                      </tr>
                    )}
                  </tbody>);
              })}
              <tbody>
                <tr>
                  <td colSpan="6"> </td>
                  <td colSpan="2">Общая сумма: </td>
                  <td colSpan="2">{this.totalPrice(orders)} грн.</td>
                </tr>
              </tbody>
            </table>
            : <h2 className={styles.ordersPlaceholder}>Нет заказов</h2>
          }
        </Card>
        <OrdersMap orders={orders} orderPosition={orderPosition} clearOrderLocationHandler={::this.clearOrderLocationHandler}/>
      </div>
    );
  }
}
