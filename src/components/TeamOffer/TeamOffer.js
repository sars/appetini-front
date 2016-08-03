import React, { Component, PropTypes } from 'react';
import Card from 'components/Card/Card';
import Feedback from 'components/Feedback/Feedback';
import StarRating from 'react-star-rating';
import { FormattedPlural } from 'react-intl';
import ItemDeliveryTime from 'components/ItemDeliveryTime/ItemDeliveryTime';
import { Link } from 'react-router';
import styles from './styles.scss';

export default class TeamOffer extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    near: PropTypes.bool
  }

  render() {
    const offer = this.props.item;
    return (
      <Link to={`/team_offers/${offer.id}`} className={styles.teamOfferWrapper}>
        <ItemDeliveryTime near={this.props.near} item={offer}/>
        <Card className={styles.offerCard}>
          <div className={styles.imgWrapper}>
            <img src={offer.cook.main_photo.thumb.url} alt={offer.cook.full_name}/>
          </div>
          <div className={styles.info}>
            <div className={styles.cookInfo}>
              <div className={styles.cookName}>{offer.cook.full_name_genitive}</div>
              <div className={styles.rating}>
                <StarRating name="cook-rating" totalStars={5}
                            editing={false} rating={offer.cook.rating} size={12}/>
              </div>
              <Feedback reviewsCount={offer.cook.reviews_count} className={styles.feedback}/>
            </div>
            <div>От <strong>{offer.min_lunches_amount}</strong> <FormattedPlural value={offer.min_lunches_amount} one="порция" few="порции" many="порций" other="порций"/></div>
          </div>
        </Card>
      </Link>
    );
  }
}
