import React, { Component, PropTypes } from 'react';
import Button from 'components/Button/Button';
import classNames from 'classnames';
import styles from './styles.scss';

export default class PurchaseLunch extends Component {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    onBuy: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    hasDeliveries: PropTypes.bool,
    className: PropTypes.any
  }

  render() {
    const { disabled, onBuy, label, className, hasDeliveries } = this.props;
    return (
      <div className={classNames(styles.wrapper, className)}>
        {hasDeliveries ?
          <div className={styles.text}>
            1 доставка будет списана при заказе с вашего счета
          </div> :
          <div className={styles.text}>+ стоимость доставки</div>
        }
        <Button disabled={disabled} className={styles.buyButton} big flat accent label={label}
                onClick={onBuy}/>
      </div>
    );
  }
}
