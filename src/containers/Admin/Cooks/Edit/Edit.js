import React, { Component, PropTypes } from 'react';
import CookForm from 'components/CookForm/CookForm';
import { updateCook } from 'redux/modules/common';
import { show as showToast } from 'redux/modules/toast';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import submit from '../submit';

@asyncConnect([
  {key: 'cook', promise: ({params, helpers}) => helpers.client.get('/cooks/' + params.cookId)}
])
@connect(null, { updateCook, showToast })
export default class Edit extends Component {
  static propTypes = {
    cook: PropTypes.object.isRequired,
    updateCook: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired
  };

  update(cook) {
    return submit(cook, this.props.updateCook).then(response => {
      this.props.showToast('Кулинар успешно обновлен');
      return response;
    });
  }

  render() {
    return (
      <CookForm initialValues={this.props.cook.resource} onSubmit={::this.update}
                title="Редактирование кулинара" sendLabel="Обновить кулинара" />
    );
  }
}
