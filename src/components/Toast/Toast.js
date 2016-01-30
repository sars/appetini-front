import React, { Component, PropTypes } from 'react';
import Snackbar from 'react-toolbox/lib/snackbar';
import { close } from 'redux/modules/toast';
import { connect } from 'react-redux';

@connect(state => ({ ...state.toast }), {close})
export default class Toast extends Component {
  static propTypes = {
    icon: PropTypes.string,
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    close: PropTypes.func.isRequired,
    active: PropTypes.bool.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return this.props !== nextProps;
  }

  render() {
    const {icon, label, type, active} = this.props;
    return (
      <Snackbar icon={icon} label={label} type={type} onTimeout={this.props.close}
                timeout={2000} active={active}
      />
    );
  }
}
