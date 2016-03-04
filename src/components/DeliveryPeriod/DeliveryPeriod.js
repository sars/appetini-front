import React, { PropTypes } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import styles from './styles.scss';

const DeliveryPeriod = ({className, time}) => {
  const originalDate = moment(time);
  const nextDate = moment(time).add(30, 'minutes');

  return (
    <span className={classNames(styles.root, className)}>
      <i className="fa fa-calendar" />
      <span className={styles.unit} role="day">{originalDate.format('dddd')}</span>
      <span className={styles.unit} role="date">
        {originalDate.format('DD.MM.YYYY')}
      </span>
      <span className={styles.unit} role="time">
        {originalDate.format('HH:mm')}
        &mdash;
        {nextDate.format('HH:mm')}
      </span>
    </span>
  );
};

DeliveryPeriod.propTypes = {
  className: PropTypes.string,
  time: PropTypes.string.isRequired
};

export default DeliveryPeriod;
