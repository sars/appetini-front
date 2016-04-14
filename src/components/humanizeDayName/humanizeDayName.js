import moment from 'moment';

const humanizeDayName = (date, format) => {
  const now = moment().format('YYYY-MM-DD');
  const lunchDate = moment(date).format('YYYY-MM-DD');
  if (lunchDate === now) {
    return 'сегодня';
  }
  if (lunchDate === moment(now).add(1, 'day').format('YYYY-MM-DD')) {
    return 'завтра';
  }
  return moment(date).format(format);
};

export default humanizeDayName;
