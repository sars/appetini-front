import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import Lunch from 'components/Lunch/Lunch';
import Boxes from 'components/Boxes/Boxes';
import DeliveryTimeDropdown from 'components/DeliveryTimeDropdown/DeliveryTimeDropdown';
import ColumnLayout from 'components/ColumnLayout/ColumnLayout';
import { asyncConnect } from 'redux-async-connect';
import { loadSuccess } from 'redux-async-connect';
import { connect } from 'react-redux';
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
  }
])
@connect(null, { loadSuccess })
export default class Lunches extends Component {
  static propTypes = {
    lunches: PropTypes.object,
    preferences: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
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

  render() {
    const styles = require('./Lunches.scss');
    const {lunches, preferences} = this.props;
    const {currentPreferences, currentTime} = this.state;
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
        {!nearestLunches.length && currentPreferences &&
          <div><h1 className={styles.title}>{currentPreferencesTitle}</h1></div>
        }
        <div className={styles.firstLine}>
          <h2>Обеды на каждый день</h2>
          <DeliveryTimeDropdown className={styles.timeDropdown} onChange={this.filterChanged('time')} value={currentTime}/>
        </div>
        {boxes && <Boxes boxes={boxes}/>}
      </ColumnLayout>
    );
  }
}
