import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink, Link } from 'react-router';
import Navigation from 'react-toolbox/lib/navigation';
import { Button as ToolboxButton, IconButton } from 'react-toolbox/lib/button';
import AppBar from 'react-toolbox/lib/app_bar';
import Helmet from 'react-helmet';
import { load as loadAuth, logout } from 'redux/modules/auth';
import { routeActions } from 'redux-simple-router';
import config from '../../config';
import { VkIcon, InstagramIcon, FbIcon } from 'components/icons';
import { LoginModal } from 'components';
import 'react-toolbox/lib/commons';
import {toggle} from 'redux/modules/loginModal';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import classNames from 'classnames';

@connect(
  state => ({user: state.auth.user, routerReducer: state.routerReducer, auth: state.auth}),
  {logout, pushState: routeActions.push, toggle})
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    auth: PropTypes.object,
    logout: PropTypes.func.isRequired,
    toggle: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    routerReducer: PropTypes.object,
    loading: PropTypes.bool.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  state = {
    loginModalActive: false
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.pushState('/loginSuccess');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState('/');
    }
  }

  static loadProps(params) {
    return params.store.dispatch(loadAuth());
  }

  openLoginModal = () => {
    this.props.toggle();
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
    const {user} = this.props;
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
            {user && <a onClick={this.props.logout} activeClassName={styles.activeNavLink}>Выйти</a> }
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

        <LoginModal opened={this.state.loginModalActive} />
      </div>
    );
  }
}
