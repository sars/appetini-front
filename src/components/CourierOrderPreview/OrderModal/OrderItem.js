import React, {PropTypes} from 'react';
import courierStyles from '../styles.scss';
import moment from 'moment';
import DishList from 'components/DishList/DishList';

const OrderItem = ({orderItem}) => {
  return (
    <div className={courierStyles.modalItem}>
      <div className={courierStyles.modalItemTitle}>
        {moment(orderItem.resource.ready_by).format('DD MMMM HH:mm')}(<strong>{orderItem.amount} шт.</strong>)
      </div>
      <div className={courierStyles.modalCookName}>
        <strong>Кулинар: {orderItem.resource.cook.first_name + ' ' + orderItem.resource.cook.last_name}</strong>
      </div>
      <DishList dishes={orderItem.resource.dishes} className={courierStyles.modalDish}/>
    </div>
  );
};

OrderItem.propTypes = {
  orderItem: PropTypes.object.isRequired
};

export default OrderItem;
