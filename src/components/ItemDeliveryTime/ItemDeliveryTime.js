import React, { PropTypes, Component } from 'react';
import OrderTimeout from 'components/OrderTimeout/OrderTimeout';
import tooltip from 'react-toolbox/lib/tooltip';
import Label from 'components/label/label';
import DeliveryPeriod from 'components/DeliveryPeriod/DeliveryPeriod';
import styles from './styles.scss';

const TooltipLabel = tooltip(Label);

export default class ItemDeliveryTime extends Component {
  static propTypes = {
    near: PropTypes.bool,
    disabled: PropTypes.bool,
    disabledByTime: PropTypes.bool,
    item: PropTypes.object.isRequired
  }

  render() {
    const { near, disabled, disabledByTime, item } = this.props;
    return (
      <div>
        {!near &&
        (disabled ?
          <span className={styles.orderTimeoutWrapper}>
              <TooltipLabel tooltip="Этот обед уже нельзя заказать" label={disabledByTime ? 'Время до заказа истекло' : 'Порции закончились'}/>
            </span> :
          <DeliveryPeriod className={styles.readyBy} time={item.ready_by}/>)
        }
        {near && <span className={styles.orderTimeoutWrapper}>До окончания заказа: <OrderTimeout className={styles.timer} item={item}/></span>}

      </div>
    );
  }
}
