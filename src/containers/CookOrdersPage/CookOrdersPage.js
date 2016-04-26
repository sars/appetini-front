import React, { Component, PropTypes } from 'react';
import ColumnLayout from 'components/ColumnLayout/ColumnLayout';
import DatePicker from 'components/DatePicker/DatePicker';
import humanizeDayName from 'components/humanizeDayName/humanizeDayName';
import OrderPreview from 'components/OrderPreview/OrderPreview';
import moment from 'moment';
import Button from 'components/Button/Button';
import { asyncConnect } from 'redux-async-connect';
import classNames from 'classnames';
import styles from './styles.scss';

const getParsedDate = (date) => {
  return new Date(JSON.parse(date));
};

const getParams = (location) => {
  if (location.query.date) {
    return {eq_date: location.query.date};
  }
  return {gt_date: moment().utc().format()};
};

@asyncConnect([
  {key: 'orders', promise: ({helpers, params, location}) => helpers.client.get(`/cooks/${params.cookId}/orders`,
      {params: getParams(location)})
      .then(response => response.resources)}
])

export default class CookOrdersPage extends Component {

  static propTypes = {
    orders: PropTypes.array,
    location: PropTypes.object
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
    const { orders, location } = this.props;
    const date = location.query.date;
    return (
        <ColumnLayout>
          <div className={styles.root}>
            <h1>Страница кулинара</h1>
            <div className={styles.filters}>
              <div className={styles.filter}>
                <h3>Дата заказа: </h3>
                <span className={classNames(styles.filterItem, styles.datePickerWrapper)}><DatePicker label="Выберите дату" onChange={this.filterChanged} value={date ? getParsedDate(date) : undefined}/></span>
                {date && <Button className={styles.filterItem} flat accent label="Сбросить фильтр" onClick={this.clearFilter}/>}
              </div>
            </div>
            <div className={styles.orders}>
              <h4 className={styles.ordersTitle}>{date ? <span>Заказанные обеды на <span className={styles.dayName}>{humanizeDayName(getParsedDate(date), 'DD MMMM')}</span></span> : <span>Все заказанные обеды</span>}: </h4>
              <OrderPreview orders={orders}/>
            </div>
          </div>
        </ColumnLayout>
    );
  }
}
