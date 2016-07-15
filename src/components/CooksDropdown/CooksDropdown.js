import React from 'react';
import Dropdown from 'components/Dropdown/Dropdown';
import classNames from 'classnames';
import styles from './styles.scss';

const CooksDropdown = ({cooks, className, ...other}) => {
  const preparedCooks = [{label: 'Кулинар', placeholder: true}, ...cooks.map(cook => {
    return {value: cook.id, label: cook.full_name_genitive, photo: cook.main_photo.thumb.url};
  })];

  const template = (cook) => {
    return (
      <div className={classNames(styles.cookTemplate, cook.placeholder ? styles.placeholder : null)}>
        {cook.photo && <img src={cook.photo}/>}
        <span>{cook.label}</span>
      </div>
    );
  };

  return (
    <Dropdown auto className={className} styles={styles} source={preparedCooks} template={template} size="20" {...other}/>
  );
};

export default CooksDropdown;
