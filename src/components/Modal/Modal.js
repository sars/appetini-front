import React, { Component, PropTypes } from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import { close } from 'redux/modules/modals';
import { connect } from 'react-redux';
import * as Components from 'components'; // TODO move to App
import styles from './styles.scss';

const contextTypes = {
  store: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired
};

class Provider extends Component {
  static propTypes = {
    context: PropTypes.object.isRequired,
    children: PropTypes.any
  };

  static childContextTypes = contextTypes;

  getChildContext() {
    return { ...this.props.context };
  }

  render() {
    return this.props.children || null;
  }
}

@connect(state => ({ ...state.modals }), {close})
export default class Modal extends Component {
  static propTypes = {
    component: PropTypes.string,
    title: PropTypes.string,
    close: PropTypes.func.isRequired,
    active: PropTypes.bool.isRequired
  };

  static contextTypes = contextTypes;

  render() {
    const {title, component, active} = this.props;

    return (
      <Dialog className={styles.dialog} active={active} onOverlayClick={this.props.close}>
        <div className={styles.close} onClick={::this.props.close}></div>
        <h6 className={styles.title}>
          <span>{title}</span>
        </h6>
        <Provider context={this.context}>
          {component && React.createElement(Components[component], {onSuccess: this.props.close})}
        </Provider>
      </Dialog>
    );
  }
}
