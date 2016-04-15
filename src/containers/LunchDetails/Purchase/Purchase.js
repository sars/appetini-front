import React, { Component, PropTypes } from 'react';
import Card, { CardContent } from 'components/Card/Card';
import Button from 'components/Button/Button';
import times from 'lodash/times';
import classNames from 'classnames';
import { addOrderItem } from 'redux/modules/purchase';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { FormattedPlural } from 'react-intl';
import styles from './styles.scss';
import ga from 'components/GaEvent/ga';
import moment from 'moment';
import OrderTimeout from 'components/OrderTimeout/OrderTimeout';

@connect(state => ({user: state.auth.user}), { addOrderItem })
export default class Purchase extends Component {
  static propTypes = {
    lunch: PropTypes.object.isRequired,
    user: PropTypes.object,
    individualTariff: PropTypes.object.isRequired,
    addOrderItem: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  state = {
    amount: 1
  };

  subscribe() {
    this.props.addOrderItem('Lunch', this.props.lunch, this.state.amount);
    this.context.router.push('/tariffs');
    ga('Subscribe and buy');
  }

  buy() {
    this.props.addOrderItem('Lunch', this.props.lunch, this.state.amount);
    if (!this.userHasDeliveries()) {
      this.props.addOrderItem('DeliveryTariff', this.props.individualTariff);
    }
    this.context.router.push('/checkout');
    ga('Buy');
  }

  incrementAmount(step) {
    const {amount} = this.state;
    const availableCount = this.props.lunch.available_count;
    const currentStep = amount + step;
    const newAmount = currentStep < availableCount ? currentStep : availableCount;
    this.setState({amount: newAmount < 1 ? 1 : newAmount});
  }

  userHasDeliveries() {
    return this.props.user && this.props.user.deliveries_available > 0;
  }

  render() {
    const { lunch } = this.props;
    const { amount } = this.state;
    const hasDeliveries = this.userHasDeliveries();
    const disabledByTime = moment(lunch.ready_by).subtract(lunch.disable_minutes, 'minutes').isBefore(moment());
    const disabledByCount = lunch.available_count === 0;
    const disabled = disabledByTime || disabledByCount;
    const isToday = moment(lunch.ready_by).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD');
    return (
      <Card className={styles.root}>
        <CardContent className={styles.cardContent}>
          <div>
            <p>Есть вопросы? Звони!</p>
            <p><strong>+38 096 505 85 84</strong></p>
          </div>
          {!disabled && <div className={styles.amountContainer}>
            <Button className={styles.amountButton} type="button" icon="remove" outlined mini flat
                    onClick={() => this.incrementAmount(-1)}/>
            <div className={styles.amountText}>
              <div>
                <span className={styles.amount}>{amount}</span>
                &nbsp;
              <span className={styles.amountLabel}>
                <FormattedPlural value={amount} one="порция" few="порции" many="порций" other="порций"/>
              </span></div>
              <div className={styles.avaliableAmount}>Доступно <strong>{lunch.available_count}</strong></div>
            </div>
            <Button className={styles.amountButton} type="button" icon="add" outlined mini flat
                    onClick={() => this.incrementAmount(1)}/>
          </div>
          }
          {disabled && <div className={styles.amountContainer}>
            <div className={styles.amountLabel}>
              <div>{disabledByCount && !disabledByTime && 'Нет доступных порций'} {disabledByTime && 'Время до заказа истекло'}</div>
              <div><Link to="/">Закажите доступный обед</Link></div>
            </div>
          </div>
          }
          <div className={styles.price}>
            <span className={styles.priceAmount}>{Number(lunch.price)}</span>
            <span className={styles.priceCurrency}>грн</span>
          </div>

          <div>
            {isToday && !disabled &&
            <div className={styles.timerSection}>
              До конца заказа осталось:
              <div className={styles.timerWrapper}><OrderTimeout lunch={lunch} className={styles.timer}/></div>
            </div>
            }
            {!disabled && hasDeliveries ?
                <div className={styles.buttonHint}>
                  1 доставка будет списана при заказе с вашего счета
                </div> :
                <div className={styles.buttonHint}>+ стоимость доставки</div>
              }
            <Button disabled={disabled} className={classNames(styles.button, styles.buyButton)} big flat accent label="Заказать обед"
                    onClick={::this.buy}/>
          </div>

        </CardContent>

        {!hasDeliveries && <div className={styles.separator}>
          {times(50, (index) => <i key={index}/>)}
        </div>}

        {!hasDeliveries && <CardContent className={classNames(styles.subscribeContainer, styles.cardContent)}>
          <div className={styles.buttonHint}>+ тарифный план</div>
          <Button disabled={disabled} big flat accent className={classNames(styles.button, styles.subscribeButton)}
                  onClick={::this.subscribe}>
            <div>Подписаться</div>
            <div className={styles.buttonMinorLabel}>и купить</div>
          </Button>
        </CardContent>}
      </Card>
    );
  }
}
