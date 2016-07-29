import React, { Component, PropTypes } from 'react';
import Card from 'components/Card/Card';
import StarRating from 'react-star-rating';
import { FormattedPlural } from 'react-intl';
import { Link } from 'react-router';
import DeliveryPeriod from 'components/DeliveryPeriod/DeliveryPeriod';
import styles from './styles.scss';

export default class TeamOffer extends Component {
  static propTypes = {
    offer: PropTypes.object.isRequired
  }

  render() {
    const { offer } = this.props;
    return (
      <Link to="/" className={styles.teamOfferWrapper}>
        <DeliveryPeriod className={styles.readyBy} time={offer.ready_by}/>
        <Card className={styles.offerCard}>
          <div className={styles.imgWrapper}>
            <img src={offer.cook.main_photo.thumb.url} alt={offer.cook.full_name_genitive}/>
          </div>
          <div className={styles.info}>
            <div className={styles.cookInfo}>
              <div className={styles.cookName}>{offer.cook.full_name_genitive}</div>
              <div className={styles.rating}>
                <StarRating name="cook-rating" totalStars={5}
                            editing={false} rating={offer.cook.rating} size={12}/>
              </div>
              <div className={styles.feedback}>
                {offer.cook.reviews_count}
                &nbsp;
                <FormattedPlural value={offer.cook.reviews_count} one="отзыв" few="отзыва" many="отзывов"
                                 other="отзывов"/>
              </div>
            </div>
            <div>От <strong>{offer.min_lunches_amount}</strong> порций</div>
          </div>
        </Card>
      </Link>
    );
  }
}
