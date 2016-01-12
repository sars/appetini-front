import React, { Component, PropTypes } from 'react';
import {reduxForm} from 'redux-form';
import Dialog from 'react-toolbox/lib/dialog';
import Button from 'react-toolbox/lib/button';
import Input from 'react-toolbox/lib/input';
import { toggle, submit, oauth } from 'redux/modules/loginModal';
import { connect } from 'react-redux';
import Checkbox from 'react-toolbox/lib/checkbox';
import Snackbar from 'react-toolbox/lib/snackbar';

@connect(
  state => ({ ...state.loginModal }),
  { toggle, submit, oauth })
@reduxForm({
  form: 'login',
  fields: ['email', 'password', 'rememberMe'],
  asyncBlurFields: ['email']
})
export default class LoginModal extends Component {
  static propTypes = {
    active: PropTypes.string,
    fields: PropTypes.object.isRequired,
    dirty: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    opened: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    oauth: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired
  };

  state = {
    snackbarActive: false
  };

  actions = [
    { label: 'Cancel', onClick: this.props.toggle },
    { label: 'Login', onClick: () => {
      this.props.handleSubmit(user => {
        this.props.submit(user).then(this.showSnackbar);
      })();
    } }
  ];

  showSnackbar = () => {
    this.setState({ snackbarActive: true });
  };

  oauth(provider) {
    return () => {
      this.props.oauth(provider).then(this.showSnackbar);
    };
  }

  handleSnackbarTimeout = () => {
    this.setState({ snackbarActive: false });
  };

  render() {
    const {
      // dirty,
      fields: {email, password, rememberMe},
      /* active,
      handleSubmit,
      invalid,
      resetForm,
      pristine, */
      opened
      } = this.props;
    const styles = require('./LoginModal.scss');

    return (
      <div>
        <Dialog actions={this.actions} active={opened} title="Login"
                onOverlayClick={this.props.toggle}>
          <section>
            <Input type="email" label="Email address" icon="email" id={email.name} {...email} />
            <Input type="password" label="Password" icon="lock" id={password.name} {...password} />
            <Checkbox className={styles.rememberMe} label="Remember me" {...rememberMe} />
            <Button label="FB" onClick={this.oauth('facebook')} />
            <Button label="VK" onClick={this.oauth('vkontakte')} />
          </section>
        </Dialog>
        <Snackbar icon="done" label="You are successfully logged in"
          active={this.state.snackbarActive} type="accept" onTimeout={this.handleSnackbarTimeout} timeout={2000}
        />
      </div>
    );
  }
}
