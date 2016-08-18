import React, {PropTypes} from 'react';
import styles from 'components/CookOrderPreview/styles.scss';
import courierStyles from '../styles.scss';
import classNames from 'classnames';
import moment from 'moment';

const OrderItem = ({orderItem}) => {
  return (
    <div className={courierStyles.modalItem}>
      <div className={courierStyles.modalItemTitle}>
        {moment(orderItem.resource.ready_by).format('DD MMMM HH:mm')}(<strong>{orderItem.amount} шт.</strong>)
      </div>
      <div className={courierStyles.modalCookName}>
        <strong>Кулинар: {orderItem.resource.cook.first_name + ' ' + orderItem.resource.cook.last_name}</strong>
      </div>
      <div>
        {
          orderItem.resource.dishes.map((dish, idx) =>
            <span key={idx} className={classNames(styles.dishName, courierStyles.modalDish)}>{dish.name}</span>
          )
        }
      </div>
    </div>
  );
};

OrderItem.propTypes = {
  orderItem: PropTypes.object.isRequired
};

export default OrderItem;
