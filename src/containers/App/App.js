import React, { Component, PropTypes } from 'react';
import { Header, Footer } from 'components';
import styles from './styles.scss';
import CloseMessage from 'components/closeMessage/closeMessage';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.object
  };

  render() {
    return (
      <div className={styles.app}>
        <div className={styles.appContent}>
          <CloseMessage/>
          {this.props.children}
        </div>
        <Header />
        <Footer />
      </div>
    );
  }
}
