import React, { Component } from 'react';
import DatePicker from 'react-toolbox/lib/date_picker';

export default class extends Component {
  render() {
    const styles = require('./styles.scss');
    return (
      <div className={styles.wrapper}>
        <DatePicker {...this.props}/>
      </div>
    );
  }
}
