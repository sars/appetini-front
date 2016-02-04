import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import Lunches from 'components/Lunches/Lunches';
import CheckButtonsGroup from 'components/CheckButtonsGroup/CheckButtonsGroup';
import FilterCalendar from 'components/FilterCalendar/FilterCalendar';
import Dropdown from 'react-toolbox/lib/dropdown';
import Autocomplete from 'react-toolbox/lib/autocomplete';
import Card, { CardText } from 'react-toolbox/lib/card';
import { asyncConnect } from 'redux-async-connect';
import moment from 'moment';
import isEqual from 'lodash/isEqual';

const sortingOptions = [
  { value: 'EN-gb', label: 'Дате' },
  { value: 'ES-es', label: 'Цене'},
  { value: 'TH-th', label: 'Кулинару' }
];

const deliveryTimeOptions = [
  { value: '12:30', label: '12:30 - 13:00' },
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

@asyncConnect({
  lunches: (params, helpers) => {
    const filters = filterNames.reduce((result, name) => (
      {...result, [name]: valueFromLocationQuery(helpers.store.getState().routing, name)}
    ), {});

    const time = (filters.time || deliveryTimeOptions[0].value).split(':');
    const sort = (filters.sort || sortingOptions[0].value);
    const dates = (filters.dates || []).map(date => moment([...date.split('-'), ...time]).format());

    return helpers.client.get('/lunches', {params: {
      'food_preferences_ids[]': filters.preferences,
      'dishes[]': filters.dishes,
      'dates[]': dates,
      'sort': sort
    }});
  },
  preferences: (params, helpers) => helpers.client.get('/food_preferences').then(data => {
    return data.resources.reduce((result, preference) => ({...result, [preference.id]: preference.name}), {});
  }),
  dishes: (params, helpers) => helpers.client.get('/uniq_dishes?q=*').then(data => {
    return data.resources.reduce((result, dish) => ({...result, [dish]: dish}), {});
  }),
  availability: (params, helpers) => helpers.client.get('/lunches_availability').then(data => data.resources)
})
export default class Home extends Component {
  static propTypes = {
    lunches: PropTypes.object.isRequired,
    preferences: PropTypes.object.isRequired,
    availability: PropTypes.object.isRequired,
    dishes: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
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

  render() {
    const styles = require('./Home.scss');
    const {lunches, preferences, dishes, availability} = this.props;
    const {currentPreferences = [], currentDishes = [], currentDates = [], currentTime, currentSort} = this.state;

    return (
      <div className={styles.home}>
        <Helmet title="Home"/>
        <div className={styles.leftSidebar}>
          <Card>
            <CardText>
              <h3>Дата доставки</h3>
              <FilterCalendar onChange={this.filterChanged('dates')} availability={availability.data} dates={currentDates}/>
              <h3>Время доставки</h3>
              <Dropdown className={styles.deliveryTimeDropdown} auto onChange={this.filterChanged('time')}
                        source={deliveryTimeOptions} value={currentTime} />
              <h3>Ваши предпочтения</h3>
              <CheckButtonsGroup source={preferences.data} value={currentPreferences}
                                 onChange={this.filterChanged('preferences')} />
              <h3>Состав обеда</h3>
              <Autocomplete label="Название блюда" name="dishes" onChange={this.filterChanged('dishes')}
                            source={dishes.data} value={currentDishes}
              />
            </CardText>
          </Card>
        </div>
        <div className={styles.center}>
          <div className={styles.firstLine}>
            <h1>Обеды на каждый день</h1>
            <span>Сортировать по</span>
            <Dropdown className={styles.sortingDropdown} auto onChange={this.filterChanged('sort')}
                      source={sortingOptions} value={currentSort} />
          </div>
          {lunches.loaded && <Lunches lunches={lunches} />}
        </div>
      </div>
    );
  }
}
