import React, { Component, PropTypes } from 'react';
import {reduxForm} from 'redux-form';
import Button from 'components/Button/Button';
import Input from 'components/Input/Input';
import { login, oauth } from 'redux/modules/auth';
import { show as showToast } from 'redux/modules/toast';
import { connect } from 'react-redux';
import Checkbox from 'react-toolbox/lib/checkbox';
import { Link } from 'react-router';
import SocialButton from 'components/SocialButton/SocialButton';

@connect(null, { login, oauth, showToast })
@reduxForm({
  form: 'login',
  fields: ['email', 'password', 'rememberMe'],
  asyncBlurFields: ['email']
})
export default class LoginForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    dirty: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    oauth: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    onError: PropTypes.func,
    showToast: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static defaultProps = {
    onSuccess: (result) => result,
    onError: (error) => error
  };

  submit = () => {
    this.props.handleSubmit(user => {
      this.props.login(user).then(this.props.onSuccess)
        .then(() => this.props.showToast('You are successfully logged in', 'accept', 'done'))
        .catch(this.props.onError);
    })();
  };

  oauth(provider) {
    return () => {
      this.props.oauth(provider).then(this.props.onSuccess)
        .then(() => this.props.showToast('You are successfully logged in', 'accept', 'done'))
        .catch(this.props.onError);
    };
  }

  render() {
    const {
      // dirty,
      fields: {email, password, rememberMe},
      /* handleSubmit,
      invalid,
      resetForm,
      pristine, */
      } = this.props;
    const styles = require('./LoginForm.scss');

    return (
      <div className={styles.root}>
        <Input big className={styles.input} type="email" {...email}/>
        <Input big className={styles.input} type="password" {...password}/>

        <div className={styles.recoveryContainer}>
          <Checkbox className={styles.rememberMe} label="Запомнить меня" {...rememberMe} />
          <Link className={styles.forgotLink} to="/recovery">
            Забыли пароль?
          </Link>
        </div>

        <div className={styles.buttons}>
          <Button className={styles.button} accent flat label="Войти" onClick={this.submit}/>
          <Button className={styles.button} outlined flat label="Зарегистрироваться"
                  onClick={() => this.context.router.push('/join')}/>
        </div>

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
