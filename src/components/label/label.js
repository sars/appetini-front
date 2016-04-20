import React, { Component, PropTypes } from 'react';

export default class Label extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    children: PropTypes.node
  }

  render() {
    const {label, children} = this.props;
    return (
        <span {...this.props}>
          {label}
          {children ? children : null}
        </span>
    );
  }
}
