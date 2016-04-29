import moment from 'moment';

export const getParsedDate = (date) => {
  return new Date(JSON.parse(date));
};

export const getParams = (location) => {
  if (location.query.date) {
    return {eq_date: location.query.date};
  }
  return {gt_date: moment().utc().format()};
};
