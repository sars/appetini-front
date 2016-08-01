import React, { Component, PropTypes } from 'react';
import ColumnLayout from 'components/ColumnLayout/ColumnLayout';
import { asyncConnect, loadSuccess } from 'redux-async-connect';
import TeamOffer from 'components/TeamOffer/TeamOffer';
import Boxes from 'components/Boxes/Boxes';
import Button from 'components/Button/Button';
import { connect } from 'react-redux';
import styles from './styles.scss';

@asyncConnect([
  {key: 'offers', promise: ({helpers}) => helpers.client.get('/team_offers', {params: {page: 1, per_page: 10}})}
])
@connect(null, { loadSuccess })
export default class TeamOffers extends Component {
  static propTypes = {
    offers: PropTypes.object.isRequired,
    loadSuccess: PropTypes.func.isRequired
  };

  static contextTypes = {
    client: PropTypes.object.isRequired
  };

  state = {
    page: 1
  };

  loadMoreHandle() {
    const { offers } = this.props;
    const page = (this.state.page || 1) + 1;
    const params = {
      page: page,
      per_page: 10
    };

    this.setState({
      isInfiniteLoading: true
    });
    this.context.client.get('/team_offers', {params})
      .then(offersFromServer => {
        const newOffers = {...offers, resources: [...offers.resources, ...offersFromServer.resources]};
        this.props.loadSuccess('offers', newOffers);
        this.setState({
          page: page,
          isInfiniteLoading: false
        });
      });
  }

  render() {
    const { offers } = this.props;
    const { isInfiniteLoading } = this.state;
    const allOffersLoaded = offers.resources.length >= offers.meta.total;
    const boxes = offers.resources && [
      ...offers.resources.map(offer => ({
        component: <TeamOffer offer={offer}/>
      }))
    ];

    return (
      <ColumnLayout className={styles.root}>
        <h1 className={styles.title}>Корпоративные обеды</h1>
        {offers.resources.length ? <Boxes boxes={boxes}/> : <h3 className={styles.title}>Нет корпоративных обедов</h3>}
        {!allOffersLoaded && offers.resources.length &&
          <div className={styles.loadMoreWrapper}>
            <Button flat accent onClick={::this.loadMoreHandle} disabled={isInfiniteLoading}
                    label={isInfiniteLoading ? 'Загрузка...' : 'Посмотреть еще'}/>
          </div>
        }
      </ColumnLayout>
    );
  }
}
