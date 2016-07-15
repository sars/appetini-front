import React, { Component, PropTypes } from 'react';
import Button from 'components/Button/Button';
import { asyncConnect } from 'redux-async-connect';
import { loadSuccess } from 'redux-async-connect';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import StarRating from 'react-star-rating';
import { FormattedPlural } from 'react-intl';
import ColumnLayout from 'components/ColumnLayout/ColumnLayout';
import styles from './styles.scss';

@asyncConnect([
  {key: 'cooks', promise: ({helpers}) => {
    return helpers.client.get('/cooks', {params: {page: 1, per_page: 12}})
      .then(response => response);}
  }
])
@connect(null, { loadSuccess })
export default class Cooks extends Component {
  static propTypes = {
    cooks: PropTypes.object.isRequired,
    loadSuccess: PropTypes.func.isRequired
  }

  static contextTypes = {
    client: PropTypes.object.isRequired
  }

  state = {
    page: 1
  }

  loadMoreHandle = () => {
    const { cooks } = this.props;
    const { page } = this.state;
    const params = {
      'per_page': 12,
      'page': page
    };
    this.setState({
      isInfiniteLoading: true
    });
    this.context.client.get('/cooks', {params})
      .then(cooksFromServer => {
        const newCooks = {...cooks, resources: [...cooks.resources, ...cooksFromServer.resources]};
        this.props.loadSuccess('cooks', newCooks);
        this.setState({
          page: page,
          isInfiniteLoading: false
        });
      });
  };

  render() {
    const { cooks } = this.props;
    const { isInfiniteLoading } = this.state;
    return (
      <ColumnLayout className={styles.root}>
        <h1 className={styles.title}>Наши кулинары и рестораны</h1>
        <div className={styles.cooksWrapper}>
          {cooks.resources.map((cook, idx) => {
            return (
              <div key={idx} className={styles.cookWrapper}>
                <div className={styles.cook}>
                  <Link className={styles.cookLink} to={`/lunches?cook_id="${cook.id}"`}>
                    <img src={cook.main_photo.thumb.url} alt={cook.full_name_genitive}/>
                    <div className={styles.cookInfo}>
                      <div>{cook.full_name_genitive}</div>
                      <div className={styles.rating}>
                        <StarRating name="cook-rating" totalStars={5}
                                    editing={false} rating={cook.rating} size={12}/>
                      </div>
                      <div className={styles.feedback}>
                        {cook.reviews_count}
                        &nbsp;
                        <FormattedPlural value={cook.reviews_count} one="отзыв" few="отзыва" many="отзывов"
                                         other="отзывов"/>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        {cooks.resources.length < cooks.meta.total &&
          <div className={styles.moreBtnWrapper}>
            <Button flat accent onClick={::this.loadMoreHandle} disabled={isInfiniteLoading}
                    label={isInfiniteLoading ? 'Загрузка...' : 'Посмотреть еще'}/>
          </div>
        }
      </ColumnLayout>
    );
  }
}
