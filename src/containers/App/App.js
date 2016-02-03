import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink, Link } from 'react-router';
import Navigation from 'react-toolbox/lib/navigation';
import { Button as ToolboxButton } from 'react-toolbox/lib/button';
import Helmet from 'react-helmet';
import { routeActions } from 'react-router-redux';
import config from '../../config';
import { VkIcon, InstagramIcon, FbIcon } from 'components/icons';
import { Modal, Toast, Header } from 'components';
import 'react-toolbox/lib/commons';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import classNames from 'classnames';

@connect(state => ({loaded: state.reduxAsyncConnect.loaded}),
  {pushState: routeActions.push})
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
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

  handleChange = (item, value) => {
    const newState = {};
    newState[item] = value;
    this.setState(newState);
  };

  render() {
    const styles = require('./App.scss');

    return (
      <div className={styles.app}>
        <Helmet {...config.app.head}/>

        <ProgressBar mode="indeterminate"
          className={classNames(styles.progress, {[styles.progressActive]: !this.props.loaded})} />

        <Header />

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
