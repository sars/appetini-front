import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm, reset } from 'redux-form';
import { show as showToast } from 'redux/modules/toast';
import Button from 'components/Button/Button';
import Input from 'components/Input/Input';
import PasswordInput from 'components/PasswordInput/PasswordInput';
import normalizeErrors from 'helpers/normalizeErrors';
import styles from './styles.scss';
import { setUser, setToken, updateCurrentUser, changePassword } from 'redux/modules/auth';
import lodash from 'lodash';

@connect(state => ({ user: state.auth.user}),
  { showToast, setUser, setToken, updateCurrentUser, changePassword, reset })
export default class Settings extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    showToast: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired,
    setToken: PropTypes.func.isRequired,
    updateCurrentUser: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired
  };

  static AccountForm = reduxForm({
    form: 'change-account',
    fields: ['name', 'phone', 'email', 'unconfirmed_email']
  })(
    ({fields: {email, name, phone, unconfirmed_email}, handleSubmit, dirty}) =>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input big className={styles.input} {...name}/>
        <Input big className={styles.input} type="phone" {...phone}/>
        <Input big className={styles.input} type="email" {...email}/>
        {!lodash.isEmpty(unconfirmed_email.value) &&
          <label>Неподтвержденный email: <span className={styles.span}>{unconfirmed_email.value}</span></label>
        }
        <div className={styles.buttons}>
          <Button big accent flat label="Сохранить данные" type="submit"
                  className={styles.button}
                  disabled={!dirty}/>
        </div>
      </form>
  );

  static PasswordForm = reduxForm({
    form: 'change-password',
    fields: ['current_password', 'password']
  })(
    ({fields: {current_password, password}, handleSubmit}) =>
      <form className={styles.form} onSubmit={handleSubmit}>
        <PasswordInput big placeholder="Текущий пароль" {...current_password} className={styles.input}/>
        <PasswordInput big placeholder="Новый пароль" {...password} className={styles.input}/>
        <div className={styles.buttons}>
          <Button big accent flat label="Обновить пароль" type="submit"
                  className={styles.button}
                  disabled={!current_password.value || !password.value}/>
        </div>
      </form>
  );

  accountFormSubmit = (data) => {
    const { updateCurrentUser, showToast, user } = this.props; // eslint-disable-line no-shadow
    return new Promise((resolve, reject) => {
      const userEmail = user.email;
      updateCurrentUser(user.id, data).then((response) => {
        const toastMsg = lodash.isEqual(data.email, userEmail)
          ? 'Данные Вашего профиля были успешно сохранены'
          : 'Данные Вашего профиля были успешно сохранены. Письмо с подтверждением нового email отправлено на почту';
        showToast(toastMsg, 'accept', 'done');
        resolve(response);
      }).catch(response => {
        const errors = normalizeErrors(response.errors);
        reject({...errors, _error: errors});
      });
    });
  }

  passwordFormSubmit = (password) => {
    const { changePassword, showToast, setUser, setToken, reset, user } = this.props; // eslint-disable-line no-shadow
    return new Promise((resolve, reject) => {
      changePassword(user.id, password).then(response => {
        reset('change-password');
        showToast('Пароль успешно изменен', 'accept', 'done');
        setUser(response.resource);
        setToken(response.auth_token);
        resolve(response);
      }).catch(response => {
        const errors = normalizeErrors(response.errors);
        reject({...errors, _error: errors});
      });
    });
  };

  render() {
    const { user } = this.props;
    return (
      <div className={styles.root}>
        <h1>Настройки профиля</h1>
        <Settings.AccountForm onSubmit={this.accountFormSubmit} initialValues={{...user}}/>
        <h1>Изменение пароля</h1>
        <Settings.PasswordForm onSubmit={this.passwordFormSubmit} />
      </div>
    );
  }
}
