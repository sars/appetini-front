import React, { Component, PropTypes } from 'react';
import Snackbar from 'react-toolbox/lib/snackbar';
import { close } from 'redux/modules/toast';
import { connect } from 'react-redux';
import styles from './styles.scss';

@connect(state => ({ ...state.toast }), {close})
export default class Toast extends Component {
  static propTypes = {
    icon: PropTypes.string,
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    close: PropTypes.func.isRequired,
    active: PropTypes.bool.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return this.props !== nextProps;
  }

  render() {
    const {icon, label, type, active} = this.props;
    const { formatMessage } = this.context.intl;
    const formattedMessage = label ? formatMessage({id: label, defaultMessage: label}) : label;
    return (
      <Snackbar icon={icon} label={formattedMessage} className={styles[type]} type={type} onTimeout={this.props.close}
                timeout={2000} active={active}
      />
    );
  }
}
