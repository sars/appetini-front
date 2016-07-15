import React from 'react';
import _Dropdown from 'react-toolbox/lib/dropdown';
import classNames from 'classnames';
import events from 'react-toolbox/lib/utils/events';
import Input from 'components/Input/Input';
import dropdownStyles from './styles.scss';
import toolboxStyles from 'react-toolbox/lib/dropdown/style.scss';
import InputStyles from 'components/Input/styles.scss';

export default class Dropdown extends _Dropdown {
  componentWillUpdate(nextProps, nextState) {
    if (!this.state.active && nextState.active) {
      events.addEventsToDocument({click: this.handleDocumentClick});
    }
  }

  getSelectedItem = () => {
    const { value, source } = this.props;
    if (value) {
      for (const item of source) {
        if (item.value === value) return item;
      }
    } else {
      return source[0];
    }
  };

  renderTemplateValue(selected) {
    const { label, error, disabled, styles, template } = this.props;

    const className = classNames(toolboxStyles.field, {
      [toolboxStyles.errored]: error,
      [toolboxStyles.disabled]: disabled
    }, styles.field);

    return (
      <div className={className} onMouseDown={this.handleMouseDown}>
        {template(selected)}
        {label ? <label className={toolboxStyles.label}>{label}</label> : null}
        {error ? <span className={toolboxStyles.error}>{error}</span> : null}
      </div>
    );
  }

  render() {
    const {template, source, ...others} = this.props;
    const styles = {...toolboxStyles, ...dropdownStyles, ...this.props.styles};
    const inputStyles = {
      ...InputStyles,
      inputWrapper: classNames(InputStyles.inputWrapper, styles.inputWrapper)
    };
    const selected = this.getSelectedItem();
    const className = classNames(toolboxStyles.root, {
      [toolboxStyles.up]: this.state.up,
      [toolboxStyles.active]: this.state.active,
      [toolboxStyles.disabled]: this.props.disabled
    }, this.props.className);

    return (
      <div data-react-toolbox="dropdown" className={className}>
        <Input
          {...others}
          className={classNames(toolboxStyles.value, styles.value)}
          onMouseDown={this.handleMouseDown}
          readOnly
          type={template && selected ? 'hidden' : null}
          value={selected && selected.label}
          styles={inputStyles}
        />
        {template && selected ? this.renderTemplateValue(selected) : null}
        <ul className={classNames(toolboxStyles.values, styles.values)} ref="values">
          {source.map(this.renderValue.bind(this))}
        </ul>
      </div>
    );
  }
}
