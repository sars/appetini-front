import React, { Component, PropTypes } from 'react';
import CheckButtonsGroup from 'components/CheckButtonsGroup/CheckButtonsGroup';
import CheckButton from 'components/CheckButton/CheckButton';
import times from 'lodash/times';
import moment from 'moment';
import classNames from 'classnames';

export default class FilterCalendar extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    dates: PropTypes.array.isRequired,
    availability: PropTypes.array.isRequired
  };

  render() {
    const styles = require('./FilterCalendar.scss');
    const currentDate = moment().startOf('day');
    const {onChange, dates, availability} = this.props;

    return (
      <CheckButtonsGroup ref="calendarButtons" onChange={onChange} value={dates}>
        <table className={styles.calendar}>
          <tbody>
          <tr>
            <th>Пн</th>
            <th>Вт</th>
            <th>Ср</th>
            <th>Чт</th>
            <th>Пт</th>
            <th>Сб</th>
            <th>Вс</th>
          </tr>
          {times(Math.ceil(availability.length / 7), trIndex =>
            <tr key={trIndex}>
              {times(availability.length - trIndex * 7 > 7 ? 7 : availability.length - trIndex * 7, tdIndex => {
                const value = availability[(trIndex * 7) + tdIndex];
                const date = moment(value.date);

                return (
                  <td key={tdIndex}>
                    <CheckButton className={classNames(styles.checkButton, {[styles.current]: date.isSame(currentDate)})}
                                 checkedClass={styles.checked} disabledClass={styles.disabled}
                                 disabled={!value.available || date.isBefore(currentDate)}
                                 checked={dates.indexOf(value.date.toString()) !== -1}
                                 label={value.date.split('-')[2].toString()}
                                 onChange={checked => this.refs.calendarButtons.handleChange(value.date)(checked)} />
                  </td>
                );
              })}
            </tr>
          )}
          </tbody>
        </table>
      </CheckButtonsGroup>
    );
  }
}
