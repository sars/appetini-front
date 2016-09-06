import React, { Component, PropTypes } from 'react';
import Card, { CardContent } from 'components/Card/Card';
import PurchaseLunch from 'components/PurchaseLunch/PurchaseLunch';
import Button from 'components/Button/Button';
import BuyModal from 'components/BuyModal/BuyModal';
import times from 'lodash/times';
import classNames from 'classnames';
import { addOrderItem } from 'redux/modules/purchase';
import { connect } from 'react-redux';
import { FormattedPlural } from 'react-intl';
import styles from './styles.scss';
import ga from 'components/GaEvent/ga';
import fbEvent from 'components/fbEvent/fbEvent';
import moment from 'moment';
import { Link } from 'react-router';
import { show as showToast } from 'redux/modules/toast';
import OrderTimeoutStyled from 'components/OrderTimeout/OrderTimeoutStyled';
import isLunchDisabled from 'helpers/isLunchDisabled';
import { MenuItem } from 'react-toolbox/lib/menu';
import find from 'lodash/find';
import config from 'config';

const checkAvailableCount = (lunch, orderItems) => {
  const lunchInCart = find(orderItems, {resource_id: lunch.id});
  return lunchInCart ? (lunch.available_count - lunchInCart.amount) : lunch.available_count;
};

@connect(state => ({user: state.auth.user, lunchesAmount: state.purchase.lunchesAmount, orderItems: state.purchase.orderItems}), { addOrderItem, showToast })
export default class Purchase extends Component {
  static propTypes = {
    lunch: PropTypes.object.isRequired,
    orderItems: PropTypes.any,
    user: PropTypes.object,
    addOrderItem: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired,
    lunchesAmount: PropTypes.number.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      amount: 1,
      activeModal: false
    };
  }

  subscribe() {
    this.props.addOrderItem('Lunch', this.props.lunch, this.state.amount);
    this.props.showToast('Заказ добавлен в корзину. Выберите тариф по доставкам', 'accept', 'done');
    this.context.router.push('/tariffs');
    ga('Subscribe and buy');
  }

  buy() {
    const { lunch } = this.props;
    const { amount } = this.state;
    fbEvent('track', 'AddToCart');
    if (this.props.lunchesAmount < 1 ) {
      this.setState({activeModal: true});
    } else {
      this.props.showToast('Заказ добавлен в корзину', 'accept', 'done');
      this.context.router.push('/');
    }
    this.props.addOrderItem('Lunch', lunch, amount);
    this.setState({
      amount: 1
    });
  }

  checkout() {
    this.context.router.push('/checkout');
    ga('Buy');
  }

  incrementAmount(step) {
    const { lunch, orderItems } = this.props;
    const availableCount = checkAvailableCount(lunch, orderItems);
    const { amount } = this.state;
    const currentStep = amount + step;
    const newAmount = currentStep < availableCount ? currentStep : availableCount;
    this.setState({amount: newAmount < 1 ? 1 : newAmount});
  }

  userHasDeliveries() {
    return this.props.user && this.props.user.deliveries_available > 0;
  }

  handleReviewsClose = () => {
    this.setState({activeModal: false});
  };

  render() {
    const { lunch, user, orderItems } = this.props;
    const { amount } = this.state;
    const availableCount = checkAvailableCount(lunch, orderItems);
    const hasDeliveries = this.userHasDeliveries();
    const disabledByTime = isLunchDisabled(lunch).byTime;
    const disabled = disabledByTime || availableCount < 1;
    const isToday = moment(lunch.ready_by).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD');
    return (
      <div>
        <Card className={styles.root}>
          <BuyModal onClose={::this.handleReviewsClose} active={this.state.activeModal} onClick={::this.checkout}/>
          <CardContent className={styles.cardContent}>
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
                <div className={styles.avaliableAmount}>Доступно <strong>{availableCount}</strong></div>
              </div>
              <Button className={styles.amountButton} type="button" icon="add" outlined mini flat
                      onClick={() => this.incrementAmount(1)}/>
            </div>
            }
            {disabled && <div className={styles.amountContainer}>
              <div className={styles.amountLabel}>
                <div>{disabledByTime ? 'Время до заказа истекло' : 'Нет доступных порций'}</div>
                <div><Link to="/">Закажите доступный обед</Link></div>
              </div>
            </div>
            }
            <div className={styles.price}>
              <span className={styles.priceAmount}>{Number(lunch.price)}</span>
              <span className={styles.priceCurrency}>грн</span>
            </div>

            <div>
              {isToday && !disabled && <OrderTimeoutStyled item={lunch}/>}
              <PurchaseLunch disabled={disabled} onBuy={::this.buy} label="Заказать обед" hasDeliveries={hasDeliveries}/>
            </div>

            <div className={styles.phone}>
              <p>Или закажи по телефону</p>
              <p><strong><a className={styles.link} href={'tel:' + config.app.phone}>{config.app.phone}</a></strong></p>
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
        {user && user.role === 'admin' &&
          <Card className={styles.editPanel}>
            <CardContent className={styles.cardContent}>
              <h3 className={styles.title}>Администратору</h3>
              <Link to={'/admin/lunches/' + lunch.id + '/edit'}>
                <MenuItem caption="Редактировать"/>
              </Link>
            </CardContent>
          </Card>
        }
      </div>
    );
  }
}
