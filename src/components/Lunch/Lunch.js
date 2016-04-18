import React, { PropTypes } from 'react';
import Card from 'components/Card/Card';
import DeliveryPeriod from 'components/DeliveryPeriod/DeliveryPeriod';
import StarRating from 'react-star-rating';
import classNames from 'classnames';
import { Link } from 'react-router';
import { FormattedPlural } from 'react-intl';
import styles from './styles.scss';
import OrderTimeout from 'components/OrderTimeout/OrderTimeout';
import isLunchDisabled from 'helpers/isLunchDisabled';
import Label from 'components/label/label';
import tooltip from 'react-toolbox/lib/tooltip';

const TooltipLabel = tooltip(Label);

const Lunch = ({className, lunch, near}) => {
  const { cook } = lunch;
  const lunchDisabled = isLunchDisabled(lunch);
  const disabledByTime = lunchDisabled.byTime;
  const disabledByCount = lunchDisabled.byCount;
  const disabled = disabledByTime || disabledByCount;

  return (
    <Link to={`/lunches/${lunch.id}`} className={classNames(styles.root, className, {[styles.disabled]: disabled})}>
      {!near &&
        (disabled ?
          <span className={styles.orderTimeoutWrapper}>
            <TooltipLabel tooltip="Этот обед уже нельзя заказать" label={disabledByTime ? 'Время до заказа истекло' : 'Порции закончились'}/>
          </span> :
          <DeliveryPeriod className={styles.readyBy} time={lunch.ready_by}/>)
      }
      {near && <span className={styles.orderTimeoutWrapper}>До окончания заказа: <OrderTimeout className={styles.timer} lunch={lunch}/> : </span>}
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
          <div className={styles.avatar}>
            <img src={cook.main_photo.thumb.url}/>
          </div>
          <div>
            <div className={styles.cookName}>{cook.first_name + ' ' + cook.last_name}</div>
            <div className={styles.rating}>
              <StarRating className={styles.starRating} name="cook-rating" totalStars={5}
                          editing={false} rating={cook.rating} size={12} />
              <span className={styles.feedback}>
                {cook.reviews_count}
                &nbsp;
                <FormattedPlural value={cook.reviews_count} one="отзыв" few="отзыва" many="отзывов" other="отзывов"/>
              </span>
            </div>
          </div>
          <div className={styles.price}>
            <span className={styles.priceAmount}>{Number(lunch.price)}</span>
            <span className={styles.priceCurrency}>грн</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

Lunch.propTypes = {
  className: PropTypes.string,
  lunch: PropTypes.object,
  near: PropTypes.bool
};

export default Lunch;
