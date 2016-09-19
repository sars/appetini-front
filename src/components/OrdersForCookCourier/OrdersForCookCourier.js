import React, { Component, PropTypes } from 'react';
import ColumnLayout from 'components/ColumnLayout/ColumnLayout';
import DatePicker from 'components/DatePicker/DatePicker';
import humanizeDayName from 'components/humanizeDayName/humanizeDayName';
import classNames from 'classnames';
import Button from 'components/Button/Button';
import styles from './styles.scss';
import {getParsedDate} from 'helpers/ordersDateHelper';
import Toggle from 'components/Toggle/Toggle';
import omit from 'lodash/omit';

const correctDate = (name, date) => {
  const correctedDate = new Date(date.getTime());
  name === 'lt_date' ? correctedDate.setHours(23, 59, 59) : correctedDate.setHours(0, 0, 0); // eslint-disable-line no-unused-expressions
  return correctedDate;
};

export default class OrdersForCookCourier extends Component {

  static propTypes = {
    location: PropTypes.object,
    sortByOrderItem: PropTypes.func,
    clearSortByOrderItem: PropTypes.func,
    title: PropTypes.string,
    sorted: PropTypes.any,
    children: PropTypes.element.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  onToggleChange = () => {
    const intervalWasChosen = this.props.location.query.interval;
    this.locationChanged(this.locationWithNewQuery('interval', intervalWasChosen ? undefined : true, this.clearFilter()));
  };

  getIntervalSubTitle = () => {
    const { location, sorted } = this.props;
    const { gt_date: gtDate, lt_date: ltDate } = location.query;
    return (
      <span>
        {sorted ? 'Обеды' : 'Заказы'}
        {gtDate &&
          <span> от <span className={styles.dayName}>{humanizeDayName(getParsedDate(gtDate), 'DD MMMM')}</span></span>
        }
        {ltDate &&
          <span> до <span className={styles.dayName}>{humanizeDayName(getParsedDate(ltDate), 'DD MMMM')}</span></span>
        }
      </span>
    );
  };

  getSingleDateSubTitle = () => {
    const { location, sorted } = this.props;
    const { eq_date: eqDate } = location.query;
    const date = eqDate ? getParsedDate(eqDate) : new Date();
    return <span>{sorted ? 'Обеды' : 'Заказы'} на <span className={styles.dayName}>{humanizeDayName(date, 'DD MMMM')}</span></span>;
  };

  locationWithNewQuery = (name, value, location = this.props.location) => {
    const correctedValue = (name === 'lt_date' || name === 'gt_date') ? correctDate(name, value) : value;
    const newLocation = {...location, query: {...location.query, [name]: JSON.stringify(correctedValue)}};
    delete newLocation.search;
    return newLocation;
  };

  locationChanged = (location) => {
    this.context.router.push(location);
  };

  clearFilter = () => {
    const location = this.props.location;
    return {
      ...location,
      query: omit(location.query, [ 'eq_date', 'lt_date', 'gt_date' ])
    };
  }

  renderIntervalDatePickers = () => {
    const { gt_date: gtDate, lt_date: ltDate } = this.props.location.query;
    return [
      <div className={styles.datePickerContainer} key="gt_date">
        <h3>С: </h3>
          <span className={classNames(styles.filterItem, styles.datePickerWrapper)}>
            <DatePicker label="Выберите дату"
                        onChange={(date) => this.locationChanged(this.locationWithNewQuery('gt_date', date))}
                        value={gtDate ? getParsedDate(gtDate) : undefined}/>
          </span>
      </div>,
      <div className={styles.datePickerContainer} key="lt_date">
        <h3>По: </h3>
          <span className={classNames(styles.filterItem, styles.datePickerWrapper)}>
            <DatePicker label="Выберите дату"
                        onChange={(date) => this.locationChanged(this.locationWithNewQuery('lt_date', date))}
                        value={ltDate ? getParsedDate(ltDate) : undefined}
                        minDate={gtDate && getParsedDate(gtDate)} />
          </span>
      </div>
    ];
  };

  renderSingleDatePicker = () => {
    const { eq_date: eqDate } = this.props.location.query;
    return (
      <div className={styles.datePickerContainer}>
        <h3>Дата заказа: </h3>
        <span className={classNames(styles.filterItem, styles.datePickerWrapper)}>
          <DatePicker label="Выберите дату"
                      onChange={(date) => this.locationChanged(this.locationWithNewQuery('eq_date', date))}
                      value={eqDate ? getParsedDate(eqDate) : undefined}/>
        </span>
      </div>
    );
  };

  render() {
    const { location, title, children, sortByOrderItem, clearSortByOrderItem, sorted } = this.props;
    const { eq_date: eqDate, gt_date: gtDate, lt_date: ltDate, interval: isIntervalChosen } = location.query;
    const isDateChosen = eqDate || gtDate || ltDate;

    return (
      <ColumnLayout>
        <div className={styles.root}>
          <h1>{title}</h1>
          <h4 className={styles.ordersTitle}>{(ltDate || gtDate) ? this.getIntervalSubTitle() : this.getSingleDateSubTitle()}</h4>
          <div className={styles.filters}>
            <Toggle
              checked={!!isIntervalChosen}
              label="Диапазон дат"
              onChange={this.onToggleChange}
            />
            <div className={styles.filter}>
              {isIntervalChosen ? this.renderIntervalDatePickers() : this.renderSingleDatePicker()}
              {isDateChosen && <Button className={styles.filterItem} flat accent label="Сбросить фильтр"
                                       onClick={() => this.locationChanged(this.clearFilter())}/>}
              {sortByOrderItem && !sorted && <Button className={styles.filterItem} flat accent label="Сгрупировать по обедам" onClick={sortByOrderItem}/>}
              {clearSortByOrderItem && sorted && <Button className={styles.filterItem} flat accent label="Показать заказы" onClick={clearSortByOrderItem}/>}
            </div>
          </div>
          {children}
        </div>
      </ColumnLayout>
    );
  }
}
