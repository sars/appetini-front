import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { routeActions } from 'react-router-redux';
import { LoginForm } from 'components';

@connect(state => ({user: state.auth.user}), {pushState: routeActions.push})
export default class AuthorizedApp extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    user: PropTypes.object,
    pushState: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {showChildren: this.authCondition(props.user)};
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.user !== nextProps.user) {
      // to reload asyncConnect data and block transition until data is loaded, we need to reload route
      this.props.pushState(nextProps.location.pathname);
    }

    if (this.props.location !== nextProps.location) {
      // We should update showChildren only after redirect is completed
      this.setState({showChildren: this.authCondition(nextProps.user)});
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.showChildren !== nextState.showChildren || this.props.children !== nextProps.children;
  }

  authCondition(...args) {
    return (this.props.route.authCondition || Boolean)(...args);
  }

  render() {
    const { showChildren } = this.state;
    const styles = require('./AuthorizedApp.scss');

    return (
      showChildren ? this.props.children :
        <div className={styles.unauthorized}>
          <h1>Доступ запрещен</h1>
          <LoginForm />
        </div>
    );
  }
}
