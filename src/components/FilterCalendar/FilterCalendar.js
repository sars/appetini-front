import React, { Component, PropTypes } from 'react';
import CheckButtonsGroup from 'components/CheckButtonsGroup/CheckButtonsGroup';
import times from 'lodash/times';
import moment from 'moment';
import classNames from 'classnames';
import groupBy from 'lodash/groupBy';

export default class FilterCalendar extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    dates: PropTypes.array.isRequired,
    availability: PropTypes.array.isRequired
  };

  buttonsGroupTemplate(checkButtons) {
    const styles = require('./FilterCalendar.scss');

    return (
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
        {times(Math.ceil(checkButtons.length / 7), trIndex =>
          <tr key={trIndex}>
            {times(checkButtons.length - trIndex * 7 > 7 ? 7 : checkButtons.length - trIndex * 7, tdIndex => {
              return (
                <td key={tdIndex}>
                  {checkButtons[trIndex * 7 + tdIndex]}
                </td>
              );
            })}
          </tr>
        )}
        </tbody>
      </table>
    );
  }

  render() {
    const styles = require('./FilterCalendar.scss');
    const currentDate = moment().startOf('day');
    const {onChange, dates, availability} = this.props;

    const checkButtons = availability.reduce((result, item) => ({...result, [item.date]: item.date.split('-')[2]}), {});
    const availabilityGrouped = groupBy(availability, 'date');

    const checkButtonProps = (value) => {
      const date = moment(value);

      return {
        className: classNames(styles.checkButton, {[styles.current]: date.isSame(currentDate)}),
        checkedClass: styles.checked,
        disabledClass: styles.disabled,
        disabled: !availabilityGrouped[value][0].available || date.isBefore(currentDate)
      };
    };

    return (
      <CheckButtonsGroup ref="calendarButtons" onChange={onChange} source={checkButtons}
                         checkButtonProps={checkButtonProps} value={dates} template={this.buttonsGroupTemplate} />
    );
  }
}
