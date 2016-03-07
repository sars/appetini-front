import React, { PropTypes } from 'react';
import times from 'lodash/times';
import styles from './styles.scss';

const Boxes = ({boxes}) => {
  return (
    <div className={styles.root}>
      <div className={styles.boxesContent}>
        {boxes && boxes.map(({component, span = 1}, index) =>
          <div className={styles.boxContainer} key={index} span={span}>
            {component}
          </div>
        )}
        {times(5, index => <div key={index} className={styles.boxContainer}></div>)}
      </div>
    </div>
  );
};

Boxes.propTypes = {
  boxes: PropTypes.array
};

export default Boxes;
