import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class extends Component {
  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    label: PropTypes.string,
    multiline: PropTypes.bool,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyPress: PropTypes.func,
    required: PropTypes.bool,
    type: PropTypes.string,
    value: PropTypes.any,
    styles: PropTypes.object
  };

  static defaultProps = {
    disabled: false,
    multiline: false,
    required: false,
    type: 'text'
  };

  handleChange(event) {
    if (this.props.onChange) this.props.onChange(event.target.value, event);
  }

  blur() {
    this.refs.input.blur();
  }

  focus() {
    this.refs.input.focus();
  }

  render() {
    const styles = this.props.styles || require('./styles.scss');
    const { disabled, error, label, multiline, type, value, ...others} = this.props;
    const labelClassName = styles.label;

    const className = classNames(styles.root, {
      [styles.disabled]: disabled,
      [styles.errored]: error,
      [styles.hidden]: type === 'hidden'
    }, this.props.className);

    const InputElement = React.createElement(multiline ? 'textarea' : 'input', {
      ...others,
      className: classNames(styles.input, {[styles.filled]: value}),
      onChange: ::this.handleChange,
      ref: 'input',
      role: 'input',
      disabled,
      type,
      value
    });

    return (
      <div className={className}>
        <div className={styles.inputWrapper}>
          {InputElement}
          <span className={styles.bar}></span>
        </div>
        {label && <label className={labelClassName}>{label}</label>}
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  }
}
