import React, { PropTypes } from 'react';
import classNames from 'classnames';

const Card = ({children, className, ...other}) => {
  const styles = require('./styles.scss');
  const classes = classNames(styles.card, className);

  return (
    <div className={classes} {...other}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string
};

export default Card;
export CardContent from './CardContent';
