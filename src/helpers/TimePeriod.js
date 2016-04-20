import React, { Component, PropTypes } from 'react';
import moment from 'moment';

export default class TimePeriod extends Component {
  static propTypes = {
    className: PropTypes.string,
    period: PropTypes.any,
    date: PropTypes.any,
    children: PropTypes.node
  }

  render() {
    const {className, period, date, children} = this.props;
    const originalDate = moment(date);
    const nextDate = moment(date).add(period, 'minutes');

    return (
      <span {...this.props} className={className} role="time">
        <span>
          {originalDate.format('HH:mm')}
          &mdash;
          {nextDate.format('HH:mm')}
        </span>
        {children ? children : null}
      </span>
    );
  }
}
