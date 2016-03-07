import React, { PropTypes } from 'react';
import Card, { CardContent } from 'components/Card/Card';
import SocialButton from 'components/SocialButton/SocialButton';
import StarRating from 'react-star-rating';
import { Link } from 'react-router';
import { FormattedPlural } from 'react-intl';
import classNames from 'classnames';
import styles from './styles.scss';

const Cook = ({cook, className}) => {
  return (
    <Card className={classNames(styles.root, className)}>
      <CardContent>
        <div className={styles.avatarContainer}>
          <img src={cook.main_photo.url}/>
        </div>
        <h3 className={styles.cookName}>
          {cook.first_name} {cook.last_name}
        </h3>
        <div className={styles.ratingContainer}>
          <StarRating name="cook-rating" totalStars={5} editing={false} rating={3} size={18}/>
          <Link className={styles.feedbackLink} to="/">
            {cook.reviews_count}
            &nbsp;
            <FormattedPlural value={cook.reviews_count} one="отзыв" few="отзыва" many="отзывов" other="отзывов"/>
          </Link>
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
            <SocialButton className={styles.socialButton} name="vk"/>
            <SocialButton className={styles.socialButton} name="fb"/>
            <SocialButton className={styles.socialButton} name="instagram"/>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

Cook.propTypes = {
  cook: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default Cook;
