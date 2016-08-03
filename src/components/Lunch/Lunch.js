import React, { PropTypes, Component } from 'react';
import Card from 'components/Card/Card';
import StarRating from 'react-star-rating';
import Feedback from 'components/Feedback/Feedback';
import ItemDeliveryTime from 'components/ItemDeliveryTime/ItemDeliveryTime';
import classNames from 'classnames';
import { Link } from 'react-router';
import Button from 'components/Button/Button';
import styles from './styles.scss';
import isLunchDisabled from 'helpers/isLunchDisabled';
import find from 'lodash/find';
import { addOrderItem } from 'redux/modules/purchase';
import { connect } from 'react-redux';
import fbEvent from 'components/fbEvent/fbEvent';
import { show as showToast } from 'redux/modules/toast';


@connect(state => ({lunchesAmount: state.purchase.lunchesAmount, orderItems: state.purchase.orderItems}), { addOrderItem, showToast })
export default class Lunch extends Component {
  static propTypes = {
    className: PropTypes.string,
    item: PropTypes.object,
    near: PropTypes.bool,
    orderItems: PropTypes.array,
    addOrderItem: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired,
    lunchesAmount: PropTypes.number.isRequired
  };

  buy = (event) => {
    event.preventDefault();
    const lunch = this.props.item;
    fbEvent('track', 'AddToCart');
    this.props.showToast('Заказ добавлен в корзину', 'accept', 'done');
    this.props.addOrderItem('Lunch', lunch, 1);
  };

  render() {
    const {className, near, orderItems} = this.props;
    const lunch = this.props.item;
    const lunchInCart = find(orderItems, {resource_id: lunch.id});
    const { cook } = lunch;
    const availableCount = lunchInCart ? (lunch.available_count - lunchInCart.amount) : lunch.available_count;
    const disabledByTime = isLunchDisabled(lunch).byTime;
    const disabled = disabledByTime || availableCount < 1;

    return (
        <Link to={`/lunches/${lunch.id}`} className={classNames(styles.root, className, {[styles.disabled]: disabled}, styles.animated, styles.fadeInUp)}>
          <ItemDeliveryTime near={near} disabled={disabled} disabledByTime={disabledByTime} item={lunch}/>
          <Card className={styles.card}>
            <div className={styles.photoWrapper}>
              <img className={styles.photo} src={lunch.photos[0].thumb.url} />
              <div className={styles.dishes}>
                {lunch.dishes.map(dish =>
                  <div key={dish.id} className={styles.dish}>{dish.name}</div>
                )}
              </div>
            </div>
            <div className={styles.bottom}>
              <div className={styles.cookInfo}>
                <div className={styles.avatar}>
                  <img src={cook.main_photo.thumb.url}/>
                </div>
                <div className={styles.cook}>
                  <div className={styles.cookName}>{cook.first_name + ' ' + cook.last_name}</div>
                  <div className={styles.rating}>
                    <StarRating className={styles.starRating} name="cook-rating" totalStars={5}
                                editing={false} rating={cook.rating} size={12} />
                    <Feedback reviewsCount={cook.reviews_count} className={styles.feedback}/>
                  </div>
                </div>
              </div>
              <div className={styles.price}>
                <span className={styles.priceAmount}>{Number(lunch.price)}</span>
                <span className={styles.priceCurrency}>грн</span>
              </div>
              <div className={styles.buyBtnWrapper}>
                <Button flat accent label="Заказать" className={styles.buyBtn} onClick={::this.buy} disabled={disabled}/>
              </div>
            </div>
          </Card>
        </Link>
    );
  }
}
