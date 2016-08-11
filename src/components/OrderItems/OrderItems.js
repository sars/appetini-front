import React, { PropTypes } from 'react';
import Card, { CardContent } from 'components/Card/Card';
import DeliveryTariff from './DeliveryTariff/DeliveryTariff';
import TeamOrder from './TeamOrder/TeamOrder';
import Lunch from './Lunch/Lunch';
import Item from './Item/Item';
import styles from './styles.scss';
import toPairs from 'lodash/toPairs';
import filter from 'lodash/filter';
import moment from 'moment';

const types = {
  DeliveryTariff,
  Lunch,
  TeamOrder
};
/**
 * @description This function checks possibility to removing object.
 * If this function returns "true", then we can remove current object from order list.
 * @param { object } item ("Lunch" || "Delivery")
 * @returns { boolean }
 */
function removable(item) {
  return !(item.resource_type === 'DeliveryTariff' && (item.resource.individual || item.resource.zero));
}

/**
 * @description This function returns jsx with grouped orders list. [Ф-ция выводит сгрупированный список заказа]
 * @param {object} items Object with 2 attributes: "grouped" - Object with items, grouped by date and cooks name;
 * "purchasing" - Array of lunches and deliveries.
 *
 * @param {func} onRemove Remove callback.
 * @param {func} onChangeAmount Change amount callback.
 * @param rest
 * @returns {JSX}
 */
const OrderItems = ({items, onRemove, onChangeAmount, ...rest}) => {
  const totalPrice = items.purchasing.filter(item => (item._destroy !== 1)).reduce((result, item) => Number(item.resource.price) * item.amount + result, 0);
  const groupedItems = items.grouped;
  const specialTariffs = filter(items.purchasing, item => item.resource_type === 'DeliveryTariff' && !item.resource.individual);

  /**
   * @description Returns item's jsx depends of item type.
   * @type {func}
   * @param {object} item ("Lunch" || "Delivery").
   * @param index
   */
  const itemElem = (item, index) =>
    React.createElement(types[item.resource_type], {
      ...item,
      ...rest,
      item,
      key: index,
      removable: removable(item),
      onRemove: () => onRemove && onRemove(item),
      onChangeAmount: (resource, delta) => {
        return onChangeAmount(item, delta);
      }
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
