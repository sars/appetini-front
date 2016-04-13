import React, { Component, PropTypes } from 'react';
import Drawer from 'react-toolbox/lib/drawer';
import { IconButton } from 'react-toolbox/lib/button';
import Button from 'components/Button/Button';
import { MenuItem, MenuDivider } from 'react-toolbox/lib/menu';
import { Link } from 'react-router';
import SocialButton from 'components/SocialButton/SocialButton';
import styles from './styles.scss';

export default class MobMenu extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };
  state = {
    active: false
  };
  handleToggle = () => {
    this.setState({active: !this.state.active});
  };
  handleOnJoin = () => {
    this.context.router.push('/join');
    this.handleToggle();
  };
  render() {
    return (
      <div className={this.props.className}>
        <IconButton className={styles.mobMenuBtn} onClick={this.handleToggle} icon="menu" />
        <Drawer className={styles.drawerMenu} active={this.state.active} onOverlayClick={this.handleToggle}>
          <h3 className={styles.headerMobMenu}>Меню</h3>
          <div icon="more_vert" position="top-left" menuRipple>
            <Link onClick={this.handleToggle} to="/"><MenuItem caption="Обеды"/></Link>
            <Link onClick={this.handleToggle} to="/about"><MenuItem caption="О Нас"/></Link>
            <Link onClick={this.handleToggle} to="/tariffs"><MenuItem caption="Тарифные планы"/></Link>
            <MenuDivider />
            <div className={styles.btnContainer}>
              <Button flat outlined label="Зарегистрироваться" onClick={this.handleOnJoin}/>
            </div>
            <div className={styles.socialContainer}>
              <span className={styles.socialLabel}>Присоединяйтесь к нам: </span>
              <div className={styles.socialButtons}>
                <SocialButton className={styles.socialButton} name="vk"
                              href="http://vk.com/appetini" target="_blank"/>
                <SocialButton className={styles.socialButton} name="fb"
                              href="https://www.facebook.com/appetinicom/" target="_blank"/>
                <SocialButton className={styles.socialButton} name="instagram"
                              href="https://www.instagram.com/appetinicom/" target="_blank"/>
              </div>
            </div>
          </div>
        </Drawer>
      </div>
    );
  }
}

MobMenu.propTypes = {
  className: PropTypes.string
};
