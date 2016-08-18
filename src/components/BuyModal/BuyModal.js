import React, { PropTypes } from 'react';
import ToolboxDialog from 'react-toolbox/lib/dialog';
import Button from 'components/Button/Button';
import { Link } from 'react-router';
import styles from './styles.scss';
import classNames from 'classnames';

const BuyModal = ({onClose, active, onClick}) => (
  <ToolboxDialog className={styles.shopModal} active={active} onOverlayClick={onClose}>
    <div className={styles.dialogBox}>
      <h3>Ваш заказ добавлен в корзину</h3>
      <i className="material-icons">check_circle</i>
      <Button className={classNames(styles.button, styles.buyButton)} big flat accent label="Перейти к оформлению"
              onClick={onClick}/>
      <Link to="/"><Button className={classNames(styles.button, styles.buyButton)} big flat accent
                           label="Выбрать другие блюда"/></Link>
    </div>
  </ToolboxDialog>
);

BuyModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

export default BuyModal;
