import React, { PropTypes } from 'react';
import Card, { CardContent } from 'components/Card/Card';
import DeliveryTariff from './DeliveryTariff/DeliveryTariff';
import Lunch from './Lunch/Lunch';
import Item from './Item/Item';
import styles from './styles.scss';
import toPairs from 'lodash/toPairs';
import filter from 'lodash/filter';
import moment from 'moment';

const types = {
  DeliveryTariff,
  Lunch
};

function removable(item) {
  return !(item.resource_type === 'DeliveryTariff' && (item.resource.individual || item.resource.zero));
}

const OrderItems = ({items, onRemove, ...rest}) => {
  const totalPrice = items.purchasing.reduce((result, item) => Number(item.resource.price) * item.amount + result, 0);
  const groupedItems = items.grouped;
  const specialTariffs = filter(items.purchasing, item => item.resource_type === 'DeliveryTariff' && !item.resource.individual);

  const itemElem = (item, index) =>
    React.createElement(types[item.resource_type], {
      ...item,
      ...rest,
      key: index,
      removable: removable(item),
      onRemove: () => onRemove && onRemove(item)
    });

  return (
    <Card>
      <CardContent>
        {toPairs(groupedItems).map(([date, dateItems]) =>
          <div key={date} className={styles.dateGroup}>
            <div className={styles.headerReadyBy}>Доставка <span className={styles.dateDelivery}>{moment(date).format('DD MMMM HH:mm')}</span></div>
            {toPairs(dateItems).map(([cookId, cookItems]) =>
              <div key={cookId} className={styles.cookGroup}>
                <div className={styles.headerCookName}>От {cookItems[0].resource.cook.full_name_genitive}</div>
                {cookItems.map(itemElem)}
              </div>
            )}
          </div>
        )}
        <div>
          {specialTariffs.map(itemElem)}
        </div>
        <Item className={styles.total} name="Итого" price={totalPrice}/>
      </CardContent>
    </Card>
  );
};

OrderItems.propTypes = {
  items: PropTypes.object.isRequired,
  onRemove: PropTypes.func
};

export default OrderItems;
