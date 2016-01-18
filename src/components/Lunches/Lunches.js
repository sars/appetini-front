import React, { PropTypes } from 'react';
import _ from 'lodash'; // eslint-disable-line id-length
import moment from 'moment';
import Lunch from 'components/Lunch/Lunch';

const Lunches = ({lunches}) => {
  const styles = require('./Lunches.scss');
  const preparedLunches = _.chain(lunches.data.resources).sortBy('ready_by').groupBy('ready_by').value();

  return (
    <div className={styles.lunches}>
      {preparedLunches && Object.keys(preparedLunches).map((date, index) => {
        const mDate = moment(date);
        const nextDate = moment(date).add(30, 'minutes');

        return (
          <div className={styles.lunchesGroup} key={index}>
            <h4>
              <span>{mDate.format('dddd, DD.MM.YYYY, HH:mm-')}</span>
              <span>{nextDate.format('HH:mm')}</span>
            </h4>
            {preparedLunches[date].map(lunch =>
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
