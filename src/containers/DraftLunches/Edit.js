import React, { Component, PropTypes } from 'react';
import DraftLunchForm from 'components/LunchForm/DraftLunchForm';
import { show as showToast } from 'redux/modules/toast';
import { connect } from 'react-redux';
import { asyncConnect, loadSuccess } from 'redux-async-connect';
import submit from './../Admin/Lunches/submit';

@asyncConnect([
  {key: 'draftLunch', promise: ({params, helpers}) =>
    helpers.client.get(`/draft_lunches/${params.draftLunchId}`).then(response => response.resource)
  }
])
@connect(null, { showToast, loadSuccess })
export default class Edit extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    draftLunch: PropTypes.object.isRequired,
    loadSuccess: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired
  };

  static contextTypes = {
    client: PropTypes.object.isRequired
  };

  saveLunchByCook = (lunch) => {
    const { params } = this.props;
    return this.context.client.put(`/draft_lunches/${params.draftLunchId}`, { data: { resource: lunch}});
  }

  saveLunch = (lunch) => {
    return submit(lunch, this.saveLunchByCook).then((response) => {
      this.props.showToast('Обед успешно обновлен', 'accept', 'done');
      this.props.loadSuccess('draftLunch', response.resource);
      return response;
    });
  }

  render() {
    const { draftLunch, params } = this.props;
    const initialValues = {...draftLunch, cook_id: params.cookId};
    return (
      <DraftLunchForm initialValues={initialValues} title="Редактирование обеда" sendLabel="Обновить обед"
                      onSubmit={this.saveLunch}/>
    );
  }
}
