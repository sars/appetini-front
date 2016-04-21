import React, { PropTypes } from 'react';
import Button from 'components/Button/Button';
import classNames from 'classnames';
import styles from './styles.scss';

const Preview = ({lunch, className, ...other}) => {
  return (
    <div className={classNames(styles.root, className)}>
      <div className={styles.price}>
        <span className={styles.priceAmount}>
          {Number(lunch.price)}
        </span>
        <span className={styles.currency}>
          грн
        </span>
      </div>
      <Button className={styles.button} flat accent label="Заказать обед" {...other}/>
      <Button className={classNames(styles.button, styles.mobileVersion)} flat accent label="Заказать" {...other}/>
    </div>
  );
};

Preview.propTypes = {
  lunch: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default Preview;
