import React, { Component, PropTypes } from 'react';
import moment from 'moment';

export default class TimePeriod extends Component {
  static propTypes = {
    className: PropTypes.string,
    period: PropTypes.any,
    date: PropTypes.any
  }

  render() {
    const {className, period, date} = this.props;
    const originalDate = moment(date);
    const nextDate = moment(date).add(period, 'minutes');

    return (
      <span className={className} role="time">
        {originalDate.format('HH:mm')}
        &mdash;
        {nextDate.format('HH:mm')}
      </span>
    );
  }
}
