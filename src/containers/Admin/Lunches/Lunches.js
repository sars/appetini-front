import React, { Component, PropTypes } from 'react';
import { asyncConnect } from 'redux-async-connect';
import { request as requestLunches } from 'helpers/lunchesFilters';

import ResourcesIndex from 'components/ResourcesIndex/ResourcesIndex';

@asyncConnect([
  {key: 'adminLunches', promise: requestLunches}
])
export default class Lunches extends Component {
  static propTypes = {
    adminLunches: PropTypes.object.isRequired
  };

  render() {
    const { resources: lunches } = this.props.adminLunches;
    const fields = [
      { title: 'ID', value: lunch => lunch.id },
      { title: 'Фото', type: 'image', value: lunch => lunch.photos[0].thumb.url },
      { title: 'Кулинар', value: lunch => `${lunch.cook.first_name} ${lunch.cook.last_name}` }
    ];

    return (<ResourcesIndex resources={lunches} title="Обеды" createTitle="Создать обед"
                           urlName="lunches" fields={fields}/>);
  }
}
