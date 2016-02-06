import React from 'react';
import Autocomplete from 'react-toolbox/lib/autocomplete';
import style from 'react-toolbox/lib/autocomplete/style';
import classNames from 'classnames';
import autocompleteStyles from 'components/autocomplete/autocomplete.scss';

export default class AsyncAutocomplete extends Autocomplete {
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.onUpdateSuggestions && this.state.query !== nextState.query) {
      this.props.onUpdateSuggestions(nextState.query);
    }

    return super.shouldComponentUpdate(nextProps, nextState);
  }

  suggestions() {
    const suggest = new Map();
    const values = this.values();
    for (const [key, value] of this.source()) {
      if (!values.has(key)) {
        suggest.set(key, value);
      }
    }
    return suggest;
  }

  renderSuggestions() {
    if (this.suggestions().size === 0) {
      const className = classNames(style.suggestions, {[style.up]: this.state.direction === 'up'});
      return (
        <ul ref="suggestions" className={classNames(className, autocompleteStyles.noSuggestions)}>
          <li className={style.suggestion}>No suggestions</li>
        </ul>
      );
    }

    return super.renderSuggestions();
  }
}
