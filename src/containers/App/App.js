import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import Link from 'react-toolbox/lib/link';
import Navigation from 'react-toolbox/lib/navigation';
import { Button as ToolboxButton, IconButton } from 'react-toolbox/lib/button';
import AppBar from 'react-toolbox/lib/app_bar';
import Helmet from 'react-helmet';
import { isLoaded as isInfoLoaded, load as loadInfo } from 'redux/modules/info';
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';
import { pushState } from 'redux-router';
import connectData from 'helpers/connectData';
import config from '../../config';
import { VkIcon, InstagramIcon, FbIcon } from 'components/icons';
import { LoginModal } from 'components';
import 'react-toolbox/lib/commons';
import {toggle} from 'redux/modules/loginModal';

function fetchData(getState, dispatch) {
  const promises = [];
  if (!isInfoLoaded(getState())) {
    promises.push(dispatch(loadInfo()));
  }
  if (!isAuthLoaded(getState())) {
    promises.push(dispatch(loadAuth()));
  }
  return Promise.all(promises);
}

@connectData(fetchData)
@connect(
  state => ({user: state.auth.user}),
  {logout, pushState, toggle})
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    toggle: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
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
      this.props.pushState(null, '/loginSuccess');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState(null, '/');
    }
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
        <AppBar fixed>
          <IndexLink to="/">
            <div className={styles.brand}/>
            <span>{config.app.title}</span>
          </IndexLink>

          <Navigation className={styles.navigation}>
            <Link href="http://" label="Меню" />
            <Link className={styles.navigationLinkActive} href="http://" label="О нас" />
            <Link href="http://" label="Тарифные планы" />
            {!user && <ToolboxButton label="Войти" accent onClick={this.openLoginModal} />}
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
              <Link href="http://" label="Условия использования" />
              <Link href="http://" label="Как это работает" />
              <Link href="http://" label="Меню" />
              <Link href="http://" label="О нас" />
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
