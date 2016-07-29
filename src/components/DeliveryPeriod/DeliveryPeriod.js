import React, { PropTypes } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import styles from './styles.scss';
import humanizeDayName from 'components/humanizeDayName/humanizeDayName';
import TimePeriod from 'helpers/TimePeriod';
import tooltip from 'react-toolbox/lib/tooltip';

const TooltipTimePeriod = tooltip(TimePeriod);

const DeliveryPeriod = ({className, time}) => {
  const originalDate = moment(time);

  return (
    <span className={classNames(styles.root, styles.readyBy, className)}>
      <i className="fa fa-calendar" />
      <span className={styles.unit} role="day">{humanizeDayName(originalDate, 'dddd')}</span>
      <span className={styles.unit} role="date">
        {originalDate.format('DD.MM.YYYY')}
      </span>
      <TooltipTimePeriod date={time} className={styles.unit} period={30} tooltip="Время доставки"/>
    </span>
  );
};

DeliveryPeriod.propTypes = {
  className: PropTypes.string,
  time: PropTypes.string.isRequired
};

export default DeliveryPeriod;
