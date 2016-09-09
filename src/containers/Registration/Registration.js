import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { join } from 'redux/modules/auth';
import { show as showToast } from 'redux/modules/toast';
import Button from 'components/Button/Button';
import Input from 'components/Input/Input';
import PasswordInput from 'components/PasswordInput/PasswordInput';
import Checkbox from 'react-toolbox/lib/checkbox';
import normalizeErrors from 'helpers/normalizeErrors';
import styles from './styles.scss';
import { setUser, setToken, oauth, initRegistration, resetRegistration } from 'redux/modules/auth';
import SocialButton from 'components/SocialButton/SocialButton';

@connect(state => ({
  user: state.auth.user,
  initialData: state.auth.registrationInitial
}),
{ join, showToast, setUser, setToken, oauth, initRegistration, resetRegistration })
export default class Registration extends Component {
  static propTypes = {
    initialData: PropTypes.object,
    join: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired,
    setToken: PropTypes.func.isRequired,
    oauth: PropTypes.func.isRequired,
    initRegistration: PropTypes.func.isRequired,
    resetRegistration: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {initialData: props.initialData || {}};
  }

  componentDidMount() {
    if (this.props.initialData) {
      this.props.resetRegistration();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initialData) {
      this.setState({initialData: nextProps.initialData});
      nextProps.resetRegistration();
    }
  }

  static Form = reduxForm({
    form: 'registration',
    fields: ['name', 'phone', 'email', 'password', 'rules']
  })(
    ({fields: {email, name, phone, password, rules}, handleSubmit}) =>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input big className={styles.input} placeholder="Имя" {...name}/>
        <Input big className={styles.input} placeholder="Телефон" type="phone" {...phone}/>
        <Input big className={styles.input} placeholder="Email" type="email" {...email}/>
        <PasswordInput big placeholder="Password" {...password} className={styles.input}/>

        <Checkbox {...rules} label="Я принимаю условия использования сервиса"/>

        <div className={styles.buttons}>
          <Button big className={styles.button} accent flat label="Зарегистрироваться" type="submit"/>
        </div>
      </form>
  );

  afterSuccess = (response) => {
    this.props.setUser(response.resource);
    this.props.setToken(response.auth_token);
    this.context.router.push('/');
  };

  submit(user) {
    return new Promise((resolve, reject) => {
      this.props.join(user).then(response => {
        this.props.showToast('confirmations.send_instructions', 'accept', 'done');

        this.afterSuccess(response);

        resolve(response);
      }).catch(response => {
        const errors = normalizeErrors(response.errors);
        reject({...errors, _error: errors});
      });
    });
  }

  oauth = (provider) => {
    return () => {
      this.props.oauth(provider)
        .then((response) => {
          this.props.showToast('auth.login', 'accept', 'done');
          this.afterSuccess(response);
        })
        .catch((response) => {
          this.props.initRegistration(provider, response.data);
          this.props.showToast(response.error || 'errors.form_default', 'warning', 'error');
        });
    };
  };

  render() {
    return (
      <div className={styles.root}>
        <h1>Регистрация</h1>
        <div className={styles.description}>Заполните все поля и станьте пользователем Аппетини, мы доставим вам еду домой</div>
        <Registration.Form onSubmit={::this.submit} initialValues={this.state.initialData}/>

        <div className={styles.separator}>
          <span className={styles.separatorLabel}>
            или войти через соцсети
          </span>
        </div>

        <div className={styles.socialButtons}>
          <SocialButton className={styles.socialButton} name="vk" size="medium" onClick={::this.oauth('vkontakte')}/>
          <SocialButton className={styles.socialButton} name="fb" size="medium" onClick={::this.oauth('facebook')}/>
        </div>
      </div>
    );
  }
}
