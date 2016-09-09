import moment from 'moment';

export function readyByDate(value) {
  return value ? new Date(value) : undefined;
}

export function readyByTime(value) {
  return value ? moment(value, ['HH:mmZ', moment.ISO_8601]).utc().format('HH:mm\\Z') : undefined;
}
