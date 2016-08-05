import React, { Component, PropTypes } from 'react';
import { Header, Footer } from 'components';
import styles from './styles.scss';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.object
  };

  render() {
    return (
      <div className={styles.app}>
        <div className={styles.appContent}>
          {this.props.children}
        </div>
        <Header />
        <Footer />
      </div>
    );
  }
}
