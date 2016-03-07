import React, { PropTypes } from 'react';
import Card from 'components/Card/Card';
import Button from 'components/Button/Button';
import classNames from 'classnames';
import styles from './styles.scss';

const Tariff = ({tariff, className, onBuyClick, ...rest}) => {
  const classes = classNames(styles.root, className, {
    [styles.featured]: tariff.featured
  });

  return (
    <div className={classes} {...rest}>
      <Card className={styles.card}>
        <div className={styles.cardHeader}></div>
        <div className={styles.content}>
          <div className={styles.icon} dangerouslySetInnerHTML={{__html: tariff.icon}}></div>
          <div className={styles.amount}>
            {tariff.amount} в месяц
          </div>
          <div className={styles.priceContainer}>
            <div className={styles.price}>
              <span>{Number(tariff.price) / tariff.amount}</span>
            </div>

            <div className={styles.currency}>
              <div><span className={styles.currencyName}>грн</span></div>
              <div><span className={styles.currencyDelivery}>доставка</span></div>
            </div>
          </div>
          <div className={styles.totalContainer}>
            <div className={styles.totalPrice}>
              <span className={styles.totalPriceAmount}>{Number(tariff.price)}</span>
              <span className={styles.totalPriceCurrency}>грн</span>
            </div>
            <Button className={styles.button} big accent flat label="Купить" onClick={onBuyClick}/>
          </div>
        </div>
      </Card>
    </div>
  );
};

Tariff.propTypes = {
  tariff: PropTypes.object.isRequired,
  onBuyClick: PropTypes.func,
  className: PropTypes.string
};

export default Tariff;
