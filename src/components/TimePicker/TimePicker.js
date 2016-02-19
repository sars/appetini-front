import React, { Component } from 'react';
import TimePicker from 'react-toolbox/lib/time_picker';

export default class extends Component {
  render() {
    const styles = require('./styles.scss');
    return (
      <div className={styles.wrapper}>
        <TimePicker {...this.props}/>
      </div>
    );
  }
}
