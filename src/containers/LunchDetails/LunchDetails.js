import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import DeliveryPeriod from 'components/DeliveryPeriod/DeliveryPeriod';
import StarRating from 'react-star-rating';
import { Link } from 'react-router';
import Card, { CardContent } from 'components/Card/Card';
import Layout2Col from 'components/Layout2Col/Layout2Col';
import SocialButton from 'components/SocialButton/SocialButton';

@asyncConnect({
  lunch: (params, helpers) => helpers.client.get('/lunches/' + params.lunchId)
})
@connect(state => ({auth: state.auth}))
export default class LunchDetails extends Component {
  static propTypes = {
    lunch: PropTypes.object.isRequired
  };

  render() {
    const styles = require('./LunchDetails.scss');
    const {resource: lunch} = this.props.lunch.data;
    const {cook} = lunch;

    const leftSidebar = (
      <Card className={styles.leftSidebarCard}>
        <CardContent>
          <div className={styles.avatarContainer}>
            <img src={cook.main_photo.url} width="240" height="240" />
          </div>
          <h3 className={styles.cookName}>
            {cook.first_name} {cook.last_name}
          </h3>
          <div className={styles.ratingContainer}>
            <StarRating className={styles.starRating} name="cook-rating" totalStars={5} editing={false} rating={3} size={18} />
            <Link className={styles.feedback} to="/">31 отзыв</Link>
          </div>
          <div className={styles.sanitaryBookContainer}>
            <div className={styles.sanitaryBook}>
              <i className="fa fa-book" />
              &nbsp;
              <Link to="/">
                Санитарная книжка
              </Link>
            </div>
          </div>
          <div className={styles.otherPhotosContainer}>
            <h3>Фотографии кухни</h3>
            <div className={styles.otherPhotos}>
              {cook.other_photos.map((photo, index) =>
                <div className={styles.otherPhotoContainer} key={index}>
                  <img src={photo.thumb.url} />
                </div>
              )}
            </div>
          </div>
          <div className={styles.socialContainer}>
            <h3>В соцсетях</h3>
            <div className={styles.socialButtons}>
              <SocialButton className={styles.socialButton} name="vk" size="medium" />
              <SocialButton className={styles.socialButton} name="fb" size="medium" />
              <SocialButton className={styles.socialButton} name="instagram" size="medium" />
            </div>
          </div>
        </CardContent>
      </Card>
    );

    return (
      <Layout2Col leftSidebar={leftSidebar}>
        <div>
          <h1>Обед от {cook.first_name} {cook.last_name}</h1>
          <DeliveryPeriod time={lunch.ready_by} />
        </div>
        <div className="photos">
          {lunch.photos.map((photo, index) => {
            return <img key={index} src={photo.url} width="300" />;
          })}
        </div>
        <div className="composition">
          <h3>Состав обеда</h3>
          <ul>
            {lunch.dishes.map(dish => {
              return (
                <li key={dish.id}>
                  <span>{dish.name}</span>
                  <span>{dish.size}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </Layout2Col>
    );
  }
}
