import React, { PropTypes } from 'react';
import Navigation from 'react-toolbox/lib/navigation';
import { IndexLink, Link } from 'react-router';
import classNames from 'classnames';

const HeaderMenu = ({links, showActive, className}) => {
  const styles = require('./HeaderMenu.scss');

  return (
    <Navigation className={classNames(styles.navigation, className)}>
      {links.map((link, index) => {
        return React.createElement(
          link.index ? IndexLink : Link,
          {
            to: link.to,
            key: index,
            activeClassName: showActive && styles.activeNavLink,
            className: styles.link
          },
          <span dangerouslySetInnerHTML={{__html: link.label}}></span>
        );
      })}
    </Navigation>
  );
};

HeaderMenu.propTypes = {
  links: PropTypes.array.isRequired,
  showActive: PropTypes.bool,
  className: PropTypes.string
};

export default HeaderMenu;
