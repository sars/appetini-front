import React, { Component, PropTypes } from 'react';
import LunchExampleForm from 'components/LunchForm/LunchExampleForm';
import { updateLunch } from 'redux/modules/common';
import { show as showToast } from 'redux/modules/toast';
import { connect } from 'react-redux';
import { asyncConnect, loadSuccess } from 'redux-async-connect';
import submit from '../submit';

@asyncConnect([
  {key: 'lunchExample', promise: ({helpers, params}) => helpers.client.get(`/lunch_examples/${params.lunchExampleId}`).then(data => data.resource)}
])
@connect(null, { updateLunch, showToast, loadSuccess })
export default class Edit extends Component {
  static propTypes = {
    lunchExample: PropTypes.object.isRequired,
    updateLunch: PropTypes.func.isRequired,
    loadSuccess: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired
  };

  static contextTypes = {
    client: PropTypes.object.isRequired
  };

  updateLunchExample = (lunchExample) => {
    return this.context.client.put(`/lunch_examples/${lunchExample.id}`, { data: { resource: lunchExample}});
  }

  updateLunch(lunch) {
    return submit(lunch, this.updateLunchExample).then(response => {
      this.props.showToast('Обед успешно обновлен');
      this.props.loadSuccess('lunchExample', response.resource);
      return response;
    });
  }

  render() {
    return (
      <LunchExampleForm initialValues={this.props.lunchExample} onSubmit={::this.updateLunch}
                 title="Редактирование шаблона обеда" sendLabel="Обновить шаблон"/>
    );
  }
}
