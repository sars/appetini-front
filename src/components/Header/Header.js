import React, { Component, PropTypes } from 'react';
import AppBar from 'react-toolbox/lib/app_bar';
import Navigation from 'react-toolbox/lib/navigation';
import { IconButton } from 'react-toolbox/lib/button';
import Button from 'components/Button/Button';
import { IndexLink } from 'react-router';
import classNames from 'classnames/bind';
import { logout } from 'redux/modules/auth';
import { connect } from 'react-redux';
import { show as showToast } from 'redux/modules/toast';
import { open as openModal } from 'redux/modules/modals';
import HeaderMenu from 'components/HeaderMenu/HeaderMenu';
import Menu from 'components/Menu/Menu';
import { MenuItem, MenuDivider } from 'react-toolbox';
import { FormattedPlural } from 'react-intl';
import MobMenu from 'components/MobMenu/MobMenu';
import ShoppingButton from 'components/ShoppingButton/ShoppingButton';
import menuLinks from 'helpers/menuLinks';
import config from 'config';

@connect(state => ({user: state.auth.user, lunchesAmount: state.purchase.lunchesAmount, order: state.purchase.order}), {logout, showToast, openModal})
export default class Header extends Component {
  static propTypes = {
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired,
    lunchesAmount: PropTypes.number.isRequired,
    order: PropTypes.object
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  state = {
    userMenuOpened: false
  };
  logout = () => {
    this.props.logout().then(() => {
      this.props.showToast('You are successfully logged out', 'accept', 'done');
      this.context.router.push('/');
    });
  };

  openLoginModal = () => {
    this.props.openModal('LoginForm', 'Авторизация');
  };

  openMenu(event) {
    event.preventDefault();
    this.refs.userMenu.show();
  }

  goToAdminPage() {
    window.location.href = location.origin + '/rails_admin';
  }

  render() {
    const { user, lunchesAmount, order } = this.props;
    const { push } = this.context.router;
    const styles = require('./Header.scss');
    const cx = classNames.bind(styles);

    const menuItems = user && [
      <MenuItem key="deliveries" disabled caption="">
        {user.deliveries_available}
        &nbsp;
        <FormattedPlural value={user.deliveries_available} one="доставка" few="доставки" many="доставок" other="доставок"/>
      </MenuItem>,
      user.role === 'admin' && <MenuItem key="admin" caption="Админка" onClick={::this.goToAdminPage}/>,
      user.role === 'admin' && <MenuItem key="ordersItems" caption="Позиции заказов" onClick={() => push('/admin/order_items')}/>,
      user.role === 'admin' && <MenuItem key="ordersIndex" caption="История заказов" onClick={() => push('/orders')}/>,
      <MenuDivider key="devider" />,
      <MenuItem key="settings" caption="Настройки" onClick={() => push('/settings')}/>,
      user.cook && user.cook.id && <MenuItem key="cook_page" caption="Страница кулинара" onClick={() => push('/cooks/' + user.cook.id + '/orders')}/>,
      user.cook && user.cook.id && <MenuItem key="lunch_create" caption="Создать обед" onClick={() => push('/cooks/' + user.cook.id + '/draft_lunches/new')}/>,
      (user.courier || user.role === 'admin') && <MenuItem key="courier_page" caption="Страница курьера" onClick={() => push('/courier/orders')}/>,
      <MenuItem key="logout" caption="Выйти" onClick={this.logout}/>
    ];

    return (
      <AppBar fixed className={classNames(styles.root, 'hidePrint')}>
        <div className={styles.leftMenu}>
          <MobMenu className={styles.mobMenu} />
          {(lunchesAmount > 0 || order) && <ShoppingButton countItems={lunchesAmount} className={styles.shopCartMob}/>}
        </div>
        <IndexLink className={styles.brand} to="/">
          <div className={styles.brandIcon}>
            <span className={styles.brandIconCity}>сумы</span>
            <span className={styles.brandIconPhone}>{config.app.phone}</span>
          </div>
          <span className={styles.brandLabel}>
            <span className={styles.brandLabelPhone}>{config.app.phone}</span>
          </span>
        </IndexLink>

        <HeaderMenu className={styles.desktopMenu} links={menuLinks} showActive />
        <Navigation className={cx('navigation', 'navigationRight')}>
          {(lunchesAmount > 0 || order) && <ShoppingButton countItems={lunchesAmount} className={styles.shopCart}/>}
          {!user && <Button flat accent label="Войти" onClick={this.openLoginModal}/>}
          {user &&
            <div className={styles.userMenu}>
              <a className={styles.logout} href="#" onClick={::this.openMenu}>
                {user.name}
              </a>
              <Menu position="top-right" menuRipple ref="userMenu" className={styles.menuComponent}>
                {menuItems.filter(item => item)}
              </Menu>
            </div>
          }
          {false && <div className={styles.search}>
            <IconButton className={styles.searchButton} icon="search"/>
            <input type="text"/>
          </div>}
        </Navigation>
      </AppBar>
    );
  }
}
