import React, { Component, PropTypes } from 'react';
import CookForm from 'components/CookForm/CookForm';
import { createCook } from 'redux/modules/common';
import { show as showToast } from 'redux/modules/toast';
import { connect } from 'react-redux';
import submit from '../submit';

@connect(null, { createCook, showToast })
export default class New extends Component {
  static propTypes = {
    createCook: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  create(cook) {
    return submit(cook, this.props.createCook).then(response => {
      this.props.showToast('Кулинар успешно добавлен');
      this.context.router.push('/');
      return response;
    });
  }

  render() {
    return (
      <CookForm title="Создание кулинара" sendLabel="Создать кулинара" onSubmit={::this.create}/>
    );
  }
}
