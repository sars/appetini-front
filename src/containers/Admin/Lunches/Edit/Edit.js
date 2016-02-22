import React, { Component, PropTypes } from 'react';
import LunchForm from 'components/LunchForm/LunchForm';
import { updateLunch } from 'redux/modules/common';
import { show as showToast } from 'redux/modules/toast';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import submit from '../submit';

@asyncConnect([
  {key: 'lunch', promise: ({params, helpers}) => helpers.client.get('/lunches/' + params.lunchId)}
])
@connect(null, { updateLunch, showToast })
export default class Edit extends Component {
  static propTypes = {
    lunch: PropTypes.object.isRequired,
    updateLunch: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired
  };

  updateLunch(lunch) {
    return submit(lunch, this.props.updateLunch).then(response => {
      this.props.showToast('Обед успешно обновлен');
      return response;
    });
  }

  render() {
    return (
      <LunchForm initialValues={this.props.lunch.resource} onSubmit={::this.updateLunch}
                 title="Редактирование обеда" sendLabel="Обновить обед"/>
    );
  }
}
