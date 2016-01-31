import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import Lunches from 'components/Lunches/Lunches';
import CheckButton from 'components/CheckButton/CheckButton';
import Dropdown from 'react-toolbox/lib/dropdown';
import Autocomplete from 'react-toolbox/lib/autocomplete';
import { asyncConnect } from 'redux-async-connect';

const sortingOptions = [
  { value: 'EN-gb', label: 'Дате' },
  { value: 'ES-es', label: 'Цене'},
  { value: 'TH-th', label: 'Кулинару' }
];

const deliveryTimeOptions = [
  { value: '12:30', label: '12:30 - 13:00' },
  { value: '13:00', label: '13:00 - 13:30' }
];

@asyncConnect({
  lunches: (params, helpers) => helpers.client.get('/lunches'),
  preferences: (params, helpers) => helpers.client.get('/food_preferences').then(result => {
    return result.resources.map(preference => ({value: preference.id, label: preference.name}));
  }),
  dishes: (params, helpers) => helpers.client.get('/uniq_dishes?q=*').then(data => {
    return data.resources.reduce((result, dish) => ({...result, [dish]: dish}), {});
  })
})
export default class Home extends Component {
  static propTypes = {
    lunches: PropTypes.object.isRequired,
    preferences: PropTypes.object.isRequired,
    dishes: PropTypes.object.isRequired
  };

  state = {
    sorting: sortingOptions[0].value,
    deliveryTime: deliveryTimeOptions[0].value,
    composition: ['1', '3']
  };

  handleChangeSorting = (value) => {
    this.setState({sorting: value});
  };

  handleChangeDeliveryTime = (value) => {
    this.setState({deliveryTime: value});
  };

  handleChangePreference = (preference) => {
    return (checked) => {
      console.log(preference.label, checked);
    };
  };

  handleChangeComposition = (value) => {
    this.setState({composition: value});
    console.log(value);
  };

  render() {
    const styles = require('./Home.scss');
    const {lunches, preferences, dishes} = this.props;
    return (
      <div className={styles.home}>
        <Helmet title="Home"/>
        <div className={styles.leftSidebar}>
          <h3>Время доставки</h3>
          <Dropdown className={styles.deliveryTimeDropdown} auto onChange={this.handleChangeDeliveryTime}
                    source={deliveryTimeOptions} value={this.state.deliveryTime} />
          <h3>Ваши предпочтения</h3>
          {preferences.data.map((preference, index) => {
            return <CheckButton key={index} label={preference.label} onChange={this.handleChangePreference(preference)} />;
          })}
          <h3>Состав обеда</h3>
          <Autocomplete label="Название блюда" name="composition"
            onChange={this.handleChangeComposition}
            source={dishes.data} value={this.state.composition}
          />
        </div>
        <div className={styles.center}>
          <div className={styles.firstLine}>
            <h1>Обеды на каждый день</h1>
            <span>Сортировать по</span>
            <Dropdown className={styles.sortingDropdown} auto onChange={this.handleChangeSorting}
                      source={sortingOptions} value={this.state.sorting} />
          </div>
          {lunches.loaded && <Lunches lunches={lunches} />}
        </div>
      </div>
    );
  }
}
