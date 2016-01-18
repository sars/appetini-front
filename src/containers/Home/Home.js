import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import Lunches from 'components/Lunches/Lunches';
import Dropdown from 'react-toolbox/lib/dropdown';
import { asyncConnect } from 'helpers/asyncConnect';

const sortingOptions = [
  { value: 'EN-gb', label: 'Дате' },
  { value: 'ES-es', label: 'Цене'},
  { value: 'TH-th', label: 'Кулинару' }
];

@asyncConnect({
  lunches: (params, helpers) => helpers.client.get('/lunches')
})
export default class Home extends Component {
  static propTypes = {
    lunches: PropTypes.object
  };

  state = {
    sorting: 'ES-es'
  };

  handleChangeSorting = (value) => {
    this.setState({sorting: value});
  };

  render() {
    const styles = require('./Home.scss');
    const lunches = this.props.lunches;
    return (
      <div className={styles.home}>
        <Helmet title="Home"/>
        <div className={styles.firstLine}>
          <h1>Обеды на каждый день</h1>
          <span>Сортировать по</span>
          <Dropdown className={styles.sortingDropdown} auto onChange={this.handleChangeSorting}
                    source={sortingOptions} value={this.state.sorting} />
        </div>
        {lunches.loaded && <Lunches lunches={lunches} />}
      </div>
    );
  }
}
