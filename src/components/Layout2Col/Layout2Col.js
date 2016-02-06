import React, { PropTypes } from 'react';
import classNames from 'classnames';

const Layout2Col = ({children, className, leftSidebar, ...other}) => {
  const styles = require('./styles.scss');
  const classes = classNames(styles.root, className);

  return (
    <div className={classes} {...other}>
      <div className={styles.leftSidebar}>
        {leftSidebar}
      </div>
      <div className={styles.center}>
        {children}
      </div>
    </div>
  );
};

Layout2Col.propTypes = {
  children: PropTypes.any,
  leftSidebar: PropTypes.any,
  className: PropTypes.string
};

export default Layout2Col;
