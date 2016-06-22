import React, {Component, PropTypes} from 'react';
import { Card } from 'react-toolbox/lib/card';
import moment from 'moment';
import Checkbox from 'react-toolbox/lib/checkbox';
import { Link } from 'react-router';
import Button from 'components/Button/Button';
import ImagesPreview from 'components/ImagesPreview/ImagesPreview';
import styles from './styles.scss';
import { dots } from 'components/OrderItems/styles.scss';
import reduce from 'lodash/reduce';

export default class CookOrderPreview extends Component {
  static propTypes = {
    user: PropTypes.object,
    onItemReviewed: PropTypes.func,
    orders: PropTypes.array
  }

  totalPrice() {
    const { orders } = this.props;
    return reduce(orders, (sum, order) => {
      return sum + (parseFloat(order.resource.initial_price) * order.amount);
    }, 0);
  }

  render() {
    const { orders, user, onItemReviewed } = this.props;
    const showOrderLink = user && user.role === 'admin';
    return (
        <Card className={styles.orderPreviewWrapper}>
          {orders.length > 0 ?
            <table className={styles.table}>
              <thead>
                <tr>
                  {onItemReviewed && <td>Обработано</td>}
                  <td>Номер</td>
                  <td>Дата</td>
                  <td>Время</td>
                  <td>Блюда</td>
                  <td className={styles.hiddenSm}>Фото</td>
                  <td>Цена</td>
                  <td>Количество</td>
                  {showOrderLink && <td>Заказ</td>}
                </tr>
              </thead>
              <tbody>
                {orders.map((orderItem, id) => {
                  return (
                    <tr key={id}>
                      {onItemReviewed && <td><Checkbox checked={Boolean(orderItem.reviewed_order_item && orderItem.reviewed_order_item.id)}
                                    onChange={(checked) => onItemReviewed(orderItem, checked)}/></td>}
                      <td>{orderItem.order_id}</td>
                      <td>{moment(orderItem.resource.ready_by).format('DD MMMM')}</td>
                      <td>{moment(orderItem.resource.ready_by).format('HH:mm')}</td>
                      <td>
                        {orderItem.resource.dishes.map((dish, index) => {
                          return (<div key={index} className={styles.dish}>
                            <span className={styles.dishName}>{dish.name}</span>
                            <span className={dots}/>
                            <span>{dish.size}</span></div>);
                        })}
                      </td>
                      <td className={styles.hiddenSm}>
                        <div className={styles.photoWrapper}>
                          <ImagesPreview images={orderItem.resource.photos} currentImageId={0}/>
                        </div>
                      </td>
                      <td>{orderItem.resource.initial_price * orderItem.amount} грн.</td>
                      <td>{orderItem.amount}</td>
                      {showOrderLink && <td><Link to={`/orders/${orderItem.order_id}`}><Button flat accent label="Заказ"/></Link></td>}
                    </tr>);
                })}
              </tbody>
              <tbody>
                <tr>
                  <td colSpan="4"/>
                  <td colSpan="2">Общая стоимость: </td>
                  <td colSpan={showOrderLink ? 3 : 1}>{this.totalPrice()} грн.</td>
                </tr>
              </tbody>
            </table>
            : <h2 className={styles.ordersPlaceholder}>Нет заказов</h2>
          }
        </Card>
    );
  }
}
