import React, { PropTypes } from 'react';
import { FormattedPlural } from 'react-intl';
import Item from '../Item/Item';

const DeliveryTariff = ({resource, amount, ...rest}) => {
  const individualOrZeroName = resource.individual ? 'Доставка по индивидуальному тарифу' : 'Доставка по вашему тарифу';
  const name = (
    resource.individual || resource.zero ?
      individualOrZeroName :
      <span>
        {resource.amount}{' '}
        <FormattedPlural value={resource.amount} one="доставка" few="доставки" many="доставок" other="доставок"/>
        {' '}
        в месяц
        {amount > 1 &&
          <span>
            {' '}
            <span>({amount} шт)</span>
          </span>
        }
      </span>
  );

  return (
    <Item name={name} price={Number(resource.price) * amount} {...rest}/>
  );
};

DeliveryTariff.propTypes = {
  resource: PropTypes.object.isRequired
};

export default DeliveryTariff;
