import React, { PropTypes } from 'react';
import Item from '../Item/Item';
import styles from '../styles.scss';
import Button from 'components/Button/Button';
import classNames from 'classnames';

const Lunch = ({resource, amount, onChangeAmount, ...rest}) => {
  const name = (
    <span>
      {resource.dishes.map((dish, index) => <div key={index} className={styles.dishesTag}>{dish.name}</div>)}
      {' '}
      <Button className={styles.amountButton} type="button" icon="remove" outlined mini flat
              onClick={() => onChangeAmount( resource, -1 )} />
      {' '}
      <span>{amount} шт</span>
      {' '}
      <Button className={styles.amountButton} type="button" icon="add" outlined mini flat
              onClick={() => onChangeAmount( resource, 1 )} />
    </span>
  );

  return (
  <span>
    {rest._destroy !== 1 && <Item name={name} price={Number(resource.price) * amount} {...rest}/> ||
      <div className={classNames(styles.item, styles.ref)}>
        <span onClick={() => rest.cancelRemove(rest)}>Отменить</span>
      </div>
    }
  </span>
  );
};

Lunch.propTypes = {
  resource: PropTypes.object.isRequired,
  onChangeAmount: PropTypes.func.isRequired,
  amount: PropTypes.number.isRequired
};

export default Lunch;
