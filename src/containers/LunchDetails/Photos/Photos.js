import React, { PropTypes } from 'react';
import classNames from 'classnames';
import times from 'lodash/times';
import styles from './styles.scss';
import ImagesPreview from 'components/ImagesPreview/ImagesPreview';

const Photos = ({lunch, className}) => {
  const classes = classNames(styles.root, className);

  return (
    <div className={classes}>
      <div className={styles.mainPhoto}>
        <ImagesPreview images={lunch.photos} currentImageId={0}/>
      </div>
      <div className={styles.otherPhotos}>
        <div className={styles.otherPhotosContent}>
          {times(lunch.photos.length - 1, index => {
            return (
              <div className={styles.photoContainer} key={index}>
                <ImagesPreview images={lunch.photos} currentImageId={index + 1}/>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

Photos.propTypes = {
  lunch: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default Photos;
