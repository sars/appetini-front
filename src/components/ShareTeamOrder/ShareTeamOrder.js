import React, { Component, PropTypes } from 'react';
import Input from 'components/Input/Input';
import Button from 'components/Button/Button';
import Card from 'components/Card/Card';
import CopyToClipboard from 'react-copy-to-clipboard';
import { show as showToast } from 'redux/modules/toast';
import { connect } from 'react-redux';
import styles from './styles.scss';

@connect( null, { showToast })
export default class ShareTeamOrder extends Component {
  static propTypes = {
    showToast: PropTypes.func.isRequired,
    shareLink: PropTypes.string
  }

  copyHandle = () => {
    this.props.showToast('Ссылка скопирована в буфер обмена', 'accept', 'done');
  }

  render() {
    const { shareLink } = this.props;
    return (
      <div className={styles.share}>
        <Card className={styles.shareWrapper}>
          <div className={styles.inputsWrapper}>
            <Input readOnly className={styles.shareInput} placeholder="Нажмите 'Поделиться' для появления ссылки" value={shareLink} disabled={!shareLink}/>
            <CopyToClipboard disabled={!shareLink} onCopy={::this.copyHandle} text={shareLink ? shareLink : ''}><Button className={styles.shareButton} flat accent label="Копировать"/></CopyToClipboard>
          </div>
          <div className={styles.helperText}>Передайте эту ссылку друзьям, которые делают заказ вместе с Вами</div>
        </Card>
      </div>
    );
  }
}
