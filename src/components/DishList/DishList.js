import React, { PropTypes } from 'react';
import styles from './styles.scss';

const DishList = ({dishes}) => {
  return (
    <div>
      {dishes.map(dish => {
        return (
          <div key={dish.id}>
            <span className={styles.dishName}>{dish.name}</span>
          </div>
        );
      })}
    </div>
  );
};

DishList.propTypes = {
  dishes: PropTypes.array.isRequired
};

export default DishList;
