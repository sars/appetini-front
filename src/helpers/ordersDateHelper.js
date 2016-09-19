import moment from 'moment';

export const getParsedDate = (date) => {
  return new Date(JSON.parse(date));
};

export const getParams = (location) => {
  const dates = location.query;
  if (dates.lt_date || dates.gt_date) {
    return {
      gt_date: dates.gt_date || moment().utc().format(),
      lt_date: dates.lt_date
    };
  }
  return {eq_date: dates.eq_date || moment().utc().format()};
};
