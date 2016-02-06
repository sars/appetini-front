import React, { PropTypes } from 'react';
import classNames from 'classnames';

const CardContent = ({children, className, ...other}) => {
  const styles = require('./styles.scss');
  const classes = classNames(styles.cardContent, className);

  return (
    <div className={classes} {...other}>
      {children}
    </div>
  );
};

CardContent.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string
};

export default CardContent;
