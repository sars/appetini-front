import React, {Component, PropTypes} from 'react';
import CheckButton from 'components/CheckButton/CheckButton';

export default class CheckButtonsGroup extends Component {
  static propTypes = {
    source: PropTypes.object.isRequired,
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
    const checkButtons = Object.keys(source || {}).map((sourceValue, index) =>
      <CheckButton {...(checkButtonProps && checkButtonProps(sourceValue))}
                   checked={value.indexOf(sourceValue.toString()) !== -1} key={index}
                   label={source[sourceValue]} onChange={this.handleChange(sourceValue)} />
    );

    return (
      <div>
        {template ? template(checkButtons) : checkButtons}
      </div>
    );
  }
}
