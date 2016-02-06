import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import Lunches from 'components/Lunches/Lunches';
import CheckButtonsGroup from 'components/CheckButtonsGroup/CheckButtonsGroup';
import FilterCalendar from 'components/FilterCalendar/FilterCalendar';
import Dropdown from 'react-toolbox/lib/dropdown';
import Autocomplete from 'components/AsyncAutocomplete/AsyncAutocomplete';
import Card, { CardContent } from 'components/Card/Card';
import Layout2Col from 'components/Layout2Col/Layout2Col';
import { asyncConnect } from 'redux-async-connect';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import { loadSuccess } from 'redux-async-connect';
import { connect } from 'react-redux';

const sortingOptions = [
  { value: 'EN-gb', label: 'Дате' },
  { value: 'ES-es', label: 'Цене'},
  { value: 'TH-th', label: 'Кулинару' }
];

const deliveryTimeOptions = [
  { value: '12:00', label: '12:00 - 13:00' },
  { value: '13:00', label: '13:00 - 13:30' }
];

const filterNames = ['preferences', 'dishes', 'dates', 'time', 'sort'];

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

@asyncConnect({
  lunches: (params, helpers) => {
    const filters = filterNames.reduce((result, name) => (
      {...result, [name]: valueFromLocationQuery(helpers.store.getState().routing, name)}
    ), {});

    const time = (filters.time || deliveryTimeOptions[0].value).split(':');
    const sort = (filters.sort || sortingOptions[0].value);
    const dates = (filters.dates || []).map(date => moment(date).set({hours: time[0], minutes: time[1]}).format());

    return helpers.client.get('/lunches', {params: {
      'food_preferences_ids[]': filters.preferences,
      'dishes[]': filters.dishes,
      'ready_by[]': dates,
      'sort': sort
    }});
  },
  preferences: (params, helpers) => {
    if (!racKeyLoaded(helpers.store, 'preferences')) {
      return helpers.client.get('/food_preferences').then(data => {
        return data.resources.reduce((result, preference) => ({...result, [preference.id]: preference.name}), {});
      });
    }
  },
  dishes: (params, helpers) => {
    if (!racKeyLoaded(helpers.store, 'dishes')) {
      const currentDishes = valueFromLocationQuery(helpers.store.getState().routing, 'dishes');
      if (currentDishes) {
        return helpers.client.get('/uniq_dishes', {
          params: { q: '*', 'include[]': currentDishes }
        }).then(data => {
          return data.resources.reduce((result, dish) => ({...result, [dish]: dish}), {});
        });
      }
    }
  },
  availability: (params, helpers) => {
    if (!racKeyLoaded(helpers.store, 'availability')) {
      return helpers.client.get('/lunches_availability').then(data => data.resources);
    }
  }
})
@connect(null, { loadSuccess })
export default class Home extends Component {
  static propTypes = {
    lunches: PropTypes.object.isRequired,
    preferences: PropTypes.object.isRequired,
    availability: PropTypes.object.isRequired,
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

  requestDishes = debounce((query) => {
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
    const dropdownStyles = require('components/dropdown/dropdown.scss');
    const autocompleteStyles = require('components/autocomplete/autocomplete.scss');
    const {lunches, preferences, dishes, availability} = this.props;
    const {currentPreferences = [], currentDishes = [], currentDates = [], currentTime, currentSort} = this.state;

    const leftSidebar = (
      <Card className={styles.card}>
        <CardContent>
          <h3>Дата доставки</h3>
          <FilterCalendar onChange={this.filterChanged('dates')} availability={availability.data} dates={currentDates}/>
          <h3>Время доставки</h3>
          <Dropdown className={dropdownStyles.dropdown} auto onChange={this.filterChanged('time')}
                    source={deliveryTimeOptions} value={currentTime} />
          <h3>Ваши предпочтения</h3>
          <CheckButtonsGroup source={preferences.data} value={currentPreferences}
                             onChange={this.filterChanged('preferences')} />
          <h3>Состав обеда</h3>
          <Autocomplete className={autocompleteStyles.autocomplete} name="dishes" direction="down"
                        onUpdateSuggestions={this.requestDishes}
                        onChange={this.filterChanged('dishes')} source={dishes ? dishes.data : []} value={currentDishes}
          />
        </CardContent>
      </Card>
    );

    return (
      <Layout2Col leftSidebar={leftSidebar}>
        <div className={styles.firstLine}>
          <Helmet title="Home"/>
          <h1>Обеды на каждый день</h1>
          <span className={styles.sortLabel}>Сортировать по</span>
          <Dropdown className={dropdownStyles.dropdown} auto onChange={this.filterChanged('sort')}
                    source={sortingOptions} value={currentSort} />
        </div>
        {lunches.loaded && <Lunches lunches={lunches} />}
      </Layout2Col>
    );
  }
}
