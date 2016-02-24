import React, { PropTypes } from 'react';
import classNames from 'classnames';

const ColumnLayout = ({children, className, ...other}) => {
  const styles = require('./styles.scss');
  const classes = classNames(styles.root, className);

  return (
    <div className={classes} {...other}>
      {children}
    </div>
  );
};

ColumnLayout.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string
};

export default ColumnLayout;
