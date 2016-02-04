import React, { PropTypes } from 'react';
import Navigation from 'react-toolbox/lib/navigation';
import { IndexLink, Link } from 'react-router';

const HeaderMenu = ({links, showActive}) => {
  const styles = require('./HeaderMenu.scss');

  return (
    <Navigation className={styles.navigation}>
      {links.map((link, index) => {
        return React.createElement(
          link.index ? IndexLink : Link,
          {
            to: link.to,
            key: index,
            activeClassName: showActive && styles.activeNavLink,
            className: styles.link
          },
          <span>{link.label}</span>
        );
      })}
    </Navigation>
  );
};

HeaderMenu.propTypes = {
  links: PropTypes.array.isRequired,
  showActive: PropTypes.bool
};

export default HeaderMenu;
