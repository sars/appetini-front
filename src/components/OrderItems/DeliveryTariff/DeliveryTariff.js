import React, { PropTypes } from 'react';
import Item from '../Item/Item';

const DeliveryTariff = ({resource, ...rest}) => {
  return (
    <Item name={resource.amount + ' доставок в месяц'} price={Number(resource.price)} {...rest}/>
  );
};

DeliveryTariff.propTypes = {
  resource: PropTypes.object.isRequired
};

export default DeliveryTariff;
