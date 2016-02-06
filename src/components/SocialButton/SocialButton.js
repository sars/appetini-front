import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { IconButton } from 'react-toolbox/lib/button';
import * as icons from 'components/icons';
import capitalize from 'lodash/capitalize';

const SocialButton = ({className, name, size, ...other}) => {
  const styles = require('./styles.scss');
  const classes = classNames(styles.root, className, {
    [styles.medium]: size === 'medium'
  });

  return (
    <IconButton {...other} className={classes}>
      {React.createElement(icons[capitalize(name) + 'Icon'])}
    </IconButton>
  );
};

SocialButton.propTypes = {
  className: PropTypes.string,
  name: React.PropTypes.oneOf(['fb', 'vk', 'instagram']).isRequired,
  size: PropTypes.string
};

export default SocialButton;
