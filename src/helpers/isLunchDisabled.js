import moment from 'moment';

const isLunchDisabled = (lunch) => ({
  byTime: moment(lunch.ready_by).subtract(lunch.disable_minutes, 'minutes').isBefore(moment())
});

export default isLunchDisabled;
