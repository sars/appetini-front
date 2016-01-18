import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink, Link } from 'react-router';
import Navigation from 'react-toolbox/lib/navigation';
import { Button as ToolboxButton, IconButton } from 'react-toolbox/lib/button';
import AppBar from 'react-toolbox/lib/app_bar';
import Helmet from 'react-helmet';
import { logout } from 'redux/modules/auth';
import { routeActions } from 'redux-simple-router';
import config from '../../config';
import { VkIcon, InstagramIcon, FbIcon } from 'components/icons';
import { Modal, Toast } from 'components';
import 'react-toolbox/lib/commons';
import {open} from 'redux/modules/modals';
import {show as showToast} from 'redux/modules/toast';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import classNames from 'classnames';
import { asyncConnect } from 'helpers/asyncConnect';

@asyncConnect({
  user: (params, helpers) => {
    const state = helpers.store.getState();
    const user = state.reduxAsyncConnect.user;

    if (!user || !user.loaded) {
      const userFromToken = state.auth.tokenPayload.user;
      return userFromToken ? helpers.client.get('/users/' + userFromToken.id) : Promise.reject();
    }
  }
})
@connect(state => ({loading: state.reduxAsyncConnect.loading}),
  {logout, pushState: routeActions.push, open, showToast})
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    open: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    routerReducer: PropTypes.object,
    loading: PropTypes.bool.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.user.loaded && nextProps.user.loaded) {
      // login
      this.props.pushState('/loginSuccess');
    } else if (this.props.user.loaded && !nextProps.user.loaded) {
      // logout
      this.props.pushState('/');
    }
  }

  logout = (event) => {
    event.preventDefault();
    this.props.logout().then(() => this.props.showToast('You are successfully logged out', 'accept', 'done'));
  };

  openLoginModal = () => {
    this.props.open('LoginForm', 'Login');
  };

  handleChange = (item, value) => {
    const newState = {};
    newState[item] = value;
    this.setState(newState);
  };

  handleLogout = (event) => {
    event.preventDefault();
    this.props.logout();
  };

  render() {
    const user = this.props.user.data;
    const styles = require('./App.scss');

    return (
      <div className={styles.app}>
        <ProgressBar mode="indeterminate"
          className={classNames(styles.progress, {[styles.progressActive]: this.props.loading})} />
        <AppBar fixed>
          <IndexLink to="/">
            <div className={styles.brand}/>
            <span>{config.app.title}</span>
          </IndexLink>

          <Navigation className={styles.navigation}>
            <IndexLink to="/" activeClassName={styles.activeNavLink}>Меню</IndexLink>
            <Link to="/about" activeClassName={styles.activeNavLink}>О нас</Link>
            <Link to="/prices" activeClassName={styles.activeNavLink}>Тарифные планы</Link>
            {!user && <ToolboxButton label="Войти" accent onClick={this.openLoginModal} />}
            {user && <a href="#" onClick={this.logout}>Выйти</a> }
            <IconButton icon="search" accent />
          </Navigation>
        </AppBar>

        <Helmet {...config.app.head}/>

        <div className={styles.appContent}>
          {this.props.children}
        </div>

        <footer className={styles.footer}>
          <div className={styles.firstLine}>
            <Navigation>
              <Link to="/terms">Условия использования</Link>
              <Link to="/how-it-works">Как это работает</Link>
              <IndexLink to="/">Меню</IndexLink>
              <Link to="/about">О нас</Link>
            </Navigation>
            <div className={styles.auth}>
              <ToolboxButton label="Войти" accent />
              <ToolboxButton label="Зарегистрироваться" accent raised />
            </div>
          </div>

          <div className={styles.secondLine}>
            <div className={styles.terms}>
              2016 Appetini. Все права защищены и соблюдены.
            </div>
            <div className={styles.social}>
              <ToolboxButton floating accent mini><FbIcon /></ToolboxButton>
              <ToolboxButton floating accent mini><VkIcon /></ToolboxButton>
              <ToolboxButton floating accent mini><InstagramIcon /></ToolboxButton>
            </div>
          </div>
        </footer>

        <Modal />
        <Toast />
      </div>
    );
  }
}
