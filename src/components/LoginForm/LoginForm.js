import React, { Component, PropTypes } from 'react';
import {reduxForm} from 'redux-form';
import Button from 'react-toolbox/lib/button';
import Input from 'react-toolbox/lib/input';
import { submit, oauth } from 'redux/modules/loginModal';
import { show as showToast } from 'redux/modules/toast';
import { connect } from 'react-redux';
import Checkbox from 'react-toolbox/lib/checkbox';

@connect(
  state => ({ ...state.loginModal }),
  { submit, oauth, showToast })
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
    submit: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
    onError: PropTypes.func,
    showToast: PropTypes.func.isRequired
  };

  static defaultProps = {
    onSuccess: (result) => result,
    onError: (error) => error
  };

  submit = () => {
    this.props.handleSubmit(user => {
      this.props.submit(user).then(this.props.onSuccess)
        .then(() => this.props.showToast('You are successfully logged in', 'accept', 'done'))
        .catch(this.props.onError);
    })();
  };

  oauth(provider) {
    return () => {
      this.props.oauth(provider).then(() => this.props.showToast('You are successfully logged in', 'accept', 'done'));
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
      <section>
        <Input type="email" label="Email address" icon="email" id={email.name} {...email} />
        <Input type="password" label="Password" icon="lock" id={password.name} {...password} />
        <Checkbox className={styles.rememberMe} label="Remember me" {...rememberMe} />
        <Button label="FB" onClick={this.oauth('facebook')} />
        <Button label="VK" onClick={this.oauth('vkontakte')} />
        <Button label="Login" onClick={this.submit} />
      </section>

    );
  }
}
