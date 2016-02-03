import React, {Component, PropTypes} from 'react';
import CheckButton from 'components/CheckButton/CheckButton';

export default class CheckButtonsGroup extends Component {
  static propTypes = {
    source: PropTypes.object,
    children: PropTypes.any,
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
    const {value, source} = this.props;

    return (this.props.children ? <div>{this.props.children}</div> :
      <div>
        {Object.keys(source || {}).map((sourceValue, index) =>
          <CheckButton checked={value.indexOf(sourceValue.toString()) !== -1} key={index}
                       label={source[sourceValue]} onChange={this.handleChange(sourceValue)} />
        )}
      </div>
    );
  }
}
