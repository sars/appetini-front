import React, { Component, PropTypes } from 'react';
import LunchMultipleForm from 'components/LunchMultipleForm/LunchMultipleForm';
import { createLunch } from 'redux/modules/common';
import { show as showToast } from 'redux/modules/toast';
import { connect } from 'react-redux';
import { asyncConnect, loadSuccess } from 'redux-async-connect';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import find from 'lodash/find';
import transform from 'lodash/transform';
import {readyByDate, readyByTime} from 'helpers/readyByFields';

const getLunchItems = (lunchItems, lunchExampleId) => {
  return lunchItems.reduce((array, item) => {
    if (!item.id && item.lunch_example_id === lunchExampleId) {
      return [...array, {
        ...item,
        ready_by_date: readyByDate(item.ready_by_date),
        ready_by_time: readyByTime(item.ready_by_time)
      }];
    }
    return array;
  }, []);
};

const normalizeErrors = (resources, newLunchExamples) => {
  const newLunchExamplesIds = map(newLunchExamples, 'id');
  return transform(resources, (result, resource, i) => { // eslint-disable-line id-length
    if (i === 0 || resources[i - 1].lunch_example_id !== resource.lunch_example_id) {
      while (resource.lunch_example_id !== newLunchExamplesIds.shift()) {
        result.push({});
      }

      result.push({lunchItems: []});
    }

    if (!isEmpty(resource.errors)) result[result.length - 1].lunchItems.push(resource.errors);
  });
};

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
@connect(null, { createLunch, showToast, loadSuccess })
export default class New extends Component {
  static propTypes = {
    createLunch: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    lunchExamples: PropTypes.array.isRequired,
    showToast: PropTypes.func.isRequired,
    loadSuccess: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired
  };

  submitData = (data) => {
    const { lunchExamples } = this.props;
    const resources = [];
    data.lunchExamples.map(lunch => lunch.lunchItems.map(item => { resources.push({lunch_example_id: lunch.id, ...item});}));
    return new Promise((resolve, reject) => {
      this.context.client.post('/lunches/create_multiple', {data: {resources}}).then(response => {
        const errorItemsCount = response.resources.filter(item => !isEmpty(item.errors)).length;

        const newLunchExamples = lunchExamples.map(example => {
          return {...example, ...find(data.lunchExamples, {id: example.id}), lunchItems: getLunchItems(response.resources, example.id)};
        });

        this.props.loadSuccess('lunchExamples', newLunchExamples);
        if (errorItemsCount > 0) {
          const successItemsCount = response.meta.total - errorItemsCount;
          const errorMessage = `Добавлено ${successItemsCount} из ${response.meta.total} обедов. Проверьте правильность заполненых данных!`;

          reject({_error: errorMessage, lunchExamples: normalizeErrors(response.resources, newLunchExamples)});
        } else {
          this.context.router.push('/lunches');
          this.props.showToast('Обеды успешно добавлены');
        }
      }, () => {
        const errorMessage = 'Произошла ошибка! Обеды не были добавлены.';
        reject({_error: errorMessage});
      });
    });
  };

  render() {
    const { lunchExamples } = this.props;
    return (
      <LunchMultipleForm initialValues={{lunchExamples}} lunchExamples={lunchExamples} onSubmit={this.submitData}/>
    );
  }
}
