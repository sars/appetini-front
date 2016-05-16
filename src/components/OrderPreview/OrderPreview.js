import React, {Component, PropTypes} from 'react';
import { Card } from 'react-toolbox/lib/card';
import moment from 'moment';
import ImagesPreview from 'components/ImagesPreview/ImagesPreview';
import styles from './styles.scss';
import { dots } from 'components/OrderItems/styles.scss';
import reduce from 'lodash/reduce';

export default class OrderPreview extends Component {
  static propTypes = {
    orders: PropTypes.array
  }

  totalPrice() {
    const { orders } = this.props;
    return reduce(orders, (sum, order) => {
      return sum + reduce(order.order_items, (total, orderItem) => {
        return total + (parseFloat(orderItem.resource.initial_price) * orderItem.amount);
      }, 0);
    }, 0);
  }

  render() {
    const { orders } = this.props;
    return (
        <Card className={styles.orderPreviewWrapper}>
          {orders.length > 0 ?
            <table className={styles.table}>
              <thead>
                <tr>
                  <td>Номер</td>
                  <td>Дата</td>
                  <td>Время</td>
                  <td>Блюда</td>
                  <td className={styles.hiddenXs}>Фото</td>
                  <td>Цена</td>
                  <td>Количество</td>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  return (
                    order.order_items.map((item, id) => {
                      return (<tr key={id}>
                        <td>{order.id}</td>
                        <td>{moment(item.resource.ready_by).format('DD MMMM')}</td>
                        <td>{moment(item.resource.ready_by).format('HH:mm')}</td>
                        <td>{item.resource.dishes.map((dish, index) => {
                          return (<div key={index} className={styles.dish}>
                            <span className={styles.dishName}>{dish.name}</span>
                            <span className={dots}/>
                            <span>{dish.size}</span></div>);
                        })}
                        </td>
                        <td className={styles.hiddenXs}>
                          <div className={styles.photoWrapper}>
                            <ImagesPreview images={item.resource.photos} currentImageId={0}/>
                          </div>
                        </td>
                        <td>{item.resource.initial_price * item.amount} грн.</td>
                        <td>{item.amount}</td>
                      </tr>);
                    }));
                })
                }
              </tbody>
              <tbody>
                <tr>
                  <td colSpan="4"/>
                  <td colSpan="2">Общая стоимость: </td>
                  <td colSpan="1">{this.totalPrice()} грн.</td>
                </tr>
              </tbody>
            </table>
            : <h2 className={styles.ordersPlaceholder}>Нет заказов</h2>
          }
        </Card>
    );
  }
}
