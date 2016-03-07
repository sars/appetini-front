import React, { Component, PropTypes } from 'react';
import Card, { CardContent } from 'components/Card/Card';
import Button from 'components/Button/Button';
import times from 'lodash/times';
import classNames from 'classnames';
import { addOrderItem } from 'redux/modules/purchase';
import { connect } from 'react-redux';
import { FormattedPlural } from 'react-intl';
import styles from './styles.scss';

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
  }

  buy() {
    this.props.addOrderItem('Lunch', this.props.lunch, this.state.amount);
    if (!this.userHasDeliveries()) {
      this.props.addOrderItem('DeliveryTariff', this.props.individualTariff);
    }
    this.context.router.push('/checkout');
  }

  incrementAmount(step) {
    const newAmount = this.state.amount + step;
    this.setState({amount: newAmount < 1 ? 1 : newAmount});
  }

  userHasDeliveries() {
    return this.props.user && this.props.user.deliveries_available > 0;
  }

  render() {
    const { lunch, individualTariff } = this.props;
    const { amount } = this.state;
    const hasDeliveries = this.userHasDeliveries();

    return (
      <Card className={styles.root}>
        <CardContent className={styles.cardContent}>
          <div className={styles.amountContainer}>
            <Button className={styles.amountButton} type="button" icon="remove" outlined mini flat
                    onClick={() => this.incrementAmount(-1)}/>
            <span className={styles.amountText}>
              <span className={styles.amount}>{amount}</span>
              &nbsp;
              <span className={styles.amountLabel}>
                <FormattedPlural value={amount} one="порция" few="порции" many="порций" other="порций"/>
              </span>
            </span>
            <Button className={styles.amountButton} type="button" icon="add" outlined mini flat
                    onClick={() => this.incrementAmount(1)}/>
          </div>

          <div className={styles.price}>
            <span className={styles.priceAmount}>{Number(lunch.price)}</span>
            <span className={styles.priceCurrency}>грн</span>
          </div>

          <div>
            {hasDeliveries ?
              <div className={styles.buttonHint}>
                1 доставка будет списана при заказе с вашего счета
              </div> :
              <div className={styles.buttonHint}>+ доставка {Number(individualTariff.price)}грн</div>
            }
            <Button className={classNames(styles.button, styles.buyButton)} big flat accent label="Купить сейчас"
                    onClick={::this.buy}/>
          </div>

        </CardContent>

        {!hasDeliveries && <div className={styles.separator}>
          {times(50, (index) => <i key={index}/>)}
        </div>}

        {!hasDeliveries && <CardContent className={classNames(styles.subscribeContainer, styles.cardContent)}>
          <div className={styles.buttonHint}>+ доставка 10грн</div>
          <Button big flat accent className={classNames(styles.button, styles.subscribeButton)}
                  onClick={::this.subscribe}>
            <div>Подписаться</div>
            <div className={styles.buttonMinorLabel}>и купить</div>
          </Button>
        </CardContent>}
      </Card>
    );
  }
}
