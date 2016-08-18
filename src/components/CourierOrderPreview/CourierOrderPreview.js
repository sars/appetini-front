import React, {Component, PropTypes} from 'react';
import { Card } from 'react-toolbox/lib/card';
import Modal from 'components/Modal/Modal';
import Checkbox from 'react-toolbox/lib/checkbox';
import styles from 'components/CookOrderPreview/styles.scss';
import OrdersMap from 'components/OrdersMap/OrdersMap';
import Order from './Order/Order';
import OrderMobile from './OrderMobile/OrderMobile';
import OrderModal from './OrderModal/OrderModal';
import courierStyles from './styles.scss';
import classNames from 'classnames';
import reduce from 'lodash/reduce';
import { connect } from 'react-redux';
import { loadSuccess } from 'redux-async-connect';
import OrderNotice from 'components/OrderNotice/OrderNotice';
import OrderNoticeForm from 'components/OrderNotice/OrderNoticeForm';

@connect( null, { loadSuccess })
export default class CourierOrderPreview extends Component {
  static propTypes = {
    user: PropTypes.object,
    orders: PropTypes.array,
    updatePayed: PropTypes.func,
    loadSuccess: PropTypes.func.isRequired
  };

  static contextTypes = {
    client: PropTypes.object.isRequired
  };

  state = {
    orderPosition: undefined,
    showModal: false,
    selectedOrder: {}
  };

  componentWillReceiveProps(nextProps) {
    const { selectedOrder } = this.state;
    if (nextProps.orders !== this.props.orders && selectedOrder.id) {
      this.setState({
        selectedOrder: nextProps.orders.find(order => order.id === selectedOrder.id) || {}
      });
    }
  }

  handleClickOrder = (order) => {
    this.setState({
      orderPosition: {lat: order.location.lat, lng: order.location.lng},
      selectedOrder: order
    });
  };

  handleClickOrderMobile = (order) => {
    this.handleClickOrder(order);
    this.setState({ showModal: true });
  };

  clearOrderLocationHandler = () => {
    this.setState({
      orderPosition: undefined
    });
  };

  totalPrice = (array) => {
    return reduce(array, (sum, item) => {
      return sum + parseFloat(item.total_price);
    }, 0);
  };

  handleModalClose = () => {
    this.setState({
      selectedOrder: {},
      showModal: false
    });
  };

  orderNotices = (isAdmin, order, readyBy, className) => {
    const orderNotices = order.order_notices.filter(notice => notice.ready_by === readyBy);

    return (
      orderNotices.length > 0 ?
        orderNotices.map((notice, index) =>
          <div key={index} className={className}>
            <OrderNotice notice={notice} mayEdit={isAdmin} onSubmit={this.updateNotice} onDelete={this.deleteNotice}/>
          </div>
        )
        : (isAdmin &&
        <div className={className}>
          <OrderNoticeForm orderId={order.id} onSubmit={this.createNotice} readyBy={readyBy}/>
        </div>
      )
    );
  };

  updateOrders = (orderId, callback) => {
    const { orders } = this.props;
    const newOrders = orders.map(order => {
      if (order.id === orderId) {
        return callback(order);
      }
      return order;
    });
    this.props.loadSuccess('orders', newOrders);
  };

  createNotice = (notice) => {
    this.context.client.post( '/couriers/order_notices', {data: {resource: notice}})
      .then(response => {
        const newOrderNotice = response.resource;
        this.updateOrders(notice.order_id, order => (
          { ...order, order_notices: order.order_notices.concat(newOrderNotice) }
        ));
      });
  };

  updateNotice = (notice) => {
    this.context.client.put( `/couriers/order_notices/${notice.id}`, {data: {resource: notice}})
      .then(response => {
        const updatedOrderNotice = response.resource;
        this.updateOrders(notice.order_id, order => (
          {
            ...order,
            order_notices: order.order_notices.map(item => item.id === updatedOrderNotice.id ? updatedOrderNotice : item)
          }
        ));
      });
  };

  deleteNotice = (notice) => {
    this.context.client.del( `/couriers/order_notices/${notice.id}`)
      .then(() => {
        this.updateOrders(notice.order_id, order => (
          { ...order, order_notices: order.order_notices.filter(item => item.id !== notice.id) }
        ));
      });
  };

  render() {
    const { orders, user, updatePayed } = this.props;
    const { orderPosition, selectedOrder, showModal } = this.state;
    const isAdmin = (user.role === 'admin');
    const payedCheckbox = (order) => {
      return (
        <div>
          <Checkbox className={courierStyles.checkbox} checked={order.payed}
                    disabled={isAdmin || order.payment_type === 'liqpay'}
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
              <OrderModal order={selectedOrder} orderNotices={this.orderNotices.bind(this, isAdmin)}
              />
              <OrdersMap orders={orders} orderPosition={orderPosition} clearOrderLocationHandler={::this.clearOrderLocationHandler}/>
            </div>
          }
        </Modal.Dialog>
        <Card className={styles.orderPreviewWrapper}>
          {orders.length > 0 ?
            <table className={classNames(styles.table, courierStyles.table)}>
              <thead>
                <tr>
                  <td className={classNames(courierStyles.showXs, 'hidePrint', courierStyles.noticeStatus)}></td>
                  <td className={courierStyles.id}>ИД</td>
                  <td>Оплачено</td>
                  <td className={styles.hiddenXs}>Контакты</td>
                  <td>Адрес</td>
                  <td className={styles.hiddenXs}>Кулинар</td>
                  <td className={styles.hiddenXs}>Доставка</td>
                  <td className={styles.hiddenXs}>Блюда</td>
                  <td className={styles.hiddenXs}>
                    <span className={styles.nowrap}>К-во</span>
                  </td>
                  <td>Оплата</td>
                  {isAdmin && <td className={classNames(styles.hiddenXs, 'hidePrint')}></td>}
                </tr>
              </thead>
              {orders.map((order) => [
                <Order order={order} isAdmin={isAdmin} onOrderClick={this.handleClickOrder}
                       orderNotices={this.orderNotices} payedCheckbox={payedCheckbox}
                />,
                <OrderMobile order={order} onOrderClick={this.handleClickOrderMobile} payedCheckbox={payedCheckbox}/>
              ])}
              <tbody>
                <tr>
                  <td colSpan="6" className={styles.hiddenXs}/>
                  <td colSpan="2">Общая сумма: </td>
                  <td colSpan={isAdmin ? 4 : 3} className={styles.hiddenXs}>{this.totalPrice(orders)} грн</td>
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
