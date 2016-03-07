import React, { PropTypes } from 'react';
import { FormattedPlural } from 'react-intl';
import Item from '../Item/Item';

const DeliveryTariff = ({resource, ...rest}) => {
  const name = (
    resource.individual ?
      'Доставка' :
      <span>
        {resource.amount}{' '}
        <FormattedPlural value={resource.amount} one="доставка" few="доставки" many="доставок" other="доставок"/>{' '}
        в месяц
      </span>
  );

  return (
    <Item name={name} price={Number(resource.price)} {...rest}/>
  );
};

DeliveryTariff.propTypes = {
  resource: PropTypes.object.isRequired
};

export default DeliveryTariff;
