import React from 'react';
import _Dropdown from 'react-toolbox/lib/dropdown';
import classNames from 'classnames';
import events from 'react-toolbox/lib/utils/events';
import Input from 'components/Input/Input';

export default class Dropdown extends _Dropdown {
  componentWillUpdate(nextProps, nextState) {
    if (!this.state.active && nextState.active) {
      events.addEventsToDocument({click: this.handleDocumentClick});
    }
  }

  getSelectedItem = () => {
    if (this.props.value) {
      for (const item of this.props.source) {
        if (item.value === this.props.value) return item;
      }
    } else {
      return this.props.source[0];
    }
  };

  render() {
    const styles = require('./styles.scss');
    const toolboxStyles = require('react-toolbox/lib/dropdown/style.scss');
    let inputStyles = require('components/Input/styles.scss');
    inputStyles = {
      ...inputStyles,
      inputWrapper: classNames(inputStyles.inputWrapper, styles.inputWrapper)
    };

    const {template, source, ...others} = this.props;
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
