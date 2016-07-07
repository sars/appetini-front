import React, { Component, PropTypes } from 'react';
import ColumnLayout from 'components/ColumnLayout/ColumnLayout';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { asyncConnect } from 'redux-async-connect';

import styles from './styles.scss';

function racKeyLoaded(store, key) {
  return Boolean(store.getState().reduxAsyncConnect[key]);
}

@asyncConnect([
  {key: 'preferences', promise: ({helpers, store}) => {
    if (!racKeyLoaded(store, 'preferences')) {
      return helpers.client.get('/food_preferences').then(data => {
        return data.resources;
      });
    }}
  }
])
export default class Home extends Component {
  static propTypes = {
    preferences: PropTypes.array.isRequired
  }

  render() {
    const { preferences } = this.props;
    return (
      <ColumnLayout className={styles.root}>
        <Helmet title="Обеды"/>
        <h1 className={styles.title}>Выберите категорию</h1>
        <div className={styles.preferencesWrapper}>
          {preferences.map((preference, idx) => {
            return (
              <div key={idx} className={styles.preferenceWrapper}>
                <Link to={`/lunches?preferences="${preference.id}"`}>
                  <div className={styles.preference}>
                    <div className={styles.imageWrapper}>
                      <img src={preference.image} alt={preference.name}/>
                    </div>
                    <div className={styles.preferenceName}>{preference.name}</div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </ColumnLayout>
    );
  }
}
