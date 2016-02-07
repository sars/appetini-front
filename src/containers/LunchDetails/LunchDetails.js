import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import DeliveryPeriod from 'components/DeliveryPeriod/DeliveryPeriod';
import StarRating from 'react-star-rating';
import { Link } from 'react-router';
import Card, { CardContent } from 'components/Card/Card';
import Layout2Col from 'components/Layout2Col/Layout2Col';
import SocialButton from 'components/SocialButton/SocialButton';
import times from 'lodash/times';
import { Button } from 'react-toolbox/lib/button';
import classNames from 'classnames';
import Lunches from 'components/Lunches/Lunches';

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
    const buttonStyles = require('components/button/button.scss');
    const otherLunches = {data: {resources: times(5, index => ({...lunch, id: index}))}};

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
          <div className={styles.otherCookPhotosContainer}>
            <h3>Фотографии кухни</h3>
            <div className={styles.otherCookPhotos}>
              {cook.other_photos.map((photo, index) =>
                <div className={styles.otherCookPhotoContainer} key={index}>
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
      <div>
        <Layout2Col leftSidebar={leftSidebar}>
          <div className={styles.header}>
            <h1>Обед от {cook.first_name} {cook.last_name}</h1>
            <DeliveryPeriod className={styles.deliveryPeriod} time={lunch.ready_by} />
          </div>
          <div className={styles.photos}>
            <div className={styles.mainPhoto}>
              <img src={lunch.photos[0].url} width="300" />
            </div>
            <div className={styles.otherPhotos}>
              <div className={styles.otherPhotosContent}>
                {times(lunch.photos.length - 1, index => {
                  return (
                    <div className={styles.photoContainer} key={index}>
                      <img src={lunch.photos[index + 1].url} width="300" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <Card className={styles.dishAndPriceCard}>
            <CardContent>
              <div className={styles.dishesContainer}>
                <h3>Состав обеда:</h3>
                <ul>
                  {lunch.dishes.map(dish => {
                    return (
                      <li className={styles.dish} key={dish.id}>
                        <span>{dish.name}</span>
                        <span className={styles.dishDots} />
                        <span className={styles.dishSize}>{dish.size}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className={styles.priceContainer}>
                <div className={styles.price}>
                  <span className={styles.priceAmount}>280</span>
                  <span className={styles.priceCurrency}>грн</span>
                </div>
                <div className={styles.buyContainer}>
                  <Button className={classNames(buttonStyles.flat, buttonStyles.accent)} label="Купить сейчас" accent />
                </div>
              </div>
            </CardContent>
          </Card>
        </Layout2Col>
        <div className={styles.otherLunches}>
          <h2>Обеды на другое время от {cook.first_name} {cook.last_name}</h2>
          <Lunches lunches={otherLunches} columns={3} />
          <div className={styles.moreContainer}>
            <Button className={classNames(styles.moreButton, buttonStyles.flat, buttonStyles.outlined)} label="Показать еще" />
          </div>
        </div>
      </div>
    );
  }
}
