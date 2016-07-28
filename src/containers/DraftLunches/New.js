import React, { Component, PropTypes } from 'react';
import DraftLunchForm from 'components/LunchForm/DraftLunchForm';
import { show as showToast } from 'redux/modules/toast';
import { connect } from 'react-redux';
import submit from './../Admin/Lunches/submit';

@connect(null, { showToast })
export default class New extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    showToast: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired
  };

  saveLunchByCook = (lunch) => {
    return this.context.client.post('/draft_lunches', { data: { resource: lunch}});
  }

  saveLunch = (lunch) => {
    const { showToast, params } = this.props; // eslint-disable-line no-shadow
    return submit(lunch, this.saveLunchByCook).then((response) => {
      showToast('Обед успешно добавлен', 'accept', 'done');
      this.context.router.push(`/cooks/${params.cookId}/draft_lunches`);
      return response;
    });
  }

  render() {
    const { params } = this.props;
    const initialValues = {cook_id: params.cookId};
    return (
      <DraftLunchForm initialValues={initialValues} title="Создание обеда" acceptRules sendLabel="Создать обед"
                 onSubmit={this.saveLunch}/>
    );
  }
}
