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
    const styles = require('./CheckButton.scss');
    const classname = classNames(styles.checkButton, this.props.className, {
      [styles.checked]: this.props.checked,
      [this.props.checkedClass]: this.props.checked && this.props.checkedClass,
      [styles.disabled]: this.props.disabled,
      [this.props.disabledClass]: this.props.disabled && this.props.disabledClass
    });

    return (
      <label className={classname}>
        <div onClick={this.handleChange}>
          {this.props.children}
          {this.props.label}
        </div>
      </label>
    );
  }
}
