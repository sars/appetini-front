import React, { PropTypes, Component } from 'react';
import Autocomplete from 'components/AsyncAutocomplete/AsyncAutocomplete';
import styles from './UsersAutocomplete.scss';
import debounce from 'lodash/debounce';
import keyBy from 'lodash/keyBy';
import mapValues from 'lodash/mapValues';
import isEmpty from 'lodash/isEmpty';

export default class UsersAutocomplete extends Component {
  static propTypes = {
    onSelect: PropTypes.func,
    value: PropTypes.object
  };

  static contextTypes = {
    client: PropTypes.object.isRequired
  };

  state = {
    users: {}
  };

  requestUsers = debounce(query => {
    this.context.client.get('/users', {params: {search: query }}).then(data => {
      const users = keyBy(data.resources, 'id');
      this.setState({users});
    });
  }, 200);

  handleChange = (value) => {
    const selectedUser = this.state.users[value];
    this.props.onSelect(selectedUser);
  };

  render() {
    const { users } = this.state;
    const { value } = this.props;

    const userNames = isEmpty(users) && !isEmpty(value) ? {[value.id]: value.name} : mapValues(users, 'name');
    const autocompleteStyles = require('components/autocomplete/autocomplete.scss');

    return (
      <div className={styles.userslist}>
        <Autocomplete {...this.props} className={autocompleteStyles.autocomplete} multiple={false}
                      onUpdateSuggestions={this.requestUsers} value={value.name}
                      source={userNames} onChange={this.handleChange}/>
      </div>
    );
  }
}
