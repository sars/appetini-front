import React, {Component, PropTypes} from 'react';
import {Ripple as ripple} from 'react-toolbox';
import classNames from 'classnames';

@ripple({spread: 1})
export default class CheckButton extends Component {
  static propTypes = {
    children: React.PropTypes.any,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    className: PropTypes.string,
    label: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {checked: props.checked || false};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.checked !== undefined) {
      this.setState({checked: nextProps.checked});
    }
  }

  handleChange = () => {
    const checked = !this.state.checked;
    this.setState({checked});

    if (this.props.onChange) {
      this.props.onChange(checked);
    }
  };

  render() {
    const styles = require('./CheckButton.scss');
    const classname = classNames(styles.checkButton, {
      [styles.checked]: this.state.checked
    });

    return (
      <label {...this.props} className={classname}>
        <div onClick={this.handleChange}>
          {this.props.children}
          {this.props.label}
        </div>
      </label>
    );
  }
}
