import React, { PropTypes } from 'react';
import classNames from 'classnames';
import times from 'lodash/times';
import styles from './styles.scss';

const Photos = ({lunch, className}) => {
  const classes = classNames(styles.root, className);

  return (
    <div className={classes}>
      <div className={styles.mainPhoto}>
        <img src={lunch.photos[0].url} width="300" />
      </div>
      <div className={styles.otherPhotos}>
        <div className={styles.otherPhotosContent}>
          {times(lunch.photos.length - 1, index => {
            return (
              <div className={styles.photoContainer} key={index}>
                <img src={lunch.photos[index + 1].url} />
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
