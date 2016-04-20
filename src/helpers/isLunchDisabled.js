import moment from 'moment';

const isLunchDisabled = (lunch) => ({
  byCount: lunch.available_count === 0,
  byTime: moment(lunch.ready_by).subtract(lunch.disable_minutes, 'minutes').isBefore(moment())
});

export default isLunchDisabled;
