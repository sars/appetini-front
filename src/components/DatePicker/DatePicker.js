import React, { Component, PropTypes } from 'react';
import DatePicker from 'react-toolbox/lib/date_picker';
import classNames from 'classnames';

export default class extends Component {

  static propTypes = {
    value: PropTypes.object,
    wrapperClassName: PropTypes.object
  };

  render() {
    const styles = require('./styles.scss');
    const datePickerClass = classNames(styles.wrapper, this.props.wrapperClassName, {[styles.hideLabel]: this.props.value});
    return (
      <div className={datePickerClass}>
        <DatePicker {...this.props}/>
      </div>
    );
  }
}
