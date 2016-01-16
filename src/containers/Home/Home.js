import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { load } from 'redux/modules/lunches';
import Lunches from 'components/Lunches/Lunches';
import { connect } from 'react-redux';
import Dropdown from 'react-toolbox/lib/dropdown';

const sortingOptions = [
  { value: 'EN-gb', label: 'Дате' },
  { value: 'ES-es', label: 'Цене'},
  { value: 'TH-th', label: 'Кулинару' }
];

@connect(state => ({lunches: state.lunches}))
export default class Home extends Component {
  static propTypes = {
    lunches: PropTypes.object
  };

  state = {
    sorting: 'ES-es'
  };

  static loadProps(params) {
    return params.store.dispatch(load());
  }

  handleChangeSorting = (value) => {
    this.setState({sorting: value});
  };

  render() {
    const styles = require('./Home.scss');
    return (
      <div className={styles.home}>
        <Helmet title="Home"/>
        <div className={styles.firstLine}>
          <h1>Обеды на каждый день</h1>
          <span>Сортировать по</span>
          <Dropdown className={styles.sortingDropdown} auto onChange={this.handleChangeSorting}
                    source={sortingOptions} value={this.state.sorting} />
        </div>
        <Lunches lunches={this.props.lunches} />
      </div>
    );
  }
}
