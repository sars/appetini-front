import React, { PropTypes } from 'react';
import styles from './styles.scss';
import classNames from 'classnames';

const DishList = ({dishes, className}) => {
  return (
    <div>
      {dishes.map(dish => {
        return (
          <div key={dish.id}>
            <span className={classNames(styles.dishName, className)}>{dish.name}</span>
          </div>
        );
      })}
    </div>
  );
};

DishList.propTypes = {
  dishes: PropTypes.array.isRequired,
  className: PropTypes.string
};

export default DishList;
