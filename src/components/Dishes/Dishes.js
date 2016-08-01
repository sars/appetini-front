import React, { PropTypes } from 'react';
import { CardContent } from 'components/Card/Card';
import styles from './styles.scss';

const Dishes = ({dishes}) => {
  return (
    <CardContent>
      <h3>Состав обеда:</h3>
      <ul>
        {dishes.map(dish => {
          return (
            <li className={styles.dish} key={dish.id}>
              <span>{dish.name}</span>
              <span className={styles.dots}/>
              <span className={styles.size}>{dish.size}</span>
            </li>
          );
        })}
      </ul>
    </CardContent>
  );
};

Dishes.propTypes = {
  dishes: PropTypes.array.isRequired
};

export default Dishes;
