import React, { Component, PropTypes } from 'react';
import Card, { CardContent } from 'components/Card/Card';
import Button from 'components/Button/Button';
import times from 'lodash/times';
import classNames from 'classnames';
import { incrementAmount } from 'redux/modules/purchase';
import { connect } from 'react-redux';
import { FormattedPlural } from 'react-intl';
import styles from './styles.scss';

@connect(state => ({ amount: state.purchase.amount }), { incrementAmount })
export default class Purchase extends Component {
  static propTypes = {
    lunch: PropTypes.object.isRequired,
    incrementAmount: PropTypes.func.isRequired,
    amount: PropTypes.number.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  render() {
    const { lunch, amount } = this.props;

    return (
      <Card className={styles.root}>
        <CardContent className={styles.cardContent}>
          <div className={styles.amountContainer}>
            <Button className={styles.amountButton} type="button" icon="remove" outlined mini flat
                    onClick={() => this.props.incrementAmount(-1)}/>
            <span className={styles.amountText}>
              <span className={styles.amount}>{amount}</span>
              &nbsp;
              <span className={styles.amountLabel}>
                <FormattedPlural value={amount} one="порция" few="порции" many="порций" other="порций"/>
              </span>
            </span>
            <Button className={styles.amountButton} type="button" icon="add" outlined mini flat
                    onClick={() => this.props.incrementAmount(1)}/>
          </div>

          <div className={styles.price}>
            <span className={styles.priceAmount}>{Number(lunch.price)}</span>
            <span className={styles.priceCurrency}>грн</span>
          </div>

          <div>
            <div className={styles.buttonHint}>+ доставка 30грн</div>
            <Button className={classNames(styles.button, styles.buyButton)} big flat accent label="Купить сейчас"/>
          </div>

        </CardContent>

        <div className={styles.separator}>
          {times(50, (index) => <i key={index}/>)}
        </div>

        <CardContent className={classNames(styles.subscribeContainer, styles.cardContent)}>
          <div className={styles.buttonHint}>+ доставка 10грн</div>
          <Button big flat accent className={classNames(styles.button, styles.subscribeButton)}
                  onClick={() => this.context.router.push('/tariffs')}>
            <div>Подписаться</div>
            <div className={styles.buttonMinorLabel}>и купить</div>
          </Button>
        </CardContent>
      </Card>
    );
  }
}
