import React, { Component, PropTypes } from 'react';
import Button from 'react-toolbox/lib/button';
import cx from 'classnames';

export default class extends Component {
  static propTypes = {
    className: PropTypes.string,
    flat: PropTypes.bool,
    accent: PropTypes.bool,
    outlined: PropTypes.bool
  };

  render() {
    const styles = require('./styles.scss');
    const classNames = cx(this.props.className, {
      [styles.flat]: this.props.flat,
      [styles.accent]: this.props.accent,
      [styles.outlined]: this.props.outlined
    });
    return <Button {...this.props} className={classNames}/>;
  }
}
