import React, { PropTypes } from 'react';
import _ from 'lodash'; // eslint-disable-line id-length
import Lunch from 'components/Lunch/Lunch';
import DeliveryPeriod from 'components/DeliveryPeriod/DeliveryPeriod';

const Lunches = ({lunches}) => {
  const styles = require('./Lunches.scss');
  const preparedLunches = _.chain(lunches.data.resources).sortBy('ready_by').groupBy('ready_by').value();

  return (
    <div className={styles.lunches}>
      {preparedLunches && Object.keys(preparedLunches).map((datetime, index) => {
        return (
          <div className={styles.lunchesGroup} key={index}>
            <h4>
              <DeliveryPeriod time={datetime} />
            </h4>
            {preparedLunches[datetime].map(lunch =>
              <Lunch className={styles.lunch} key={lunch.id} lunch={lunch} />
            )}
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
