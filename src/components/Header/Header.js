import React, { Component, PropTypes } from 'react';
import AppBar from 'react-toolbox/lib/app_bar';
import Navigation from 'react-toolbox/lib/navigation';
import { Button, IconButton } from 'react-toolbox/lib/button';
import { IndexLink } from 'react-router';
import classNames from 'classnames/bind';
import { logout } from 'redux/modules/auth';
import { connect } from 'react-redux';
import { show as showToast } from 'redux/modules/toast';
import { open as openModal } from 'redux/modules/modals';
import HeaderMenu from 'components/HeaderMenu/HeaderMenu';

const menuLinks = [
  {to: '/', label: 'Меню', index: true},
  {to: '/about', label: 'О Нас'},
  {to: '/loginSuccess', label: 'Тарифные планы'}
];

@connect(state => ({user: state.auth.user}), {logout, showToast, openModal})
export default class Header extends Component {
  static propTypes = {
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired
  };

  logout = (event) => {
    event.preventDefault();
    this.props.logout().then(() => this.props.showToast('You are successfully logged out', 'accept', 'done'));
  };

  openLoginModal = () => {
    this.props.openModal('LoginForm', 'Login');
  };

  render() {
    const {user} = this.props;
    const styles = require('./Header.scss');
    const cx = classNames.bind(styles);
    const buttonCx = classNames.bind(require('components/button/button.scss'));

    return (
      <AppBar fixed className={styles.root}>
        <IndexLink className={styles.brand} to="/">
          <div className={styles.brandIcon}></div>
          <span className={styles.brandLabel}></span>
        </IndexLink>

        <HeaderMenu className={styles.desktopMenu} links={menuLinks} showActive />

        <Navigation className={cx('navigation', 'navigationRight')}>
          {!user && <Button className={buttonCx('flat', 'accent')} label="Войти" accent onClick={this.openLoginModal}/>}
          {user && <a className={styles.logout} href="#" onClick={this.logout}>Выйти</a> }
          <div className={styles.search}>
            <IconButton className={styles.searchButton} icon="search"/>
            <input type="text"/>
          </div>
        </Navigation>
      </AppBar>
    );
  }
}
