import React, { Component, PropTypes } from 'react';
import DatePicker from 'react-toolbox/lib/date_picker';
import classNames from 'classnames';

export default class extends Component {

  static propTypes = {
    value: PropTypes.object,
    wrapperClassName: PropTypes.string,
    disabled: PropTypes.bool
  };

  render() {
    const styles = require('./styles.scss');
    const { wrapperClassName, value, disabled } = this.props;
    const datePickerClass = classNames(styles.wrapper, wrapperClassName,
      {[styles.hideLabel]: value, [styles.disabled]: disabled});

    return (
      <div className={datePickerClass}>
        <DatePicker {...this.props}/>
      </div>
    );
  }
}
