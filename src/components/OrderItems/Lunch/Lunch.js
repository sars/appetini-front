import React, { PropTypes } from 'react';
import Item from '../Item/Item';
import styles from '../styles.scss';
import Button from 'components/Button/Button';

const Lunch = ({resource, amount, onChangeAmount, ...rest}) => {
  const name = (
    <span>
      {resource.dishes.map((dish, index) => <div key={index} className={styles.dishesTag}>{dish.name}</div>)}
      {' '}
      <Button className={styles.amountButton} type="button" icon="remove" outlined mini flat
              onClick={() => onChangeAmount( resource.id, 'Lunch', amount - 1 )} />
      {' '}
      <span>{amount} шт</span>
      {' '}
      <Button className={styles.amountButton} type="button" icon="add" outlined mini flat
              onClick={() => onChangeAmount( resource.id, 'Lunch', amount + 1 )} />
    </span>
  );

  return (
    <Item name={name} price={Number(resource.price) * amount} {...rest}/>
  );
};

Lunch.propTypes = {
  resource: PropTypes.object.isRequired,
  amount: PropTypes.number.isRequired
};

export default Lunch;
