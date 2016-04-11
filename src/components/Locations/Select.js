import React, { Component, PropTypes } from 'react';
import AddressSuggest from 'components/AddressSuggest/AddressSuggest';
import Dropdown from 'components/Dropdown/Dropdown';
import styles from './Select.scss';
import find from 'lodash/find';
import forEach from 'lodash/forEach';

export default class LocationsSelect extends Component {
  static propTypes = {
    location: PropTypes.object,
    locations: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {value: 'none', list: this.convertDropdownList(props.locations)};
  }

  componentWillReceiveProps(nextProps) {
    this.setState({list: this.convertDropdownList(nextProps.locations)});
  }

  onChoose = (value) => {
    const selected = find(this.state.list, {value: value});

    this.setState({search: value === 'new', selected: value});
    this.props.onSelect((selected && selected.location) ? selected.location : null);
  };

  convertDropdownList = (locations) => {
    const list = [{value: 'none', label: 'Выберите адрес'}];

    forEach(locations, (location) => {
      list.push({value: location.place_id, label: location.full_address, location});
    });

    list.push({value: 'new', label: 'Другой адрес'});

    return list;
  };

  render() {
    return (
      <div>
        <Dropdown auto source={this.state.list} size="15" value={this.state.selected} onChange={this.onChoose} />

        {this.state.search &&
        <div className={styles.search}>
          <AddressSuggest onSuggestSelect={::this.props.onSelect} location={this.props.location} />
        </div>}
      </div>
    );
  }
}
