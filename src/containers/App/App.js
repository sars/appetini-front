import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { routeActions } from 'react-router-redux';
import config from '../../config';
import { Modal, Toast, Header, Footer } from 'components';
import 'react-toolbox/lib/commons';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import GoogleAnalytics from 'react-g-analytics';
import classNames from 'classnames';

@connect(state => ({loaded: state.reduxAsyncConnect.loaded}),
  {pushState: routeActions.push})
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object,
    pushState: PropTypes.func.isRequired,
    routerReducer: PropTypes.object,
    route: PropTypes.object.isRequired,
    loaded: PropTypes.bool.isRequired
  };

  static childContextTypes = {
    client: PropTypes.object.isRequired
  };

  getChildContext() {
    return { client: this.props.route.client };
  }

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
      <div className={styles.app} data-react-toolbox="app">
        <Helmet {...config.app.head}/>

        <ProgressBar mode="indeterminate"
          className={classNames(styles.progress, {[styles.progressActive]: !this.props.loaded})} />

        <div className={styles.appContent}>
          {this.props.children}
        </div>

        <Header />
        <Footer />

        <Modal />
        <Toast />

        <GoogleAnalytics id="UA-71130170-1"/>
      </div>
    );
  }
}
