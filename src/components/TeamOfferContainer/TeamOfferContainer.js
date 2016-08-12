import React, { Component, PropTypes } from 'react';
import ColumnLayout from 'components/ColumnLayout/ColumnLayout';
import classnames from 'classnames';
import CookPreview from 'components/LunchDetailsCook/Preview/Preview';
import DeliveryPeriod from 'components/DeliveryPeriod/DeliveryPeriod';
import Cook from 'components/LunchDetailsCook/Cook';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Card from 'components/Card/Card';
import { Link } from 'react-router';
import sumBy from 'lodash/sumBy';
import OrderTimeoutStyled from 'components/OrderTimeout/OrderTimeoutStyled';
import ShareTeamOrder from 'components/ShareTeamOrder/ShareTeamOrder';
import moment from 'moment';
import isLunchDisabled from 'helpers/isLunchDisabled';
import PurchaseLunch from 'components/PurchaseLunch/PurchaseLunch';
import styles from './styles.scss';

export default class TeamOfferContainer extends Component {
  static propTypes = {
    offer: PropTypes.object.isRequired,
    user: PropTypes.object,
    onBuy: PropTypes.func,
    onShare: PropTypes.func,
    children: PropTypes.any,
    hideExternalLinks: PropTypes.bool,
    orderedAmount: PropTypes.number,
    totalPrice: PropTypes.any,
    shareLink: PropTypes.string,
    disabled: PropTypes.bool
  };

  state = {
    cookOpened: false
  }

  render() {
    const { offer, children, orderedAmount, shareLink, hideExternalLinks, onShare, user, onBuy, totalPrice, disabled } = this.props;
    const disabledByCount = sumBy(offer.lunches, 'available_count') < offer.min_lunches_amount;
    const disabledByTime = isLunchDisabled(offer).byTime;
    const hasDeliveries = user && user.deliveries_available > 0;
    const orderAllowed = orderedAmount < offer.min_lunches_amount;
    const isToday = moment(offer.ready_by).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD');
    return (
      <ColumnLayout className={styles.root}>
        <ReactCSSTransitionGroup transitionEnterTimeout={310} transitionLeaveTimeout={310} transitionName="overlay">
          {this.state.cookOpened && <div key="overlay" className={styles.overlay}
                                         onClick={() => this.setState({cookOpened: false})}></div>}
        </ReactCSSTransitionGroup>
        <div className={styles.teamOfferWrapper}>
          <div className={classnames(styles.cookContainer, this.state.cookOpened ? styles.showCookModal : '')}>
            <Cook cook={offer.cook} hideExternalLinks={hideExternalLinks}/>
          </div>
          <div className={styles.titleAndPurchase}>
            <div className={styles.header}>
              <h2 className={styles.title}>Корпоративный обед от {offer.cook.full_name_genitive}</h2>
              <CookPreview cook={offer.cook} className={styles.cookPreview}
                           onClick={() => this.setState({cookOpened: true})}/>
              <div className={styles.deliveryPeriodWrapper}>
                <DeliveryPeriod time={offer.ready_by} className={styles.deliveryPeriod}/>
              </div>
            </div>
            <ShareTeamOrder shareLink={shareLink} onShare={onShare}/>
            <div className={styles.countAndPurchase}>
              <Card className={classnames(styles.countCard, styles.card)}>
                {disabledByTime || disabledByCount
                  ? <div>
                      <div>{disabledByTime ? 'Время до заказа истекло' : 'Не достаточно доступных порций'}</div>
                      <div className={styles.amountLabel}><Link to="/team_offers">Закажите доступный корпоративный обед</Link></div>
                    </div>
                  : <div>
                      <div className={styles.count}>Минимум порций для заказа: <strong>{offer.min_lunches_amount}</strong></div>
                      <div className={classnames({[styles.orderCount]: orderAllowed})}>Заказано: <strong>{orderedAmount}</strong></div>
                      <div><span className={styles.cost}>{Number(totalPrice)}</span> грн</div>
                    </div>
                }
              </Card>
              <Card className={classnames(styles.purchaseCard, styles.card)}>
                <div>
                  {isToday && !disabled && <OrderTimeoutStyled item={offer}/>}
                  <PurchaseLunch disabled={disabled || disabledByCount || disabledByTime || orderAllowed} onBuy={onBuy} label="Заказать" hasDeliveries={hasDeliveries}/>
                </div>
              </Card>
            </div>
            {children}
          </div>
        </div>
      </ColumnLayout>
    );
  }
}
