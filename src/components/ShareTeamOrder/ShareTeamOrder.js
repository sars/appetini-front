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
    onShare: PropTypes.func,
    showToast: PropTypes.func.isRequired,
    shareLink: PropTypes.string
  }

  copyHandle = () => {
    this.props.showToast('Ссылка скопирована в буфер обмена', 'accept', 'done');
  }

  render() {
    const { onShare, shareLink } = this.props;
    return (
      <Card className={styles.shareWrapper}>
        <Input readOnly className={styles.shareInput} placeholder="Нажмите 'Поделиться' для появления ссылки" value={shareLink} disabled={!shareLink}/>
        {shareLink
          ? <CopyToClipboard onCopy={::this.copyHandle} text={shareLink}><Button className={styles.shareButton} flat accent label="Копировать"/></CopyToClipboard>
          : <Button className={styles.shareButton} flat onClick={onShare} accent label="Поделиться"/>
        }
      </Card>
    );
  }
}
