import React, { PropTypes, Component } from 'react';
import Autocomplete from 'components/AsyncAutocomplete/AsyncAutocomplete';
import styles from './UsersAutocomplete.scss';
import debounce from 'lodash/debounce';
import keyBy from 'lodash/keyBy';
import mapValues from 'lodash/mapValues';
import isEmpty from 'lodash/isEmpty';

export default class UsersAutocomplete extends Component {
  static propTypes = {
    onUserSelect: PropTypes.func,
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
    this.props.onUserSelect(selectedUser);
  };

  renderUser = (user) => {
    return (
      <span>
        <p>{user.name}</p>
        <p className={styles.userEmail}>{user.email}</p>
      </span>
    );
  }

  render() {
    const { users } = this.state;
    const { value } = this.props;

    const usersData = isEmpty(users) && !isEmpty(value) ? {[value.id]: this.renderUser(value)} : mapValues(users, user => this.renderUser(user));
    const autocompleteStyles = require('components/autocomplete/autocomplete.scss');

    return (
      <div className={styles.userslist}>
        <Autocomplete {...this.props} className={autocompleteStyles.autocomplete} multiple={false}
                      onUpdateSuggestions={this.requestUsers} value={value.name}
                      source={usersData} onChange={this.handleChange}/>
      </div>
    );
  }
}
