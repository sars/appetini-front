import React, {Component, PropTypes} from 'react';
import { Card } from 'react-toolbox/lib/card';
import moment from 'moment';
import Modal from 'components/Modal/Modal';
import Checkbox from 'react-toolbox/lib/checkbox';
import styles from 'components/CookOrderPreview/styles.scss';
import OrdersMap from 'components/OrdersMap/OrdersMap';
import { Link } from 'react-router';
import courierStyles from './styles.scss';
import classNames from 'classnames';
import reduce from 'lodash/reduce';

export default class CourierOrderPreview extends Component {
  static propTypes = {
    user: PropTypes.object,
    orders: PropTypes.array,
    updatePayed: PropTypes.func
  }

  state = {
    orderPosition: undefined,
    showModal: false,
    selectedOrder: {}
  }

  handleClickOrder = (order, showModal = false) => {
    this.setState({
      orderPosition: {lat: order.location.lat, lng: order.location.lng},
      selectedOrder: order,
      showModal: showModal
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
  }

  handleModalClose = () => {
    this.setState({
      selectedOrder: {},
      showModal: false
    });
  }

  render() {
    const { orders, user, updatePayed } = this.props;
    const { orderPosition, selectedOrder, showModal } = this.state;
    const userAdmin = (user.role === 'admin');
    const showOrderLink = user && (userAdmin || user.courier);
    const payedCheckbox = (order) => {
      return (
        <div>
          <Checkbox checked={order.payed}
                    disabled={userAdmin || order.payment_type === 'liqpay'}
                    onChange={(checked) => updatePayed(checked, order)}/>
          {order.payed && order.order_payment.courier && <div>{order.order_payment.courier.name}</div>}
        </div>
      );
    };
    return (
      <div>
        <Modal.Dialog active={showModal} title={`Заказ #${selectedOrder.id || ''}`} onClose={::this.handleModalClose}>
          {selectedOrder.id &&
            <div className={courierStyles.modal}>
              <div className={courierStyles.modalField}>
                <span>Номер заказа: </span>
                <strong>{selectedOrder.id}</strong>
              </div>
              <div className={courierStyles.modalField}>
                <span>Имя: </span>
                <strong>{selectedOrder.user.name}</strong>
              </div>
              <div className={courierStyles.modalField}>
                <span>Телефон: </span>
                <strong>{selectedOrder.user.phone}</strong>
              </div>
              <div className={courierStyles.modalField}>
                <span>Адрес доставки: </span>
                <strong>{selectedOrder.location.full_address}{selectedOrder.location.description && ` (${selectedOrder.location.description})`}</strong>
              </div>
              <div className={courierStyles.modalField}>
                <span>Статус оплаты: </span>
                <strong>{selectedOrder.payed ? 'Оплачено' : 'Не оплачено'}</strong>
              </div>
              <div className={courierStyles.modalField}>
                <span>Тип оплаты: </span>
                <strong>{selectedOrder.payment_type}</strong>
              </div>
              <div className={courierStyles.modalField}>
                <span>Общая цена: </span>
                <strong>{selectedOrder.total_price} грн</strong>
              </div>

              <div className={courierStyles.modalItems}>
                <h3 className={courierStyles.modalItemsTitle}>Блюда</h3>
                {selectedOrder.order_items.map((item, index) =>
                  <div key={index} className={courierStyles.modalItem}>
                      <div className={courierStyles.modalItemTitle}>
                        {moment(item.resource.ready_by).format('DD MMMM HH:mm')}(<strong>{item.amount} шт.</strong>)
                      </div>
                      <div className={courierStyles.modalCookName}><strong>Кулинар: {item.resource.cook.first_name + ' ' + item.resource.cook.last_name}</strong></div>
                      <div>
                        {
                          item.resource.dishes.map((dish, idx) => {
                            return (<span key={idx} className={classNames(styles.dishName, courierStyles.modalDish)}>{dish.name}</span>);
                          })
                        }
                      </div>
                  </div>
                )}
              </div>
              <OrdersMap orders={orders} orderPosition={orderPosition} clearOrderLocationHandler={::this.clearOrderLocationHandler}/>
            </div>
          }
        </Modal.Dialog>
        <Card className={styles.orderPreviewWrapper}>
          {orders.length > 0 ?
            <table className={classNames(styles.table, courierStyles.table)}>
              <thead>
                <tr>
                  <td>ИД</td>
                  <td>Оплачено</td>
                  <td className={styles.hiddenXs}>Имя</td>
                  <td className={styles.hiddenXs}>Имя кулинара</td>
                  <td>Адрес</td>
                  <td className={styles.hiddenXs}>Телефон</td>
                  <td className={styles.hiddenXs}>Доставка</td>
                  <td className={styles.hiddenXs}>Блюда</td>
                  <td className={styles.hiddenXs}>
                    <span className={styles.nowrap}>К-во</span>
                  </td>
                  <td className={styles.hiddenXs}>Тип оплаты</td>
                  <td>Общая цена</td>
                  {showOrderLink && <td className={classNames(styles.hiddenXs, 'hidePrint')}>Заказ</td>}
                </tr>
              </thead>
              {orders.map((order, indx) => {
                return ([
                  <tbody onClick={() => this.handleClickOrder(order)} key={indx} className={styles.hiddenXs}>
                    {order.order_items.map((item, index) =>
                      <tr key={index}>
                        {index === 0 && <td rowSpan={order.order_items.length}>{order.id}</td>}
                        {index === 0 && <td rowSpan={order.order_items.length}>{payedCheckbox(order)}</td>}
                        {index === 0 && <td rowSpan={order.order_items.length}>{order.user.name}</td>}
                        <td className={classNames(styles.borderLeft, styles.borderRight)}>
                          <div>{item.resource.cook.first_name + ' ' + item.resource.cook.last_name}</div>
                        </td>
                        {index === 0 && <td rowSpan={order.order_items.length}>{order.location.full_address}{order.location.description && ` (${order.location.description})`}</td>}
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
                        {index === 0 && <td rowSpan={order.order_items.length}>{order.total_price} грн</td>}
                        {index === 0 && showOrderLink &&
                          <td rowSpan={order.order_items.length}>
                            <Link to={`/orders/${order.id}`}>Заказ</Link>
                          </td>
                        }
                      </tr>
                    )}
                  </tbody>,
                  <tbody key={indx + 1} className={classNames(courierStyles.showXs, 'hidePrint')}>
                    <tr>
                      <td onClick={() => this.handleClickOrder(order, true)}>{order.id}</td>
                      <td>{payedCheckbox(order)}</td>
                      <td onClick={() => this.handleClickOrder(order, true)}>{order.location.full_address}{order.location.description && ` (${order.location.description})`}</td>
                      <td onClick={() => this.handleClickOrder(order, true)}>{order.total_price} грн</td>
                    </tr>
                  </tbody>
                ]);
              })}
              <tbody>
                <tr>
                  <td colSpan="6" className={styles.hiddenXs}/>
                  <td colSpan="2">Общая сумма: </td>
                  <td colSpan={showOrderLink ? 4 : 3} className={styles.hiddenXs}>{this.totalPrice(orders)} грн</td>
                  <td colSpan="3" className={styles.showXs}>{this.totalPrice(orders)} грн</td>
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
