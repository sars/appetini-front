import React, { Component, PropTypes } from 'react';
import { Card } from 'react-toolbox/lib/card';
import moment from 'moment';
import Checkbox from 'react-toolbox/lib/checkbox';
import ImagesPreview from 'components/ImagesPreview/ImagesPreview';
import classnames from 'classnames';
import { asyncConnect } from 'redux-async-connect';
import tableStyles from 'components/CookOrderPreview/styles.scss';
import styles from './styles.scss';
import DishList from 'components/DishList/DishList';

@asyncConnect([
  {key: 'order', promise: ({ helpers, params }) => helpers.client.get('/orders/' + params.orderId)
    .then(order => order.resource)}
])
export default class AdminOrdersShow extends Component {
  static propTypes = {
    order: PropTypes.object.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  render() {
    const {order} = this.props;
    const { router } = this.context;
    const hasLunches = order.order_items.some(item => item.resource_type !== 'DeliveryTariff');
    const statuses = {
      pending: 'В ожидании',
      handled: 'Обработан',
      approved: 'Обработан',
      canceled: 'Отменен'
    };

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
          <div className={styles.commonField}>
            <span>Телефон: </span>
            <strong>{order.user.phone}</strong>
          </div>
          {order.location &&
            <div className={styles.commonField}>
              <span>Адрес доставки: </span>
              <strong>{order.location.full_address}</strong>
            </div>
          }
          <div className={styles.commonField}>
            <span>Дата заказа: </span>
            <strong>{moment(order.created_at).format('DD MMMM HH:mm')}</strong>
          </div>
          <div className={styles.commonField}>
            <span>Статус оплаты: </span>
            <strong>{order.payed ? 'Оплачено' : 'Не оплачено'}</strong>
          </div>
          <div className={styles.commonField}>
            <span>Статус: </span>
            <strong>{statuses[order.status]}</strong>
          </div>
          <div className={styles.commonField}>
            <span>Тип оплаты: </span>
            <strong>{order.payment_type}</strong>
          </div>
          <div className={styles.commonField}>
            <span>Общая цена: </span>
            <strong>{Number(order.total_price)} грн.</strong>
          </div>
        </Card>

        <Card className={styles.commonInfo}>
          {order.order_items.map((item, idx) => {
            if (item.resource_type === 'DeliveryTariff') {
              return (
                <div key={idx} className={styles.commonField}>
                  <span>{item.resource.individual ? 'Индивидуальная доставка ' : 'Тариф ' + item.resource.amount + ' доставок'}({item.amount}): </span>
                  <strong>{item.amount * item.resource.price} грн</strong>
                </div>
              );
            }
          })}
        </Card>

        {hasLunches &&
          <Card className={tableStyles.orderPreviewWrapper}>
            <table className={classnames(tableStyles.table, styles.table)}>
              <thead>
                <tr>
                  <td>Обработано</td>
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
                      <tr key={index} onClick={() => {router.push(`/lunches/${item.resource_id}`);}}>
                        <td><Checkbox checked={Boolean(item.reviewed_order_item && item.reviewed_order_item.id)} disabled/></td>
                        <td>{item.resource.cook.full_name_genitive}</td>
                        <td>
                          <div>{moment(item.resource.ready_by).format('DD MMMM HH:mm')}</div>
                        </td>
                        <td>
                          <DishList dishes={item.resource.dishes} className={styles.dish} />
                        </td>
                        <td className={tableStyles.hiddenXs}>
                          <div className={tableStyles.photoWrapper}>
                            <ImagesPreview images={item.resource.photos} currentImageId={0}/>
                          </div>
                        </td>
                        <td>
                          {item.resource.price * item.amount} грн
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
        }
      </div>
    );
  }
}
