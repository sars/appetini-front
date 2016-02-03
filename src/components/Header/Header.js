import React, { Component, PropTypes } from 'react';
import AppBar from 'react-toolbox/lib/app_bar';
import Navigation from 'react-toolbox/lib/navigation';
import { Button, IconButton } from 'react-toolbox/lib/button';
import { IndexLink, Link } from 'react-router';
import classNames from 'classnames/bind';
import { logout } from 'redux/modules/auth';
import { connect } from 'react-redux';
import { show as showToast } from 'redux/modules/toast';
import { open as openModal } from 'redux/modules/modals';

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
      <AppBar fixed>
        <IndexLink className={styles.brand} to="/">
          <div className={styles.brandIcon}></div>
          <span className={styles.brandLabel}></span>
        </IndexLink>

        <Navigation className={cx('navigation', 'navigationMenu')}>
          <IndexLink to="/" activeClassName={styles.activeNavLink}><span>Меню</span></IndexLink>
          <Link to="/about" activeClassName={styles.activeNavLink}><span>О нас</span></Link>
          <Link to="/loginSuccess" activeClassName={styles.activeNavLink}><span>Тарифные планы</span></Link>
        </Navigation>

        <Navigation className={cx('navigation', 'navigationRight')}>
          {!user && <Button className={buttonCx('flat', 'accent')} label="Войти" accent onClick={this.openLoginModal}/>}
          {user && <a href="#" onClick={this.logout}>Выйти</a> }
          <div className={styles.search}>
            <IconButton className={styles.searchButton} icon="search"/>
            <input type="text"/>
          </div>
        </Navigation>
      </AppBar>
    );
  }
}
