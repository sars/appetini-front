import React, { PropTypes } from 'react';
import Card from 'components/Card/Card';
import StarRating from 'react-star-rating';
import classNames from 'classnames';
import { Link } from 'react-router';
import {FormattedPlural} from 'react-intl';

const Lunch = ({className, lunch}) => {
  const {cook} = lunch;
  const styles = require('./Lunch.scss');

  return (
    <Link to={`/lunches/${lunch.id}`} className={classNames(styles.lunch, className)}>
      <Card className={styles.card}>
        <div className={styles.photoWrapper}>
          <img className={styles.photo} src={lunch.photos[0].url} />
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
                <FormattedPlural value={cook.reviews_count} one="отзыв" few="отзыва" many="отзывов" other="отзывов" />
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
  lunch: PropTypes.object
};

export default Lunch;
