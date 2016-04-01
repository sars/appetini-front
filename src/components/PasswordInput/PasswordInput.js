import React, {Component, PropTypes} from 'react';
import styles from './styles.scss';
import Input from 'components/Input/Input';
import classNames from 'classnames';

export default class PasswordInput extends Component {
  static propTypes = {
    className: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      showPassword: false
    };
  }

  handleClick = () => {
    const {showPassword} = this.state;
    this.setState({
      showPassword: !showPassword
    });
  }

  render() {
    const {className} = this.props;
    const {showPassword} = this.state;
    const type = showPassword ? 'text' : 'password';
    return (
        <div>
          <div className={styles.passwordInputWrapper}>
            <Input type={type} {...this.props} className={classNames(styles.passwordInput, className)}/>
            <span className={styles.showPasswordBtn} onClick={::this.handleClick}>
              <i className={classNames('fa', showPassword ? 'fa-eye-slash' : 'fa-eye')}/>
            </span>
          </div>
        </div>
    );
  }
}
