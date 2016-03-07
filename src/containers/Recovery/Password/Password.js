import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { recoveryPasswordChange, setUser, setToken } from 'redux/modules/auth';
import { show as showToast } from 'redux/modules/toast';
import Button from 'components/Button/Button';
import Input from 'components/Input/Input';
import normalizeErrors from 'helpers/normalizeErrors';
import styles from '../styles.scss';

@connect(state => ({user: state.auth.user}), { recoveryPasswordChange, showToast, setUser, setToken })
export default class Password extends Component {
  static propTypes = {
    user: PropTypes.object,
    recoveryPasswordChange: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired,
    setToken: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired
  };

  static Form = reduxForm({
    form: 'recoveryPassword',
    fields: ['password']
  })(
    ({fields: {password}, handleSubmit}) =>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input big className={styles.input} type="password" {...password}/>

        <div className={styles.buttons}>
          <Button big className={styles.button} accent flat label="Изменить пароль" type="submit"/>
        </div>
      </form>
  );

  submit(user) {
    const { params, recoveryPasswordChange, showToast, setUser, setToken } = this.props; // eslint-disable-line no-shadow
    return new Promise((resolve, reject) => {
      recoveryPasswordChange({...user, reset_password_token: params.token}).then(response => {
        showToast('Пароль успешно изменен', 'accept', 'done');
        setUser(response.resource);
        setToken(response.auth_token);
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
        <h1>Изменение пароля</h1>
        <div className={styles.description}>Введите новый пароль</div>
        <Password.Form onSubmit={::this.submit}/>
      </div>
    );
  }
}
