import React, { Component, PropTypes } from 'react';
import ResourcesIndex from 'components/ResourcesIndex/ResourcesIndex';
import { asyncConnect } from 'redux-async-connect';
import { show as showToast } from 'redux/modules/toast';
import { connect } from 'react-redux';
import moment from 'moment';

const perPage = 10;
@asyncConnect([
  {key: 'lunchExamples', promise: ({ helpers, store, params }) => {
    const state = store.getState();
    const { query } = state.routing.location;
    const lunchExamplesParams = {page: query.page || 1, per_page: perPage, cook_id: params.cookId};
    return helpers.client.get('/lunch_examples', {params: lunchExamplesParams});
  }}
])
@connect(null, { showToast })
export default class Examples extends Component {
  static propTypes = {
    lunchExamples: PropTypes.object,
    user: PropTypes.object,
    location: PropTypes.object,
    showToast: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired
  };

  render() {
    const { lunchExamples, location } = this.props;
    const resources = lunchExamples ? lunchExamples.resources : [];
    const resourcesCount = lunchExamples && lunchExamples.meta.total;
    const pagination = {resourcesCount, perPage, currentPage: location.query.page};
    const fields = [
      { title: 'ID', value: lunchExample => lunchExample.id },
      { title: 'Фото', type: 'image', value: lunchExample => lunchExample.photos[0].thumb.url },
      { title: 'Описание', value: lunchExample => lunchExample.description },
      { title: 'Дата создания', value: lunchExample => moment(lunchExample.created_at).format('DD/MM/YYYY') },
      { title: 'Цена', value: lunchExample => Number(lunchExample.initial_price) + ' грн' }
    ];
    const defaultActions = ['edit'];
    const actions = [{
      linkTo: (id) => `/admin/lunches/new?lunchExampleId=${id}`,
      title: 'Создать обед'
    }];

    return (
      <ResourcesIndex resources={resources} title="Шаблоны обедов" urlName={'/admin/lunch_examples'}
                      pagination={pagination} createTitle="Создать шаблон" fields={fields}
                      customActions={actions} defaultActions={defaultActions}/>
    );
  }
}
