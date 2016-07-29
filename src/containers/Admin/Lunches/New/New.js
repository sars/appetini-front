import React, { Component, PropTypes } from 'react';
import LunchForm from 'components/LunchForm/LunchForm';
import { createLunch } from 'redux/modules/common';
import { show as showToast } from 'redux/modules/toast';
import { connect } from 'react-redux';
import submit from '../submit';
import cloneLunch from 'helpers/cloneLunch';
import { asyncConnect } from 'redux-async-connect';

@asyncConnect([
  {key: 'draftLunch', promise: ({helpers, store}) => {
    const state = store.getState();
    const { draftLunchId } = state.routing.location.query;
    if (draftLunchId) {
      return helpers.client.get(`/draft_lunches/${draftLunchId}`).then(response => response.resource);
    }
  }}
])
@connect(null, { createLunch, showToast })
export default class New extends Component {
  static propTypes = {
    createLunch: PropTypes.func.isRequired,
    draftLunch: PropTypes.object,
    location: PropTypes.object.isRequired,
    showToast: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired
  };

  state = {
    lunchFields: {}
  };

  componentDidMount() {
    const { draftLunch } = this.props;
    const { client } = this.context;
    if (draftLunch) {
      cloneLunch(draftLunch, client)
        .then(lunchFields => {
          this.setState({lunchFields});
        });
    }
  }

  createLunch = (lunch) => {
    return submit(lunch, this.props.createLunch).then(response => {
      this.props.showToast('Обед успешно добавлен');
      this.context.router.push('/admin/lunches/' + response.resource.id + '/edit');
    });
  }

  render() {
    const { lunchFields } = this.state;
    return (
      <LunchForm acceptRules initialValues={lunchFields} title="Создание обеда"
                 sendLabel="Создать обед" onSubmit={this.createLunch}/>
    );
  }
}
