import React, { Component, PropTypes } from 'react';
import LunchForm from 'components/LunchForm/LunchForm';
import { updateLunch } from 'redux/modules/common';
import { show as showToast } from 'redux/modules/toast';
import { connect } from 'react-redux';
import { asyncConnect, loadSuccess } from 'redux-async-connect';
import { getLunch } from 'helpers/lunches';
import submit from '../submit';

@asyncConnect([
  {key: 'lunch', promise: getLunch(true)}
])
@connect(null, { updateLunch, showToast, loadSuccess })
export default class Edit extends Component {
  static propTypes = {
    lunch: PropTypes.object.isRequired,
    updateLunch: PropTypes.func.isRequired,
    loadSuccess: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired
  };

  updateLunch(lunch) {
    return submit(lunch, this.props.updateLunch).then(response => {
      this.props.showToast('Обед успешно обновлен');
      this.props.loadSuccess('lunch', response.resource);
      return response;
    });
  }

  render() {
    const { lunch } = this.props;
    return (
      <LunchForm initialValues={lunch} onSubmit={::this.updateLunch}
                 title="Редактирование обеда" sendLabel="Обновить обед"/>
    );
  }
}
