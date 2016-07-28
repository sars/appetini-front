import React, { Component, PropTypes } from 'react';
import ResourcesIndex from 'components/ResourcesIndex/ResourcesIndex';
import { asyncConnect } from 'redux-async-connect';

@asyncConnect([
  {key: 'draftLunches', promise: ({ helpers, params }) => helpers.client.get('draft_lunches', { params: {cook_id: params.cookId} })}
])
export default class DraftLunches extends Component {
  static propTypes = {
    draftLunches: PropTypes.object,
    user: PropTypes.object,
    params: PropTypes.object.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  render() {
    const { params, draftLunches } = this.props;
    const resources = draftLunches ? draftLunches.resources : [];
    const fields = [
      { title: 'ID', value: draftLunch => draftLunch.id },
      { title: 'Фото', type: 'image', value: draftLunch => draftLunch.photos[0].thumb.url },
      { title: 'Описание', value: draftLunch => draftLunch.description },
      { title: 'Цена', value: draftLunch => draftLunch.initial_price }
    ];
    const defaultActions = ['edit'];

    return (
      <ResourcesIndex resources={resources} title="Обеды на модерации" urlName={`/cooks/${params.cookId}/draft_lunches`}
                      createTitle="Создать обед" fields={fields} defaultActions={defaultActions}/>
    );
  }
}
