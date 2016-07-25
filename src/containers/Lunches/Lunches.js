import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import Lunch from 'components/Lunch/Lunch';
import Boxes from 'components/Boxes/Boxes';
import ColumnLayout from 'components/ColumnLayout/ColumnLayout';
import { asyncConnect } from 'redux-async-connect';
import { loadSuccess } from 'redux-async-connect';
import { connect } from 'react-redux';
import Button from 'components/Button/Button';
import Dropdown from 'components/Dropdown/Dropdown';
import CooksDropdown from 'components/CooksDropdown/CooksDropdown';
import { request as requestLunches, filterNames } from 'helpers/lunches';
import valueFromLocationQuery from 'helpers/valueFromLocationQuery';
import groupBy from 'lodash/groupBy';
import forIn from 'lodash/forIn';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import humanizeDayName from 'components/humanizeDayName/humanizeDayName';
import TimePeriod from 'helpers/TimePeriod';

const humanizeLunchTypeName = (date) => {
  if (new Date(date).getHours() < 17) {
    return 'Обеды';
  }
  return 'Ужины';
};

function currentStateName(name) {
  return 'current' + name.charAt(0).toUpperCase() + name.slice(1);
}

function racKeyLoaded(store, key) {
  return Boolean(store.getState().reduxAsyncConnect[key]);
}

@asyncConnect([
  {key: 'lunches', promise: requestLunches({nearest: true})},
  {key: 'preferences', promise: ({helpers, store}) => {
    if (!racKeyLoaded(store, 'preferences')) {
      return helpers.client.get('/food_preferences').then(data => {
        return data.resources;
      });
    }}
  },
  {key: 'cooks', promise: ({helpers}) => {
    return helpers.client.get('/cooks')
      .then(response => response);}
  }
])
@connect(null, { loadSuccess })
export default class Lunches extends Component {
  static propTypes = {
    lunches: PropTypes.object,
    preferences: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
    cooks: PropTypes.object.isRequired,
    loadSuccess: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {};
    filterNames.forEach(name => {
      this.state[currentStateName(name)] = valueFromLocationQuery(props, name);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location !== nextProps.location) {
      const newState = filterNames.reduce((result, name) => {
        const stateName = currentStateName(name);
        const value = valueFromLocationQuery(nextProps, name);
        return isEqual(this.state[stateName], value) ? result : {...result, [stateName]: value};
      }, null);
      if (newState) {
        this.setState(newState);
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps !== this.props || this.state !== nextState;
  }

  filterChanged = name => newValue => {
    const stateName = currentStateName(name);
    this.setState({[stateName]: newValue});
    const newLocation = this.locationWithNewQuery(name, newValue);
    this.context.router.push(newLocation);
  };

  locationWithNewQuery = (name, value) => {
    const location = this.props.location;

    const newLocation = {...location, query: {...location.query, [name]: JSON.stringify(value)}};
    delete newLocation.search;
    if (Array.isArray(value) && value.length === 0) {
      delete newLocation.query[name];
    }
    return newLocation;
  };

  loadMoreHandle = () => {
    const { currentTime, currentPreferences, currentCook_id } = this.state;
    const { lunches } = this.props;
    const page = (this.state.page || 1) + 1;
    const params = {
      'ready_by_time': currentTime,
      'per_page': 10,
      'food_preferences_ids[]': currentPreferences,
      'disable_by_gt': new Date,
      'cook_id': currentCook_id,
      'page': page
    };
    if (lunches.nearest.length) {
      params.include_nearest = true;
    }
    this.setState({
      isInfiniteLoading: true
    });
    this.context.client.get('/lunches', {params})
      .then(lunchesFromServer => {
        const newLunches = {...lunches, resources: [...lunches.resources, ...lunchesFromServer.resources]};
        this.props.loadSuccess('lunches', newLunches);
        this.setState({
          page: page,
          isInfiniteLoading: false
        });
      });
  };

  render() {
    const styles = require('./Lunches.scss');
    const {lunches, preferences, cooks} = this.props;
    const {currentPreferences, isInfiniteLoading} = this.state;
    const filters = Boolean(currentPreferences || this.state.currentCook_id);
    const allLunchesLoaded = lunches.resources.length >= lunches.meta.total;
    const currentPreferencesTitle = currentPreferences ? find(preferences, {id: parseInt(currentPreferences, 10)}).title : null;
    const boxes = lunches.resources && [
      ...lunches.resources.map(lunch => ({
        component: <Lunch lunch={lunch}/>
      }))
    ];

    const nearestLunches = [];
    forIn(lunches.nearest && groupBy(lunches.nearest, 'ready_by'), (value, key) => {
      nearestLunches.push({
        lunches: value.map(lunch => ({component: <Lunch lunch={lunch} near={true}/>})),
        date: key
      });
    });

    const preparedPreferences = [{label: 'Категория'}, ...preferences.map(preference => {
      return {value: preference.id, label: preference.name};
    })];

    return (
      <ColumnLayout className={styles.root}>
        <Helmet title="Обеды"/>
        {nearestLunches &&
        <div className={styles.nearestWrapper}>
          {nearestLunches.map((item, index) => {
            return (<div key={index}>
              <h1>{humanizeLunchTypeName(item.date)} на {humanizeDayName(item.date, 'DD MMMM')}, время доставки: <TimePeriod date={item.date} period={30}/></h1>
              <Boxes boxes={item.lunches}/>
            </div>);
          })}
        </div>
        }

        <div className={styles.firstLine}>
          <h2>{!nearestLunches.length && currentPreferences ? currentPreferencesTitle : 'Обеды на каждый день'}</h2>
          <CooksDropdown className={styles.filter} onChange={this.filterChanged('cook_id')} value={parseInt(this.state.currentCook_id, 10)} cooks={cooks.resources}/>
          <Dropdown className={styles.filter} onChange={this.filterChanged('preferences')} value={parseInt(this.state.currentPreferences, 10)} source={preparedPreferences}/>
          {filters && <Button className={styles.filter} flat outlined onClick={() => {this.context.router.push('lunches');}} label="Сбросить"/>}
        </div>
        {boxes && <Boxes boxes={boxes}/>}
        {!allLunchesLoaded &&
        <div className={styles.loadMoreWrapper}>
          <Button flat accent onClick={::this.loadMoreHandle} disabled={isInfiniteLoading}
                  label={isInfiniteLoading ? 'Загрузка...' : 'Посмотреть еще'}/>
        </div>
        }
      </ColumnLayout>
    );
  }
}
