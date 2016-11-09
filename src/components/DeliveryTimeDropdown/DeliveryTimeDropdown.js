import React from 'react';
import Dropdown from 'components/Dropdown/Dropdown';
import moment from 'moment';

const getTimeInUTC = (time) => {
  const timezoneOffset = new Date().getTimezoneOffset()/60;
  return moment.utc(`1994-01-26T${time}:00`).utcOffset(timezoneOffset).format('HH:mm')
};

const deliveryTimeOptions = [
  { label: 'Время' },
  { value: `${getTimeInUTC('12:30')}Z`, label: '12:30 - 13:00' }, // value in UTC
  { value: `${getTimeInUTC('13:00')}Z`, label: '13:00 - 13:30' },  // value in UTC
  { value: `${getTimeInUTC('18:30')}Z`, label: '18:30 - 19:00' }  // value in UTC
];

const DeliveryTimeDropdown = ({...other}) => {
  return (
    <Dropdown auto source={deliveryTimeOptions} size="15" {...other}/>
  );
};

export default DeliveryTimeDropdown;
