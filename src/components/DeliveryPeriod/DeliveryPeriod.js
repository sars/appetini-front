import React, { PropTypes } from 'react';
import classNames from 'classnames';
import moment from 'moment';

const DeliveryPeriod = ({className, time}) => {
  const styles = require('./DeliveryPeriod.scss');

  const originalDate = moment(time);
  const nextDate = moment(time).add(30, 'minutes');

  return (
    <span className={classNames(styles.period, className)}>
      <i className="fa fa-calendar" />
      &nbsp;
      <span>{originalDate.format('dddd, DD.MM.YYYY, HH:mm-')}</span>
      <span>{nextDate.format('HH:mm')}</span>
    </span>
  );
};

DeliveryPeriod.propTypes = {
  className: PropTypes.string,
  time: PropTypes.string.isRequired
};

export default DeliveryPeriod;
