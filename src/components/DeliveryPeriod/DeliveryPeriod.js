import React, { PropTypes } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import styles from './styles.scss';
import humanizeDayName from 'components/humanizeDayName/humanizeDayName';
import TimePeriod from 'helpers/TimePeriod';

const DeliveryPeriod = ({className, time}) => {
  const originalDate = moment(time);

  return (
    <span className={classNames(styles.root, className)}>
      <i className="fa fa-calendar" />
      <span className={styles.unit} role="day">{humanizeDayName(originalDate, 'dddd')}</span>
      <span className={styles.unit} role="date">
        {originalDate.format('DD.MM.YYYY')}
      </span>
      <TimePeriod date={time} className={styles.unit} period={30}/>
    </span>
  );
};

DeliveryPeriod.propTypes = {
  className: PropTypes.string,
  time: PropTypes.string.isRequired
};

export default DeliveryPeriod;
