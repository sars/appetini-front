import React, { PropTypes } from 'react';
import Switch from 'react-toolbox/lib/switch';
import styles from './styles.scss';

const Toggle = ({checked, label, onChange}) => (
  <Switch
    checked={checked}
    label={label}
    onChange={onChange}
    className={styles.toggle}
  />
);

Toggle.propTypes = {
  checked: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Toggle;
