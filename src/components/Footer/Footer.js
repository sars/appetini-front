import React, { Component, PropTypes } from 'react';
import Navigation from 'react-toolbox/lib/navigation';
import { Button } from 'react-toolbox/lib/button';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { open as openModal } from 'redux/modules/modals';
import HeaderMenu from 'components/HeaderMenu/HeaderMenu';
import SocialButton from 'components/SocialButton/SocialButton';

const menuLinks = [
  {to: '/terms', label: 'Условия использования'},
  {to: '/how-it-works', label: 'Как это работает'},
  {to: '/', label: 'Меню', index: true},
  {to: '/about', label: 'О Нас'}
];

@connect(null, {openModal})
export default class Footer extends Component {
  static propTypes = {
    openModal: PropTypes.func.isRequired
  };

  openLoginModal = () => {
    this.props.openModal('LoginForm', 'Login');
  };

  render() {
    const styles = require('./Footer.scss');
    const buttonStyles = require('components/button/button.scss');

    return (
      <footer className={styles.footer}>
        <div className={styles.firstLine}>
          <HeaderMenu links={menuLinks}/>

          <Navigation>
            <Button className={classNames(buttonStyles.flat, buttonStyles.accent)} label="Войти" accent
                    onClick={this.openLoginModal} />
            <Button className={classNames(buttonStyles.flat, buttonStyles.outlined)} label="Зарегистрироваться" accent />
          </Navigation>
        </div>

        <div className={styles.secondLine}>
          <div className={styles.terms}>
            2016 Appetini. Все права защищены и соблюдены.
          </div>
          <Navigation className={styles.social}>
            <span className={styles.socialLabel}>Присоединяйтесь к нам: </span>
            <SocialButton name="vk" />
            <SocialButton name="fb" />
            <SocialButton className={styles.socialButton} name="instagram" />
          </Navigation>
        </div>
      </footer>
    );
  }
}
