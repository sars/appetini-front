import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import Lunch from 'components/Lunch/Lunch';
import Boxes from 'components/Boxes/Boxes';
import CheckButtonsGroup from 'components/CheckButtonsGroup/CheckButtonsGroup';
import Autocomplete from 'components/AsyncAutocomplete/AsyncAutocomplete';
import DeliveryTimeDropdown from 'components/DeliveryTimeDropdown/DeliveryTimeDropdown';
import ColumnLayout from 'components/ColumnLayout/ColumnLayout';
import Card, { CardContent } from 'components/Card/Card';
import { asyncConnect } from 'redux-async-connect';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import { loadSuccess } from 'redux-async-connect';
import { connect } from 'react-redux';
import { request as requestLunches, filterNames } from 'helpers/lunches';
import valueFromLocationQuery from 'helpers/valueFromLocationQuery';
import groupBy from 'lodash/groupBy';
import forIn from 'lodash/forIn';
import humanizeDayName from 'components/humanizeDayName/humanizeDayName';
import TimePeriod from 'helpers/TimePeriod';

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
        return data.resources.reduce((result, preference) => ({...result, [preference.id]: preference.name}), {});
      });
    }
  }},
  {key: 'dishes', promise: ({helpers, store}) => {
    if (!racKeyLoaded(store, 'dishes')) {
      const currentDishes = valueFromLocationQuery(store.getState().routing, 'dishes');
      if (currentDishes) {
        return helpers.client.get('/uniq_dishes', {
          params: { q: '*', 'include[]': currentDishes }
        }).then(data => {
          return data.resources.reduce((result, dish) => ({...result, [dish]: dish}), {});
        });
      }
    }
  }}
])
@connect(null, { loadSuccess })
export default class Home extends Component {
  static propTypes = {
    lunches: PropTypes.object,
    preferences: PropTypes.object.isRequired,
    dishes: PropTypes.object,
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

        return isEqual(this.state[name], value) ? result : {...result, [stateName]: value};
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

  requestDishes = debounce(query => {
    this.context.client.get('/uniq_dishes', {params: {
      q: (query || '*'),
      'include[]': this.state.currentDishes
    }}).then(data => {
      const dishes = data.resources.reduce((result, dish) => ({...result, [dish]: dish}), {});
      this.props.loadSuccess('dishes', dishes);
    });
  }, 200);

  render() {
    const styles = require('./Home.scss');
    const autocompleteStyles = require('components/autocomplete/autocomplete.scss');
    const {lunches, preferences, dishes} = this.props;
    const {currentPreferences = [], currentDishes = [], currentTime} = this.state;

    const filters = {
      component: (
        <Card className={styles.filtersCard}>
          <CardContent className={styles.filterContent}>
            <div className={styles.dishesFilter}>
              <h3>Состав обеда</h3>
              <Autocomplete className={autocompleteStyles.autocomplete} name="dishes" direction="down"
                            onUpdateSuggestions={this.requestDishes}
                            onChange={this.filterChanged('dishes')} source={dishes || []} value={currentDishes}
              />
            </div>
            <div className={styles.preferencesWrapper}>
              <h3>Ваши предпочтения</h3>
              <CheckButtonsGroup source={preferences} value={currentPreferences}
                                 onChange={this.filterChanged('preferences')}/>
            </div>
          </CardContent>
        </Card>
      ),
      span: 2
    };

    const boxes = lunches.resources && [
      filters,
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
        <Helmet title="Home"/>
        {nearestLunches &&
        <div className={styles.nearestWrapper}>
          {nearestLunches.map((item, index) => {
            return (<div key={index}>
              <h1>Обеды на {humanizeDayName(item.date, 'DD MMMM')}, время доставки: <TimePeriod date={item.date} period={30}/></h1>
              <Boxes boxes={item.lunches}/>
            </div>);
          })}
        </div>
        }
        <div className={styles.firstLine}>
          <h1>Обеды на каждый день</h1>
          <DeliveryTimeDropdown className={styles.timeDropdown} onChange={this.filterChanged('time')} value={currentTime}/>
        </div>
        {boxes && <Boxes boxes={boxes}/>}
      </ColumnLayout>
    );
  }
}
