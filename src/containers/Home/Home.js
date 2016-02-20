import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import Lunches from 'components/Lunches/Lunches';
import CheckButtonsGroup from 'components/CheckButtonsGroup/CheckButtonsGroup';
import Dropdown from 'components/Dropdown/Dropdown';
import Autocomplete from 'components/AsyncAutocomplete/AsyncAutocomplete';
import Card, { CardContent } from 'components/Card/Card';
import { asyncConnect } from 'redux-async-connect';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import { loadSuccess } from 'redux-async-connect';
import { connect } from 'react-redux';

const deliveryTimeOptions = [
  { value: '12:30', label: '12:30 - 13:00' },
  { value: '13:30', label: '13:30 - 14:00' }
];

const filterNames = ['preferences', 'dishes', 'dates', 'time'];

function valueFromLocationQuery(props, name) {
  const value = props.location.query && props.location.query[name];
  return value && JSON.parse(value);
}

function currentStateName(name) {
  return 'current' + name.charAt(0).toUpperCase() + name.slice(1);
}

function racKeyLoaded(store, key) {
  return Boolean(store.getState().reduxAsyncConnect[key]);
}

@asyncConnect([
  {key: 'lunches', promise: ({helpers, store}) => {
    const filters = filterNames.reduce((result, name) => (
      {...result, [name]: valueFromLocationQuery(store.getState().routing, name)}
    ), {});

    const time = (filters.time || deliveryTimeOptions[0].value).split(':');
    const dates = (filters.dates || []).map(date => moment(date).set({hours: time[0], minutes: time[1]}).format());

    return helpers.client.get('/lunches', {params: {
      'food_preferences_ids[]': filters.preferences,
      'dishes[]': filters.dishes,
      'ready_by[]': dates
    }});
  }},
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
    if (value.length === 0) {
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

    return (
      <div className={styles.root}>
        <div className={styles.filters}>
          <Card className={styles.card}>
            <CardContent className={styles.cardContent}>
              <div className={styles.dishesWrapper}>
                <h3>Состав обеда</h3>
                <Autocomplete className={autocompleteStyles.autocomplete} name="dishes" direction="down"
                              onUpdateSuggestions={this.requestDishes}
                              onChange={this.filterChanged('dishes')} source={dishes || []} value={currentDishes}
                />
              </div>
              <div className={styles.preferencesWrapper}>
                <h3>Ваши предпочтения</h3>
                <CheckButtonsGroup source={preferences} value={currentPreferences}
                                   onChange={this.filterChanged('preferences')} />
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Helmet title="Home"/>
          <div className={styles.firstLine}>
            <h1>Обеды на каждый день</h1>
            <Dropdown className={styles.timeDropdown} auto onChange={this.filterChanged('time')}
                      source={deliveryTimeOptions} value={currentTime} size="15" />
          </div>
          {lunches && <Lunches className={styles.lunches} lunches={lunches} />}
        </div>
      </div>
    );
  }
}
