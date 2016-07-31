import React, { PropTypes } from 'react';
import Item from '../Item/Item';
import { FormattedPlural } from 'react-intl';

const TeamOrder = ({resource, amount, ...rest}) => {
  const lunchesAmount = resource.order_items_attributes.reduce((sum, item) => sum + item.amount, 0);
  const title = (
    <span>
      Корпоративный обед на {lunchesAmount}
      {' '}
      <FormattedPlural value={lunchesAmount} one="порция" few="порции" many="порций" other="порций"/>
    </span>
  );
  return (
    <Item name={title} price={Number(resource.price) * amount} {...rest}/>
  );
};

TeamOrder.propTypes = {
  resource: PropTypes.object.isRequired
};

export default TeamOrder;
