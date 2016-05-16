import React, { Component, PropTypes } from 'react';
import LunchForm from 'components/LunchForm/LunchForm';
import { createLunch } from 'redux/modules/common';
import { show as showToast } from 'redux/modules/toast';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import { getLunch } from 'helpers/lunches';
import cloneLunch from 'helpers/cloneLunch';
import submit from '../submit';

@asyncConnect([
  {key: 'lunch', promise: getLunch()}
])
@connect(null, { createLunch, showToast })
export default class Clone extends Component {
  static propTypes = {
    lunch: PropTypes.object.isRequired,
    createLunch: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired
  };

  state = {
    lunchFields: {}
  };

  componentDidMount() {
    const { lunch } = this.props;
    const { client } = this.context;
    cloneLunch(lunch, client)
      .then(lunchFields => {
        this.setState({lunchFields});
      });
  }

  createLunch(lunch) {
    return submit(lunch, this.props.createLunch).then(response => {
      this.props.showToast('Обед успешно добавлен');
      this.context.router.push('/admin/lunches/' + response.resource.id + '/edit');
    });
  }

  render() {
    const { lunchFields } = this.state;
    return (
      <LunchForm acceptRules initialValues={lunchFields} onSubmit={::this.createLunch}
                 title="Создание обеда" sendLabel="Создать обед"/>
    );
  }
}
