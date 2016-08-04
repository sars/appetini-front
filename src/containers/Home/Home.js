import React, { Component, PropTypes } from 'react';
import ColumnLayout from 'components/ColumnLayout/ColumnLayout';
import { Link } from 'react-router';
import Button from 'components/Button/Button';
import Helmet from 'react-helmet';
import { asyncConnect } from 'redux-async-connect';
import TeamOffer from 'components/TeamOffer/TeamOffer';
import Boxes from 'components/Boxes/Boxes';

import styles from './styles.scss';

function racKeyLoaded(store, key) {
  return Boolean(store.getState().reduxAsyncConnect[key]);
}

@asyncConnect([
  {key: 'offers', promise: ({helpers}) => {
    return helpers.client.get('/team_offers', {params: {page: 1, per_page: 4, disable_by_gt: new Date}});
  }},
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
    offers: PropTypes.object.isRequired,
    preferences: PropTypes.array.isRequired
  }

  render() {
    const { offers, preferences } = this.props;
    const boxes = offers.resources && [
      ...offers.resources.map(offer => ({
        component: <TeamOffer item={offer} near={true}/>
      }))
    ];

    return (
      <ColumnLayout className={styles.root}>
        {!!offers.resources.length && <div className={styles.teamOffersWrapper}>
          <h1 className={styles.title}>Корпоративные обеды по 33грн</h1>
          <Boxes boxes={boxes} cssClass="small-box"/>
          <Link to="/team_offers">
            <Button flat outlined label="Смотреть все"/>
          </Link>
        </div>}
        <Helmet title="Обеды"/>
        <h1 className={styles.title}>Другие обеды</h1>
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
          <Link to="/lunches">
            <Button flat outlined label="Смотреть все"/>
          </Link>
        </div>
      </ColumnLayout>
    );
  }
}
