import React, {Component, PropTypes} from 'react';
import CheckButton from 'components/CheckButton/CheckButton';
import classNames from 'classnames';

export default class CheckButtonsGroup extends Component {
  static propTypes = {
    source: PropTypes.object,
    template: PropTypes.func,
    checkButtonProps: PropTypes.func,
    value: PropTypes.array,
    onChange: PropTypes.func
  };

  static defaultProps = {
    value: []
  };

  shouldComponentUpdate(nextProps) {
    return this.props !== nextProps;
  }

  handleChange = (buttonValue) => (checked) => {
    if (this.props.onChange) {
      const {value} = this.props;
      const pos = value.indexOf(buttonValue.toString());
      let newValue;

      if (checked && pos === -1) {
        newValue = [...value, buttonValue.toString()];
      } else if (!checked && pos !== -1) {
        newValue = value.slice();
        newValue.splice(pos, 1);
      }

      if (newValue) {
        this.props.onChange(newValue);
      }
    }
  };

  render() {
    const {value, source, template, checkButtonProps} = this.props;
    const styles = require('./CheckButtonsGroup.scss');

    const checkButtons = Object.keys(source || {}).map((sourceValue, index) => {
      let props = (checkButtonProps && checkButtonProps(sourceValue));
      props = {...props, className: classNames(props && props.className, styles.checkButton)};
      return (
        <CheckButton {...props}
          checked={value.indexOf(sourceValue.toString()) !== -1} key={index}
          label={source[sourceValue]} onChange={this.handleChange(sourceValue)}/>
      );
    });

    return (
      <div>
        {template ? template(checkButtons) : checkButtons}
      </div>
    );
  }
}
