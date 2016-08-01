import React, { Component, PropTypes} from 'react';
import { FormattedPlural } from 'react-intl';

export default class Feedback extends Component {
  static propTypes = {
    reviewsCount: PropTypes.number.isRequired,
    className: PropTypes.any
  };

  render() {
    const { className, reviewsCount } = this.props;
    return (
      <div className={className}>
        {reviewsCount}
        &nbsp;
        <FormattedPlural value={reviewsCount} one="отзыв" few="отзыва" many="отзывов"
                         other="отзывов"/>
      </div>
    );
  }
}
