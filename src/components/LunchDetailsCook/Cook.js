import React, { PropTypes, Component } from 'react';
import Button from 'components/Button/Button';
import Card, { CardContent } from 'components/Card/Card';
import SocialButton from 'components/SocialButton/SocialButton';
import StarRating from 'react-star-rating';
import { Link } from 'react-router';
import { FormattedPlural } from 'react-intl';
import ImagesPreview from 'components/ImagesPreview/ImagesPreview';
import classNames from 'classnames';
import tooltip from 'react-toolbox/lib/tooltip';
import Modal from 'components/Modal/Modal';
import Reviews from 'components/Reviews/Reviews';
import round from 'lodash/round';
import { getReviews } from 'redux/modules/common';
import { connect } from 'react-redux';
import styles from './styles.scss';

const TooltipLink = tooltip(Link);
@connect(null, { getReviews })
export default class Cook extends Component {
  static propTypes = {
    cook: PropTypes.object.isRequired,
    hideExternalLinks: PropTypes.bool,
    className: PropTypes.string,
    getReviews: PropTypes.func
  };

  state = {
    showReviews: false,
    reviews: {}
  }

  componentDidMount() {
    const { cook } = this.props;
    this.props.getReviews(cook.id).then(response => {
      this.setState({
        reviews: response
      });
    });
  }

  render() {
    const {cook, cook: { user: { facebook, vkontakte, instagram } }, hideExternalLinks, className} = this.props;
    const { showReviews, reviews } = this.state;
    return (
      <div>
        <Modal.Dialog active={showReviews} title="Отзывы о кулинаре" onClose={() => this.setState({showReviews: false})}>
          {reviews.resources && <Reviews reviews={reviews} cook={cook}/>}
        </Modal.Dialog>
        <Card className={classNames(styles.root, className)}>
          <CardContent>
            <div className={styles.avatarContainer}>
              <ImagesPreview image={cook.main_photo} currentImageId={0}/>
            </div>
            <h3 className={styles.cookName}>
              {cook.full_name}
            </h3>
            <div className={styles.ratingContainer}>
              <StarRating name="cook-rating" totalStars={5} editing={false} rating={round(cook.rating)} size={18}/>
              <span className={styles.feedbackLink} onClick={() => this.setState({showReviews: true})}>
                {cook.reviews_count}
                &nbsp;
                <FormattedPlural value={cook.reviews_count} one="отзыв" few="отзыва" many="отзывов" other="отзывов"/>
              </span>
            </div>
            { cook.sanitary_book_photos && cook.sanitary_book_photos.length > 0 &&
            <ImagesPreview images={cook.sanitary_book_photos} currentImageId={0} template={(onClick) =>
                           <div className={styles.sanitaryBookContainer}>
                            <div className={styles.sanitaryBook}>
                              <i className="fa fa-check"/>
                              &nbsp;
                              <span className="pointer" onClick={onClick}>Санитарная книжка </span>
                              <TooltipLink label="Санитарная книжка" to="#" className={styles.sanitaryHelp}
                                           tooltip="Санитарная книжка еще действует">
                                <i className="fa fa-question-circle"/>
                              </TooltipLink>
                            </div>
                        </div>}/>
            }
            { cook.other_photos && cook.other_photos.length > 0 &&
              <div className={styles.otherPhotosContainer}>
                <h3>Фотографии кухни</h3>
                <div className={styles.otherPhotos}>
                  {cook.other_photos.map((photo, index) =>
                    <div className={styles.otherPhotoContainer} key={index}>
                      <ImagesPreview images={cook.other_photos} currentImageId={index}/>
                    </div>
                  )}
                </div>
              </div>
            }
            {(vkontakte || facebook || instagram) && <div className={styles.socialContainer}>
              <h3>В соцсетях</h3>
              <div className={styles.socialButtons}>
                {vkontakte && <SocialButton target="_blank" className={styles.socialButton} name="vk"
                                            href={'http://vk.com/id' + vkontakte}/>}
                {facebook && <SocialButton target="_blank" className={styles.socialButton} name="fb"
                                           href={'http://facebook.com/profile.php?id=' + facebook}/>}
                {instagram && <SocialButton target="_blank" className={styles.socialButton} name="instagram"
                                            href={'http://instagram.com/' + instagram}/>}
              </div>
            </div>}

            {!hideExternalLinks && <Link to={`/lunches?cook_id="${cook.id}"`}>
              <Button flat outlined label={`Все обеды ${cook.full_name_genitive}`}/>
            </Link>}
          </CardContent>
        </Card>
      </div>
    );
  }
}
