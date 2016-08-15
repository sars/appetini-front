import React, { Component, PropTypes } from 'react';
import LunchExampleForm from 'components/LunchForm/LunchExampleForm';
import { show as showToast } from 'redux/modules/toast';
import { connect } from 'react-redux';
import submit, { createLunchExample } from './../submit';
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
@connect(null, { showToast })
export default class New extends Component {
  static propTypes = {
    showToast: PropTypes.func.isRequired,
    draftLunch: PropTypes.object
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired
  };

  state = {
    lunchExampleFields: {}
  };

  componentDidMount() {
    const { draftLunch } = this.props;
    const { client } = this.context;
    if (draftLunch) {
      cloneLunch(draftLunch, client)
        .then(lunchExampleFields => {
          this.setState({lunchExampleFields});
        });
    }
  }

  saveLunch = (lunch) => {
    const { showToast } = this.props; // eslint-disable-line no-shadow
    return submit(lunch, createLunchExample(this.context.client)).then((response) => {
      showToast('Шаблон обеда успешно добавлен', 'accept', 'done');
      this.context.router.push(`/admin/lunch_examples`);
      return response;
    });
  };

  render() {
    return (
      <LunchExampleForm title="Создание шаблона обеда" acceptRules sendLabel="Создать шаблон"
                 initialValues={this.state.lunchExampleFields} onSubmit={this.saveLunch}/>
    );
  }
}
