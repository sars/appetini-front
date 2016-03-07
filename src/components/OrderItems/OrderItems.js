import React, { PropTypes } from 'react';
import Card, { CardContent } from 'components/Card/Card';
import DeliveryTariff from './DeliveryTariff/DeliveryTariff';
import Lunch from './Lunch/Lunch';
import Item from './Item/Item';
import styles from './styles.scss';

const types = {
  DeliveryTariff,
  Lunch
};

function removable(items, item, user) {
  const hasDeliveries = user && user.deliveries_available > 0;
  if (!hasDeliveries && item.resource_type === 'DeliveryTariff') {
    return items.filter(_item => _item.resource_type === 'DeliveryTariff').length > 1;
  }
  return true;
}

const OrderItems = ({items, onRemove, user, ...rest}) => {
  const totalPrice = items.reduce((result, item) => Number(item.resource.price) * item.amount + result, 0);
  return (
    <Card>
      <CardContent>
        {items.map((item, index) =>
          React.createElement(types[item.resource_type], {
            ...item,
            ...rest,
            key: index,
            removable: removable(items, item, user),
            onRemove: () => onRemove && onRemove(item)
          })
        )}
        <Item className={styles.total} name="Итого" price={totalPrice}/>
      </CardContent>
    </Card>
  );
};

OrderItems.propTypes = {
  items: PropTypes.array.isRequired,
  user: PropTypes.object,
  onRemove: PropTypes.func
};

export default OrderItems;
