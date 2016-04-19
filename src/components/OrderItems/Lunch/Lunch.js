import React, { PropTypes } from 'react';
import Item from '../Item/Item';
import styles from '../styles.scss';

const Lunch = ({resource, amount, ...rest}) => {
  const name = (
    <span>
      {resource.dishes.map((dish, index) => <div key={index} className={styles.dishesTag}>{dish.name}</div>)}
      {' '}
      <span>({amount} шт)</span>
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
