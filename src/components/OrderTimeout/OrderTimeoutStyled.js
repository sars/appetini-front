import React from 'react';
import styles from './styles.scss';
import OrderTimeout from './OrderTimeout';

export default class OrderTimeoutStyled extends OrderTimeout {

  render() {
    return (
      <div className={styles.timerSection}>
        До окончания заказа осталось: <div className={styles.timerWrapper}><span className={styles.timer}>{this.state.time}</span></div>
      </div>
    );
  }
}
