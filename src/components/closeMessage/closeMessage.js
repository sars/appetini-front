import React, { Component } from 'react';
import styles from './styles.scss';

export default class CloseMessage extends Component {
  render() {
    return (
      <div className={styles.closeMessage}>Сервис Appetini закрывается, чтобы открыться с новыми возможностями!</div>
    );
  }
}
