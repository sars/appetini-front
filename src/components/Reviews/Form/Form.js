import React, { Component, PropTypes } from 'react';
import {reduxForm} from 'redux-form';
import Button from 'components/Button/Button';
import Input from 'components/Input/Input';
import { show as showToast } from 'redux/modules/toast';
import { connect } from 'react-redux';
import StarRating from 'react-star-rating';
import styles from '../styles.scss';

@connect(null, { showToast })
@reduxForm({
  form: 'review',
  fields: ['body', 'rating']
})
export default class Form extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    submitting: PropTypes.bool
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  errorsFor(fieldName) {
    const { fields } = this.props;
    return fields[fieldName].error && !fields[fieldName].visited &&
      <div className={styles.error}>{fields[fieldName].error}</div>;
  }

  handleRatingClick(event, result) {
    this.props.fields.rating.onChange(result.rating);
  }

  handleSubmit(event) {
    event.preventDefault();
    return this.props.handleSubmit().then(() => {
      this.props.resetForm();
    });
  }

  render() {
    const { fields: {body, rating}, submitting } = this.props;

    return (
      <form className={styles.root} onSubmit={::this.handleSubmit}>
        <div className={styles.ratingFieldContainer}>
          <div className={styles.ratingFieldInner}>
            <StarRating name="review-rating" totalStars={5} rating={rating.value} size={24}
                        onRatingClick={::this.handleRatingClick}/>
          </div>
          {this.errorsFor('rating')}
        </div>
        <Input multiline placeholder="Текст вашего отзыва" className={styles.reviewField} {...body}/>

        <div className={styles.buttons}>
          <Button big className={styles.button} accent flat label="Отправить" type="submit"
                  disabled={submitting || (!body.value || !rating.value)}/>
        </div>
      </form>
    );
  }
}
