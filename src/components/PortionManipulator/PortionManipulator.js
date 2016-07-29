import Button from 'components/Button/Button';
import { FormattedPlural } from 'react-intl';
import styles from './styles.scss';
import React from 'react';

export const PortionManipulator = ({availableCount, amount, onChangeAmount}) => {
  return (
    <div className={styles.amountContainer}>
      <Button className={styles.amountButton} type="button" icon="remove" outlined mini flat
              onClick={() => onChangeAmount(amount - 1)}/>
      <div className={styles.amountText}>
        <div>
          <span>{amount}</span>
          &nbsp;
                    <span className={styles.amountLabel}>
                      <FormattedPlural value={amount} one="порция" few="порции" many="порций" other="порций"/>
                    </span></div>
        <div className={styles.avaliableAmount}>Доступно {availableCount - amount}</div>
      </div>
      <Button className={styles.amountButton} type="button" icon="add" outlined mini flat
              onClick={() => onChangeAmount(amount + 1)}/>
    </div>
  );
};

PortionManipulator.propTypes = {
  available_count: React.PropTypes.number.isRequired,
  amount: React.PropTypes.number.isRequired,
  onChangeAmount: React.PropTypes.func.isRequired
};

export default PortionManipulator;
