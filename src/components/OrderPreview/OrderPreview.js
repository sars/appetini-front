import React, {Component, PropTypes} from 'react';
import { Card } from 'react-toolbox/lib/card';
import moment from 'moment';
import ImagesPreview from 'components/ImagesPreview/ImagesPreview';
import styles from './styles.scss';
import { dots } from 'components/OrderItems/styles.scss';

export default class OrderPreview extends Component {
  static propTypes = {
    orders: PropTypes.array
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
                        <td>{item.amount}</td>
                      </tr>);
                    }));
                })
                }
              </tbody>
            </table>
            : <h2 className={styles.ordersPlaceholder}>Нет заказов</h2>
          }
        </Card>
    );
  }
}
