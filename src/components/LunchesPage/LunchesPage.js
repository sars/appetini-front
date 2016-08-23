import React, { Component, PropTypes } from 'react';
import Boxes from 'components/Boxes/Boxes';
import Lunch from 'components/Lunch/Lunch';
import TeamOffer from 'components/TeamOffer/TeamOffer';
import without from 'lodash/without';
import filter from 'lodash/filter';
import humanizeDayName from 'components/humanizeDayName/humanizeDayName';
import TimePeriod from 'helpers/TimePeriod';
import styles from './styles.scss';

const humanizeLunchTypeName = (date) => {
  if (new Date(date).getHours() < 17) {
    return 'Обеды';
  }
  return 'Ужины';
};


const types = {
  Lunch,
  TeamOffer
};

export default class LunchesPage extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired
  }

  itemElem = (item, index, params = {}) => {
    return {
      component: React.createElement(types[item.component], {
        item: item,
        ...params,
        key: index
      })
    };
  }

  render() {
    const { items } = this.props;
    const nearDate = items[0].ready_by;
    const near = filter(items, item => item.ready_by === nearDate);
    const preparedItems = {
      near: near.map((item, index) => this.itemElem(item, index, {near: true})),
      other: without(items, ...near).map((item, index) => this.itemElem(item, index))
    };
    return (
      <div>
        {preparedItems.near.length > 0 &&
        <div className={styles.nearestWrapper}>
          <div>
            <h2>{humanizeLunchTypeName(nearDate)} на {humanizeDayName(nearDate, 'DD MMMM')}, время доставки:
              <TimePeriod date={nearDate} period={30}/></h2>
            <Boxes boxes={preparedItems.near}/>
          </div>
        </div>
        }
        {preparedItems.other.length > 0 &&
        <div>
          <h2>Обеды на другое время</h2>
          <Boxes boxes={preparedItems.other}/>
        </div>}
      </div>
    );
  }
}
