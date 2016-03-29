import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { sendRecovery } from 'redux/modules/auth';
import { show as showToast } from 'redux/modules/toast';
import Button from 'components/Button/Button';
import Input from 'components/Input/Input';
import normalizeErrors from 'helpers/normalizeErrors';
import styles from './styles.scss';
import Password from './Password/Password';

@connect(state => ({user: state.auth.user}), { sendRecovery, showToast })
export default class Recovery extends Component {
  static propTypes = {
    user: PropTypes.object,
    sendRecovery: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired
  };

  static Password = Password;

  static Form = reduxForm({
    form: 'recovery',
    fields: ['email']
  })(
    ({fields: {email}, handleSubmit, submitting}) =>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input big className={styles.input} placeholder="Email" type="email" {...email}/>

        <div className={styles.buttons}>
          <Button big className={styles.button} accent flat label="Восстановить" type="submit" disabled={submitting}/>
        </div>
      </form>
  );

  recovery(user) {
    return new Promise((resolve, reject) => {
      this.props.sendRecovery(user).then(response => {
        this.props.showToast('Письмо со ссылкой на восстановление пароля отправлено', 'accept', 'done');
        resolve(response);
      }).catch(response => {
        const errors = normalizeErrors(response.errors);
        reject({...errors, _error: errors});
      });
    });
  }

  render() {
    return (
      <div className={styles.root}>
        <h1>Восстановление пароля</h1>
        <div className={styles.description}>Вы получите ссылку для восстановления пароля на ваш email</div>
        <Recovery.Form onSubmit={::this.recovery}/>
      </div>
    );
  }
}
