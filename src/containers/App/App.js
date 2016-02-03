import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink, Link } from 'react-router';
import Navigation from 'react-toolbox/lib/navigation';
import { Button as ToolboxButton, IconButton } from 'react-toolbox/lib/button';
import AppBar from 'react-toolbox/lib/app_bar';
import Helmet from 'react-helmet';
import { logout } from 'redux/modules/auth';
import { routeActions } from 'react-router-redux';
import config from '../../config';
import { VkIcon, InstagramIcon, FbIcon } from 'components/icons';
import { Modal, Toast } from 'components';
import 'react-toolbox/lib/commons';
import {open} from 'redux/modules/modals';
import {show as showToast} from 'redux/modules/toast';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import classNames from 'classnames';

@connect(state => ({user: state.auth.user, loaded: state.reduxAsyncConnect.loaded}),
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
    loaded: PropTypes.bool.isRequired
  };

  componentDidMount() {
    window.addEventListener('wheel', () => {
      const y1 = document.body.scrollTop / 2 + 'px';
      const y2 = document.body.scrollTop / 5 + 'px';
      document.body.style.backgroundPositionY = y1 + ', ' + y2;
    });
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
    const user = this.props.user;
    const styles = require('./App.scss');
    const buttonStyles = require('components/button/button.scss');

    return (
      <div className={styles.app}>
        <ProgressBar mode="indeterminate"
          className={classNames(styles.progress, {[styles.progressActive]: !this.props.loaded})} />
        <AppBar fixed>
          <IndexLink className={styles.brand} to="/">
            <div className={styles.brandIcon}/>
            <span className={styles.brandLabel}/>
          </IndexLink>

          <Navigation className={styles.navigation}>
            <IndexLink to="/" activeClassName={styles.activeNavLink}>Меню</IndexLink>
            <Link to="/about" activeClassName={styles.activeNavLink}>О нас</Link>
            <Link to="/loginSuccess" activeClassName={styles.activeNavLink}>Тарифные планы</Link>
            {!user && <ToolboxButton className={classNames(buttonStyles.flat, buttonStyles.accent)} label="Войти" accent onClick={this.openLoginModal} />}
            {user && <a href="#" onClick={this.logout}>Выйти</a> }
            <IconButton className={classNames(styles.search, styles.searchAccent)} icon="search" />
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
