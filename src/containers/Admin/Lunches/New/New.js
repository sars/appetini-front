import React, { Component, PropTypes } from 'react';
import LunchForm from 'components/LunchForm/LunchForm';
import { createLunch } from 'redux/modules/common';
import { show as showToast } from 'redux/modules/toast';
import { connect } from 'react-redux';
import submit from '../submit';

@connect(null, { createLunch, showToast })
export default class New extends Component {
  static propTypes = {
    createLunch: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  createLunch(lunch) {
    return submit(lunch, this.props.createLunch).then(response => {
      this.props.showToast('Обед успешно добавлен');
      this.context.router.push('/admin/lunches/' + response.resource.id + '/edit');
    });
  }

  render() {
    return (
      <LunchForm acceptRules title="Создание обеда" sendLabel="Создать обед" onSubmit={::this.createLunch}/>
    );
  }
}
