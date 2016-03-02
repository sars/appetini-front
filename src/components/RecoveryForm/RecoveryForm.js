import React, { Component, PropTypes } from 'react';
import {reduxForm} from 'redux-form';
import Button from 'components/Button/Button';
import Input from 'components/Input/Input';
import { recovery } from 'redux/modules/auth';
import { show as showToast } from 'redux/modules/toast';
import { connect } from 'react-redux';

@connect(null, { recovery, showToast })
@reduxForm({
  form: 'login',
  fields: ['email', 'password', 'rememberMe'],
  asyncBlurFields: ['email']
})
export default class RecoveryForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    recovery: PropTypes.func.isRequired,
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
      this.props.recovery(user).then(this.props.onSuccess)
        .then(() => this.props.showToast('You are successfully logged in', 'accept', 'done'))
        .catch(this.props.onError);
    })();
  };


  render() {
    const { fields: { email } } = this.props;
    const styles = require('./styles.scss');

    return (
      <div className={styles.root}>
        <Input className={styles.input} type="email" {...email}/>

        <div className={styles.buttons}>
          <Button className={styles.button} accent flat label="Восстановить" onClick={this.submit}/>
        </div>
      </div>
    );
  }
}
