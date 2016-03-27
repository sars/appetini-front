import React from 'react';
import Dropdown from 'components/Dropdown/Dropdown';

const deliveryTimeOptions = [
  { label: 'Время' },
  { value: '09:30Z', label: '12:30 - 13:00' }, // value in UTC
  { value: '10:30Z', label: '13:30 - 14:00' }  // value in UTC
];

const DeliveryTimeDropdown = ({...other}) => {
  return (
    <Dropdown auto source={deliveryTimeOptions} size="15" {...other}/>
  );
};

export default DeliveryTimeDropdown;
