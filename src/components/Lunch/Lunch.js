import React, { PropTypes } from 'react';
import { Card } from 'react-toolbox/lib/card';
import Avatar from 'react-toolbox/lib/avatar';
import StarRating from 'react-star-rating';
import classNames from 'classnames';
import { Link } from 'react-router';

const Lunch = ({className, lunch}) => {
  const {cook} = lunch;
  const styles = require('./Lunch.scss');
  const toolboxStyles = require('react-toolbox/lib/card/style.scss');

  return (
    <Link to={`/lunches/${lunch.id}`}>
      <Card className={classNames(styles.lunch, className)}>
        <div style={{backgroundImage: `url('${lunch.photos[0].url}')`}}
             className={classNames(toolboxStyles.cardMedia, toolboxStyles.wide)}>
          <div className={styles.dishes}>
            {lunch.dishes.map(dish =>
              <div key={dish.id} className={styles.dish}>{dish.name}</div>
            )}
          </div>
        </div>

        <div className={styles.bottom}>
          <Avatar image={cook.main_photo.thumb.url} />
          <div>
            <span>{cook.first_name + ' ' + cook.last_name}</span>
            <div className={styles.rating}>
              <StarRating className={styles.starRating} name="cook-rating" totalStars={5} editing={false} rating={3} size={20} />
              <span className={styles.feedback}>31 отзыв</span>
            </div>
          </div>
          <div className={styles.price}>
            <span className={styles.priceAmount}>40</span>
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
