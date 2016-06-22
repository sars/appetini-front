import React, { Component, PropTypes } from 'react';
import { Card } from 'react-toolbox/lib/card';
import moment from 'moment';
import Checkbox from 'react-toolbox/lib/checkbox';
import ImagesPreview from 'components/ImagesPreview/ImagesPreview';
import classnames from 'classnames';
import { asyncConnect } from 'redux-async-connect';
import tableStyles from 'components/CookOrderPreview/styles.scss';
import styles from './styles.scss';

@asyncConnect([
  {key: 'order', promise: ({ helpers, params }) => helpers.client.get('/orders/' + params.orderId)
    .then(order => order.resource)}
])
export default class AdminOrdersShow extends Component {
  static propTypes = {
    order: PropTypes.object.isRequired
  }

  render() {
    const {order} = this.props;
    return (
      <div className={styles.root}>
        <h2 className={styles.title}>Информация по заказу #{order.id}</h2>
        <Card className={styles.commonInfo}>
          <div className={styles.commonField}>
            <span>Номер заказа: </span>
            <strong>{order.id}</strong>
          </div>
          <div className={styles.commonField}>
            <span>Имя: </span>
            <strong>{order.user.name}</strong>
          </div>
          {order.location &&
            <div className={styles.commonField}>
              <span>Адрес доставки: </span>
              <strong>{order.location.full_address}</strong>
            </div>
          }
          <div className={styles.commonField}>
            <span>Статус оплаты: </span>
            <strong>{order.payed ? 'Оплачено' : 'Не оплачено'}</strong>
          </div>
          <div className={styles.commonField}>
            <span>Тип оплаты: </span>
            <strong>{order.payment_type}</strong>
          </div>
          <div className={styles.commonField}>
            <span>Общая цена: </span>
            <strong>{order.total_price} грн.</strong>
          </div>
        </Card>

        <Card className={styles.commonInfo}>
          {order.order_items.map((item, idx) => {
            if (item.resource_type === 'DeliveryTariff') {
              return (
                <div key={idx} className={styles.commonField}>
                  <span>{item.resource.individual ? 'Индивидуальная доставка ' : 'Тариф ' + item.resource.amount + ' доставок'}({item.amount}): </span>
                  <strong>{item.amount * item.resource.price} грн.</strong>
                </div>
              );
            }
          })}
        </Card>

        <Card className={tableStyles.orderPreviewWrapper}>
          <table className={classnames(tableStyles.table, styles.table)}>
            <thead>
            <tr>
              <td>Обработано</td>
              <td>Ид Кулинара</td>
              <td>Имя Кулинара</td>
              <td>Доставка</td>
              <td>Блюда</td>
              <td className={styles.hiddenXs}>Фото</td>
              <td>Цена</td>
              <td>
                <span className={tableStyles.nowrap}>К-во</span>
              </td>
            </tr>
            </thead>
              <tbody>
                {order.order_items.map((item, index) => {
                  if (item.resource_type !== 'DeliveryTariff') {
                    return (
                      <tr key={index}>
                        <td><Checkbox checked={Boolean(item.reviewed_order_item && item.reviewed_order_item.id)} disabled/></td>
                        <td>{item.resource.cook_id}</td>
                        <td>{item.resource.cook.full_name_genitive}</td>
                        <td>
                          <div>{moment(item.resource.ready_by).format('DD MMMM HH:mm')}</div>
                        </td>
                        <td>
                          {
                            item.resource.dishes.map((dish, idx) => {
                              return (<span key={idx} className={classnames(tableStyles.dishName, styles.dish)}>{dish.name}</span>);
                            })
                          }
                        </td>
                        <td className={tableStyles.hiddenXs}>
                          <div className={tableStyles.photoWrapper}>
                            <ImagesPreview images={item.resource.photos} currentImageId={0}/>
                          </div>
                        </td>
                        <td>
                          {item.resource.price * item.amount} грн.
                        </td>
                        <td>
                          <div>{item.amount}</div>
                        </td>
                      </tr>
                    );
                  }
                })}
              </tbody>
          </table>
        </Card>
      </div>
    );
  }
}
