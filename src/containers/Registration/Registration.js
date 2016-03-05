import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { join } from 'redux/modules/auth';
import { show as showToast } from 'redux/modules/toast';
import Button from 'components/Button/Button';
import Input from 'components/Input/Input';
import Checkbox from 'react-toolbox/lib/checkbox';
import normalizeErrors from 'helpers/normalizeErrors';
import styles from './styles.scss';
import { setUser, setToken } from 'redux/modules/auth';

@connect(state => ({user: state.auth.user}), { join, showToast, setUser, setToken })
export default class Registration extends Component {
  static propTypes = {
    user: PropTypes.object,
    join: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired,
    setToken: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static Form = reduxForm({
    form: 'registration',
    fields: ['name', 'phone', 'email', 'password', 'rules']
  })(
    ({fields: {email, name, phone, password, rules}, handleSubmit}) =>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input big className={styles.input} placeholder="Имя" {...name}/>
        <Input big className={styles.input} placeholder="Телефон" type="phone" {...phone}/>
        <Input big className={styles.input} placeholder="Email" type="email" {...email}/>
        <Input big className={styles.input} placeholder="Password" type="password" {...password}/>

        <Checkbox {...rules} label="Я принимаю условия использования сервиса"/>

        <div className={styles.buttons}>
          <Button big className={styles.button} accent flat label="Зарегистрироваться" type="submit"/>
        </div>
      </form>
  );

  submit(user) {
    return new Promise((resolve, reject) => {
      this.props.join(user).then(response => {
        this.props.showToast('Письмо с подтверждением email отправлено на почту', 'accept', 'done');

        this.props.setUser(response.user);
        this.props.setToken(response.auth_token);
        this.context.router.push('/');

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
        <h1>Регистрация</h1>
        <div className={styles.description}>Заполните все поля и станьте пользователем Аппетини, мы доставим вам еду домой</div>
        <Registration.Form onSubmit={::this.submit}/>
      </div>
    );
  }
}
