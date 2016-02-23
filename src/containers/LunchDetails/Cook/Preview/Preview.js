import React, { PropTypes } from 'react';
import Button from 'components/Button/Button';
import classNames from 'classnames';
import styles from './styles.scss';

const Preview = ({cook, className, ...other}) => {
  return (
    <div className={classNames(styles.root, className)}>
      <span className={styles.label}>Для Вас готовит:</span>
      <Button flat outlined className={classNames(styles.button)} {...other}>
        <div className={styles.avatar}>
          <img src={cook.main_photo.thumb.url}/>
        </div>
        <div className={styles.name}>
          {cook.first_name} {cook.last_name}
        </div>
      </Button>
    </div>
  );
};

Preview.propTypes = {
  cook: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default Preview;
