import React, { Component, PropTypes } from 'react';
import LunchMultipleForm from 'components/LunchMultipleForm/LunchMultipleForm';
import { createLunch } from 'redux/modules/common';
import { show as showToast } from 'redux/modules/toast';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import isEmpty from 'lodash/isEmpty';

@asyncConnect([
  {key: 'lunchExamples', promise: ({ helpers, store }) => {
    const state = store.getState();
    const { lunchExampleIds } = state.routing.location.query;
    if (lunchExampleIds) {
      const lunchExamplesParams = {'ids[]': JSON.parse(lunchExampleIds)};
      return helpers.client.get('/lunch_examples', {params: lunchExamplesParams}).then(response => response.resources);
    }
    return [];
  }}
])
@connect(null, { createLunch, showToast })
export default class New extends Component {
  static propTypes = {
    createLunch: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    lunchExamples: PropTypes.array.isRequired,
    showToast: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired
  };

  submitData = (data) => {
    const resources = [];
    data.lunchExamples.map(lunch => lunch.lunchItems.map(item => { resources.push({lunch_example_id: lunch.id, ...item});}));
    return new Promise((resolve, reject) => {
      this.context.client.post('/lunches/create_multiple', {data: {resources}}).then(response => {
        const errorItemsCount = response.resources.filter(item => !isEmpty(item.errors)).length;
        if (errorItemsCount) {
          const successItemsCount = response.meta.total - errorItemsCount;
          const errorMessage = `Добавлено ${successItemsCount} из ${response.meta.total} обедов. Проверьте правильность заполненых данных!`;
          reject({_error: errorMessage});
        } else {
          this.context.router.push('/lunches');
          this.props.showToast('Обеды успешно добавлены');
        }
      }, () => {
        const errorMessage = 'Произошла ошибка! Обеды не были добавлены.';
        reject({_error: errorMessage});
      });
    });
  }

  render() {
    const { lunchExamples } = this.props;
    return (
      <LunchMultipleForm initialValues={{lunchExamples}} lunchExamples={lunchExamples} onSubmit={this.submitData}/>
    );
  }
}
