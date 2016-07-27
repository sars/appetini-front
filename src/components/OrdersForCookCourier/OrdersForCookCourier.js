import React, { Component, PropTypes } from 'react';
import ColumnLayout from 'components/ColumnLayout/ColumnLayout';
import DatePicker from 'components/DatePicker/DatePicker';
import humanizeDayName from 'components/humanizeDayName/humanizeDayName';
import classNames from 'classnames';
import Button from 'components/Button/Button';
import styles from './styles.scss';
import {getParsedDate} from 'helpers/ordersDateHelper';

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

  locationWithNewQuery = (name, value) => {
    const location = this.props.location;
    const newLocation = {...location, query: {...location.query, [name]: JSON.stringify(value)}};
    delete newLocation.search;
    return newLocation;
  };

  filterChanged = (newValue) => {
    const newLocation = this.locationWithNewQuery('date', newValue);
    this.context.router.push(newLocation);
  };

  clearFilter = () => {
    const location = this.props.location;
    const newLocation = {...location, query: {}};
    this.context.router.push(newLocation);
  }

  render() {
    const { location, title, children, sortByOrderItem, clearSortByOrderItem, sorted } = this.props;
    const date = location.query.date;
    return (
      <ColumnLayout>
        <div className={styles.root}>
          <h1>{title}</h1>
          <h4 className={styles.ordersTitle}>{date ? <span>{sorted ? 'Обеды' : 'Заказы'} на <span className={styles.dayName}>{humanizeDayName(getParsedDate(date), 'DD MMMM')}</span></span> : <span>Все {sorted ? 'обеды' : 'заказы'}</span>}</h4>
          <div className={styles.filters}>
            <div className={styles.filter}>
              <h3>Дата заказа: </h3>
              <span className={classNames(styles.filterItem, styles.datePickerWrapper)}>
                <DatePicker label="Выберите дату" onChange={this.filterChanged} value={date ? getParsedDate(date) : undefined}/>
              </span>
              {date && <Button className={styles.filterItem} flat accent label="Сбросить фильтр" onClick={this.clearFilter}/>}
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
