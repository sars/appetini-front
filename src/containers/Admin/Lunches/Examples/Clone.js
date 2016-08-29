import React, { Component, PropTypes } from 'react';
import LunchExampleForm from 'components/LunchForm/LunchExampleForm';
import { createLunch } from 'redux/modules/common';
import { show as showToast } from 'redux/modules/toast';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import cloneLunch from 'helpers/cloneLunch';
import submit, { createLunchExample } from '../submit';

@asyncConnect([
  {key: 'lunchExample', promise: ({helpers, params}) => {
    return helpers.client.get(`/lunch_examples/${params.lunchExampleId}`).then(response => response.resource);
  }}
])
@connect(null, { createLunch, showToast })
export default class Clone extends Component {
  static propTypes = {
    lunchExample: PropTypes.object.isRequired,
    createLunch: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired
  };

  state = {
    lunchExampleFields: {}
  };

  componentDidMount() {
    const { lunchExample } = this.props;
    const { client } = this.context;
    if ( !lunchExample ) {
      this.props.showToast('Ошибка загрузки шаблона обеда', 'warning', 'error');
      return;
    }
    cloneLunch(lunchExample, client)
      .then(lunchExampleFields => {
        this.setState({lunchExampleFields});
      });
  }

  createLunch(lunch) {
    return submit(lunch, createLunchExample(this.context.client)).then(response => {
      this.props.showToast('Обед успешно добавлен');
      this.context.router.push('/admin/lunch_examples/' + response.resource.id + '/edit');
    });
  }

  render() {
    const { lunchExampleFields } = this.state;
    return (
      <LunchExampleForm acceptRules initialValues={lunchExampleFields} onSubmit={::this.createLunch}
                        title="Создание обеда" sendLabel="Создать обед"/>
    );
  }
}
