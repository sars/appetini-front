import React, { Component, PropTypes } from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import { close } from 'redux/modules/modals';
import { connect, Provider } from 'react-redux';
import * as Components from 'components'; // TODO move to App

@connect(state => ({ ...state.modals }), {close})
export default class Modal extends Component {
  static propTypes = {
    component: PropTypes.string,
    title: PropTypes.string,
    close: PropTypes.func.isRequired,
    active: PropTypes.bool.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  actions = [
    { label: 'Cancel', onClick: this.props.close }
  ];

  render() {
    const {title, component, active} = this.props;
    return (
      <Dialog actions={this.actions} active={active} title={title} onOverlayClick={this.props.close}>
        {component && <Provider store={this.context.store} key="provider">
          {React.createElement(Components[component], {onSuccess: this.props.close})}
        </Provider>}
      </Dialog>
    );
  }
}
