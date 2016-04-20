import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from '../styles.scss';

const Item = ({className, name, price, removable, onRemove, ...rest}) => {
  return (
    <div className={classNames(styles.item, className, {[styles.removableItem]: removable})} {...rest}>
      {removable &&
        <i className={classNames('fa fa-remove', styles.remove)} onClick={() => onRemove && onRemove()}/>
      }
      <span>{name}</span>
      <span className={styles.dots}/>
      <span className={styles.price}>{price}<span className={styles.currency}>грн</span></span>
    </div>
  );
};

Item.propTypes = {
  className: PropTypes.string,
  name: PropTypes.any.isRequired,
  price: PropTypes.number.isRequired,
  removable: PropTypes.bool,
  onRemove: PropTypes.func
};

export default Item;
