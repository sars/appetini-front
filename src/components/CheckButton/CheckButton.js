import React, {Component, PropTypes} from 'react';
import {Ripple as ripple} from 'react-toolbox';
import classNames from 'classnames';

@ripple({spread: 1})
export default class CheckButton extends Component {
  static propTypes = {
    children: React.PropTypes.any,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    className: PropTypes.string,
    checkedClass: PropTypes.string,
    disabledClass: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.string.isRequired
  };

  handleChange = () => {
    if (this.props.onChange && !this.props.disabled) {
      this.props.onChange(!this.props.checked);
    }
  };

  render() {
    const {className, checked, checkedClass, disabled, disabledClass, ...others} = this.props;
    const styles = require('./CheckButton.scss');
    const classname = classNames(styles.checkButton, className, {
      [styles.checked]: checked,
      [this.props.checkedClass]: checked && checkedClass,
      [styles.disabled]: disabled,
      [this.props.disabledClass]: disabled && disabledClass
    });

    return (
      <label {...others} className={classname} onClick={this.handleChange}>
        {this.props.children}
        {this.props.label}
      </label>
    );
  }
}
