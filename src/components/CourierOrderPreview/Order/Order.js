import React, {PropTypes, Component} from 'react';
import groupBy from 'lodash/groupBy';
import toPairs from 'lodash/toPairs';
import courierStyles from '../styles.scss';
import styles from 'components/CookOrderPreview/styles.scss';
import moment from 'moment';
import { Link } from 'react-router';
import classNames from 'classnames';
import DishList from 'components/DishList/DishList';

export default class Order extends Component {
  static propTypes = {
    order: PropTypes.object.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    onOrderClick: PropTypes.func.isRequired,
    orderNotices: PropTypes.func.isRequired,
    payedCheckbox: PropTypes.func.isRequired
  };

  leftOrderTds = (rowSpan) => {
    const { payedCheckbox, order } = this.props;
    return [
      <td key="id" rowSpan={rowSpan}>{order.id}</td>,
      <td key="payed" rowSpan={rowSpan}>{payedCheckbox(order)}</td>,
      <td key="contacts" rowSpan={rowSpan}>
        <p>{order.user.name}</p>
        <p>{order.user.phone}</p>
      </td>,
      <td key="location" rowSpan={rowSpan}>{order.location.full_address}{order.location.description && ` (${order.location.description})`}</td>
    ];
  };

  rightOrderTds = (rowSpan, isAdmin) => {
    const { order } = this.props;
    return [
      <td key="pay" rowSpan={rowSpan}><p>{Number(order.total_price)} грн</p><p>{order.payment_type}</p></td>,
      isAdmin &&
      <td key="link" rowSpan={rowSpan}>
        <Link to={`/orders/${order.id}`}>Заказ</Link>
      </td>
    ];
  };

  render() {
    const { order, isAdmin, onOrderClick, orderNotices } = this.props;
    const groupedOrderItems = groupBy(order.order_items, 'resource.ready_by');
    const rowSpan = order.order_items.length + Object.keys(groupedOrderItems).length;

    return (
      <tbody onClick={() => onOrderClick(order)} className={styles.hiddenXs}>
        {toPairs(groupedOrderItems).map(([readyBy, orderItemGroup], groupIndex) => {
          const orderItemGroupLength = orderItemGroup.length;

          return [
            orderItemGroup.map((orderItem, itemIndex) => {
              const firstInOrderItemGroup = itemIndex === 0;
              const firstInOrder = groupIndex === 0 && firstInOrderItemGroup;

              return (
                <tr>
                  { firstInOrder && this.leftOrderTds(rowSpan) }
                  <td className={classNames(styles.borderLeft, styles.borderRight)}>
                    <div>{orderItem.resource.cook.first_name + ' ' + orderItem.resource.cook.last_name}</div>
                  </td>
                  {firstInOrderItemGroup && <td className={styles.borderLeft} rowSpan={orderItemGroupLength}>
                    <div>{moment(readyBy).format('DD MMMM HH:mm')}</div>
                  </td>}
                  <td>
                    <DishList dishes={orderItem.resource.dishes}/>
                  </td>
                  <td className={styles.borderRight}>
                    <div>{orderItem.amount}</div>
                  </td>
                  {firstInOrder && this.rightOrderTds(rowSpan, isAdmin) }
                </tr>
              );
            }),
            <tr key={orderItemGroupLength}>
              <td colSpan="4" className={courierStyles.notice}>
                {orderNotices(isAdmin, order, readyBy)}
              </td>
            </tr>
          ];
        })}
      </tbody>
    );
  }
}
