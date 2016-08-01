import React, { Component, PropTypes } from 'react';
import ResourcesIndex from 'components/ResourcesIndex/ResourcesIndex';
import { asyncConnect } from 'redux-async-connect';

const perPage = 10;
@asyncConnect([
  {key: 'draftLunches', promise: ({ helpers, store, params }) => {
    const state = store.getState();
    const { query } = state.routing.location;
    const draftLunchesParams = {page: query.page || 1, per_page: perPage, cook_id: params.cookId};
    return helpers.client.get('draft_lunches', {params: draftLunchesParams});
  }}
])
export default class DraftLunches extends Component {
  static propTypes = {
    draftLunches: PropTypes.object,
    user: PropTypes.object,
    location: PropTypes.object,
    params: PropTypes.object.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  render() {
    const { params, draftLunches, location } = this.props;
    const resources = draftLunches ? draftLunches.resources : [];
    const resourcesCount = draftLunches && draftLunches.meta.total;
    const pagination = {resourcesCount, perPage, currentPage: location.query.page};
    const fields = [
      { title: 'ID', value: draftLunch => draftLunch.id },
      { title: 'Фото', type: 'image', value: draftLunch => draftLunch.photos[0].thumb.url },
      { title: 'Описание', value: draftLunch => draftLunch.description },
      { title: 'Цена', value: draftLunch => draftLunch.initial_price + ' грн' }
    ];
    const defaultActions = ['edit'];

    return (
      <ResourcesIndex resources={resources} title="Обеды на модерации" urlName={`/cooks/${params.cookId}/draft_lunches`}
        pagination={pagination} createTitle="Создать обед" fields={fields} defaultActions={defaultActions}/>
    );
  }
}
