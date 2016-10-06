import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import ColumnLayout from 'components/ColumnLayout/ColumnLayout';
import { asyncConnect } from 'redux-async-connect';
import { loadSuccess } from 'redux-async-connect';
import { connect } from 'react-redux';
import Button from 'components/Button/Button';
import LunchesPage from 'components/LunchesPage/LunchesPage';
import Dropdown from 'components/Dropdown/Dropdown';
import CooksDropdown from 'components/CooksDropdown/CooksDropdown';
import { request as requestLunches, filterNames } from 'helpers/lunches';
import valueFromLocationQuery from 'helpers/valueFromLocationQuery';
import { updateMeta } from 'redux/modules/meta';
import find from 'lodash/find';
import concat from 'lodash/concat';
import isEqual from 'lodash/isEqual';
import { prepareMetaForReducer, lunchesMeta } from 'helpers/getMeta';

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
      return helpers.client.get('/food_preferences').then(data => data.resources);
    }}
  },
  {key: 'cooks', promise: ({helpers}) => {
    return helpers.client.get('/cooks');
  }},
  {key: 'teamOffers', promise: ({helpers, store}) => {
    const state = store.getState();
    const cookId = valueFromLocationQuery(state.routing, 'cook_id');
    if (cookId) {
      return helpers.client.get('/team_offers', {params: {cook_id: cookId, disable_by_gt: new Date}});
    }
    return Promise.resolve(null);
  }}
])
@connect(state => ({metas: state.reduxAsyncConnect.metas}), { loadSuccess, updateMeta })
export default class Lunches extends Component {
  static propTypes = {
    lunches: PropTypes.object,
    teamOffers: PropTypes.object,
    preferences: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
    cooks: PropTypes.object.isRequired,
    loadSuccess: PropTypes.func.isRequired,
    metas: PropTypes.array.isRequired,
    updateMeta: PropTypes.func.isRequired
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

  componentDidMount() {
    const meta = lunchesMeta(this.props) || prepareMetaForReducer(this.props.metas, 'resource', 'lunches', true);
    this.props.updateMeta({...meta, url: window.location.href});
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location !== nextProps.location) {
      const meta = lunchesMeta(nextProps) || prepareMetaForReducer(this.props.metas, 'resource', 'lunches', true);
      this.props.updateMeta(meta);
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
      'per_page': 20,
      'food_preferences_ids[]': currentPreferences,
      'disable_by_gt': new Date,
      'cook_id': currentCook_id,
      'page': page
    };
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

  sortItems = (items) => {
    return items.sort((item, anotherItem) => {
      return new Date(item.ready_by) - new Date(anotherItem.ready_by);
    });
  }

  render() {
    const styles = require('./Lunches.scss');
    const {lunches, preferences, cooks, teamOffers} = this.props;
    const {currentPreferences, isInfiniteLoading} = this.state;
    const filters = Boolean(currentPreferences || this.state.currentCook_id);
    const allLunches = lunches.resources.map(lunch => {
      return {...lunch, component: 'Lunch'};
    });
    const allTeamOffers = teamOffers ? teamOffers.resources.map(offer => { return {...offer, component: 'TeamOffer'};}) : [];
    const allLunchesAndOffers = this.sortItems(concat(allTeamOffers, allLunches));
    const allLunchesLoaded = allLunches.length >= lunches.meta.total;
    const currentPreferencesTitle = currentPreferences ? find(preferences, {id: parseInt(currentPreferences, 10)}).title : null;

    const preparedPreferences = [{label: 'Категория'}, ...preferences.map(preference => {
      return {value: preference.id, label: preference.name};
    })];

    return (
      <ColumnLayout className={styles.root}>
        <Helmet title="Обеды"/>
        <div className={styles.firstLine}>
          <h1>{currentPreferences ? currentPreferencesTitle : 'Обеды на каждый день'}</h1>
          <CooksDropdown className={styles.filter} onChange={this.filterChanged('cook_id')} value={parseInt(this.state.currentCook_id, 10)} cooks={cooks.resources}/>
          <Dropdown className={styles.filter} onChange={this.filterChanged('preferences')} value={parseInt(this.state.currentPreferences, 10)} source={preparedPreferences}/>
          {filters && <Button className={styles.filter} flat outlined onClick={() => {this.context.router.push('lunches');}} label="Сбросить"/>}
        </div>
        {allLunchesAndOffers.length ? <LunchesPage items={allLunchesAndOffers}/> : <h3 className={styles.title}>Нет обедов</h3>}
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
