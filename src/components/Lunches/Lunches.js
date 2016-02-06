import React, { PropTypes } from 'react';
import sortBy from 'lodash/sortBy';
import groupBy from 'lodash/groupBy';
import Lunch from 'components/Lunch/Lunch';
import DeliveryPeriod from 'components/DeliveryPeriod/DeliveryPeriod';

const Lunches = ({lunches}) => {
  const styles = require('./Lunches.scss');
  const preparedLunches = groupBy(sortBy(lunches.data.resources, 'ready_by'), 'ready_by');

  return (
    <div className={styles.lunches}>
      {preparedLunches && Object.keys(preparedLunches).map((datetime, index) => {
        return (
          <div className={styles.lunchesGroup} key={index}>
            <h4>
              <DeliveryPeriod time={datetime} />
            </h4>
            <div className={styles.lunchesGroupContent}>
              {preparedLunches[datetime].map(lunch =>
                <div className={styles.lunchContainer} key={lunch.id}>
                  <Lunch className={styles.lunch} lunch={lunch} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

Lunches.propTypes = {
  lunches: PropTypes.object
};

export default Lunches;
