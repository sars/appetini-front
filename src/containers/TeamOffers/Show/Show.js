import React, { Component, PropTypes } from 'react';
import ColumnLayout from 'components/ColumnLayout/ColumnLayout';
import { asyncConnect } from 'redux-async-connect';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Card from 'components/Card/Card';
import classnames from 'classnames';
import Reviews from 'components/Reviews/Reviews';
import Modal from 'components/Modal/Modal';
import TeamLunch from 'components/TeamLunch/TeamLunch';
import CookPreview from 'components/LunchDetailsCook/Preview/Preview';
import DeliveryPeriod from 'components/DeliveryPeriod/DeliveryPeriod';
import Cook from 'components/LunchDetailsCook/Cook';
import OrderTimeoutStyled from 'components/OrderTimeout/OrderTimeoutStyled';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { getReviews } from 'redux/modules/common';
import find from 'lodash/find';
import without from 'lodash/without';
import sumBy from 'lodash/sumBy';
import forIn from 'lodash/forIn';
import moment from 'moment';
import isLunchDisabled from 'helpers/isLunchDisabled';
import { addTeamOrder } from 'redux/modules/purchase';
import { show as showToast } from 'redux/modules/toast';
import PurchaseLunch from 'components/PurchaseLunch/PurchaseLunch';
import styles from './styles.scss';

function isReviews(location) {
  return /\/reviews$/.test(location.pathname);
}

const getLunchAmount = (lunch, teamOrder) => {
  const lunchInOrder = find(teamOrder.order_items_attributes, {resource_id: lunch.id});
  return lunchInOrder ? lunchInOrder.amount : 0;
};

@asyncConnect([
  {key: 'offer', promise: ({params, helpers, location, store: { dispatch }}) => {
    return helpers.client.get(`/team_offers/${params.offerId}`)
      .then(response => {
        return isReviews(location)
          ? dispatch(getReviews(response.resource.cook.id, params.page)).then(() => response.resource)
          : response.resource;
      });}
  }
])
@connect(state => ({
  reviews: state.common.reviews,
  user: state.auth.user
}), { addTeamOrder, showToast })
export default class TeamOffers extends Component {
  static propTypes = {
    offer: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    addTeamOrder: PropTypes.func.isRequired,
    user: PropTypes.object,
    showToast: PropTypes.func.isRequired,
    reviews: PropTypes.object
  };

  static contextTypes = {
    client: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      teamOrder: {
        team_offer_id: props.offer.id,
        order_items_attributes: []
      }
    };
  }

  handleReviewsClose() {
    this.context.router.push(`/team_offers/${this.props.offer.id}`);
  }

  buy = () => {
    const { client } = this.context;
    const { teamOrder } = this.state;
    client.post('/team_orders/', {data: {resource: teamOrder}})
      .then(response => {
        this.props.addTeamOrder(response.resource);
        this.props.showToast('Корпоративный обед успешно добавлен в корзину', 'accept', 'done');
        this.context.router.push('/checkout');
      })
      .catch(response => {
        const errors = [];
        forIn(response.errors, errorsArray => errorsArray.map(error => errors.push(error)));
        this.props.showToast(errors.join('; '), 'warning', 'error');
      });
  }

  handleChangeAmount = (lunch, amount) => {
    const { teamOrder } = this.state;
    const orderLunches = teamOrder.order_items_attributes;
    if (amount <= lunch.available_count && amount >= 0) {
      const newOrderLunches = without(orderLunches, find(orderLunches, {resource_id: lunch.id}));
      if ( amount > 0 ) {
        newOrderLunches.push({resource_id: lunch.id, amount: amount, resource_type: 'Lunch', price: lunch.price});
      }
      this.setState({
        teamOrder: {
          ...teamOrder,
          order_items_attributes: newOrderLunches
        }
      });
    }
  }

  render() {
    const { offer, location, reviews, user } = this.props;
    const { teamOrder } = this.state;
    const hasDeliveries = user && user.deliveries_available > 0;
    const lunchesInTeamOrder = teamOrder.order_items_attributes;
    const teamOrderAmount = sumBy(lunchesInTeamOrder, (lunchInOrder) => lunchInOrder.amount);
    const totalPrice = sumBy(lunchesInTeamOrder, lunch => lunch.price * lunch.amount);
    const disableByCount = sumBy(offer.lunches, lunch => lunch.available_count) < offer.min_lunches_amount;
    const disabledByTime = isLunchDisabled(offer).byTime;
    const orderAllowed = teamOrderAmount < offer.min_lunches_amount;
    const disabled = disableByCount || disabledByTime;
    const isToday = moment(offer.ready_by).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD');
    return (
      <ColumnLayout className={styles.root}>
        <Modal.Dialog active={isReviews(location)} title="Отзывы о кулинаре" onClose={::this.handleReviewsClose}>
          {reviews && <Reviews reviews={reviews} cook={offer.cook}/>}
        </Modal.Dialog>
        <ReactCSSTransitionGroup transitionEnterTimeout={310} transitionLeaveTimeout={310} transitionName="overlay">
          {this.state.cookOpened && <div key="overlay" className={styles.overlay}
                                         onClick={() => this.setState({cookOpened: false})}></div>}
        </ReactCSSTransitionGroup>
        <div className={styles.teamOfferWrapper}>
          <div className={classnames(styles.cookContainer, this.state.cookOpened ? styles.showCookModal : '')}>
            <Cook cook={offer.cook} resourceId={offer.id} resourceType="team_offers"/>
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
            <div className={styles.countAndPurchase}>
              <Card className={classnames(styles.countCard, styles.card)}>
                {disabled && <div>
                  <div>{disabledByTime ? 'Время до заказа истекло' : 'Не достаточно доступных порций'}</div>
                  <div className={styles.amountLabel}><Link to="/team_offers">Закажите доступный корпоративный обед</Link></div>
                </div>
                }
                {!disabled && <div>
                  <div className={styles.count}>Минимум порций для заказа: <strong>{offer.min_lunches_amount}</strong></div>
                  <div className={classnames({[styles.orderCount]: orderAllowed})}>Заказано: <strong>{teamOrderAmount}</strong></div>
                  <div><span className={styles.cost}>{totalPrice}</span> грн</div>
                </div>}
              </Card>
              <Card className={classnames(styles.purchaseCard, styles.card)}>
                <div>
                  {isToday && !disabled && <OrderTimeoutStyled item={offer}/>}
                  <PurchaseLunch disabled={orderAllowed} onBuy={::this.buy} label="Заказать" hasDeliveries={hasDeliveries}/>
                </div>
              </Card>
            </div>
            <div className={styles.lunchesWrapper}>
              {offer.lunches.map((lunch, idx) => {
                return (<TeamLunch key={idx} lunch={lunch} onChangeAmount={::this.handleChangeAmount}
                                   amount={getLunchAmount(lunch, teamOrder)}/>);
              })}
            </div>
          </div>
        </div>
      </ColumnLayout>
    );
  }
}
