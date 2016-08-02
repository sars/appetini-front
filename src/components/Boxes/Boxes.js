import React, { PropTypes } from 'react';
import times from 'lodash/times';
import styles from './styles.scss';
import classNames from 'classnames/bind';

const Boxes = ({boxes, cssClass}) => {
  const cx = classNames.bind(styles);
  return (
    <div className={styles.root}>
      <div className={styles.boxesContent}>
        {boxes && boxes.map(({component, span = 1}, index) =>
          <div className={cx('boxContainer', cssClass, `box-number-${index}`)} key={index} span={span}>
            {component}
          </div>
        )}
        {times(5, index => <div key={index} className={styles.boxContainer}></div>)}
      </div>
    </div>
  );
};

Boxes.propTypes = {
  boxes: PropTypes.array,
  cssClass: PropTypes.string
};

export default Boxes;
