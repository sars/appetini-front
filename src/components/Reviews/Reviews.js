import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import StarRating from 'react-star-rating';
import styles from './styles.scss';
import moment from 'moment';
import Form from './Form/Form';
import normalizeErrors from 'helpers/normalizeErrors';
import { createReview } from 'redux/modules/common';

@connect(state => ({ user: state.auth.user }), { createReview })
export default class Reviews extends Component {
  static propTypes = {
    reviews: PropTypes.object.isRequired,
    cook: PropTypes.object.isRequired,
    user: PropTypes.object,
    createReview: PropTypes.func.isRequired
  };

  submit(review) {
    const { user, cook } = this.props;
    return new Promise((resolve, reject) => {
      this.props.createReview({
        ...review,
        user_id: user.id,
        cook_id: cook.id
      }).then(response => {
        resolve(response);
      }).catch(response => {
        const errors = normalizeErrors(response.errors);
        reject({...errors, _error: errors});
      });
    });
  }

  render() {
    const { reviews, user } = this.props;
    return (
      <div className={styles.root}>
        {user && <Form onSubmit={::this.submit}/>}
        {reviews.resources.map(review =>
          <div className={styles.review} key={review.id}>
            <h3>{review.user.name}</h3>
            <div className={styles.ratingWrapper}>
              <StarRating name="review-rating" totalStars={5} editing={false} rating={review.rating} size={18}/>
              <div className={styles.createdAt}>
                {moment(review.created_at).format('DD.MM.YYYY')}
              </div>
            </div>
            <div className={styles.body}>
              {review.body}
            </div>
          </div>
        )}
      </div>
    );
  }
}
