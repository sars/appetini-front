import React, {PropTypes} from 'react';
import courierStyles from '../styles.scss';
import classNames from 'classnames';

const OrderMobile = ({order, payedCheckbox, onOrderClick}) => {
  return (
    <tbody className={classNames(courierStyles.showXs, 'hidePrint')}>
      <tr>
        <td className={classNames({[courierStyles.hasNotices]: order.order_notices.length > 0, [courierStyles.noticeStatus]: true})}></td>
        <td onClick={() => onOrderClick(order)}>{order.id}</td>
        <td>{payedCheckbox(order)}</td>
        <td onClick={() => onOrderClick(order)}>{order.location.full_address}{order.location.description && ` (${order.location.description})`}</td>
        <td onClick={() => onOrderClick(order)}>{Number(order.total_price)} грн</td>
      </tr>
    </tbody>
  );
};

OrderMobile.propTypes = {
  order: PropTypes.object.isRequired,
  payedCheckbox: PropTypes.func.isRequired,
  onOrderClick: PropTypes.func.isRequired
};

export default OrderMobile;
