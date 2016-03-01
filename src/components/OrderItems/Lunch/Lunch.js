import React, { PropTypes } from 'react';
import { FormattedPlural } from 'react-intl';
import Item from '../Item/Item';

const Lunch = ({resource, amount, ...rest}) => {
  const { cook } = resource;
  const name = (
    <span>
      {amount}{' '}
      <FormattedPlural value={amount} one="обед" few="обеда" many="обедов" other="обедов"/>{' '}
      от {cook.first_name} {cook.last_name}
    </span>
  );

  return (
    <Item name={name} price={Number(resource.price) * amount} {...rest}/>
  );
};

Lunch.propTypes = {
  resource: PropTypes.object.isRequired,
  amount: PropTypes.number.isRequired
};

export default Lunch;
