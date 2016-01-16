import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { load } from 'redux/modules/lunch';

@connect(state => ({lunch: state.lunch}))
export default class LunchDetails extends Component {
  static propTypes = {
    lunch: PropTypes.object.isRequired
  };

  static loadProps(params) {
    return params.store.dispatch(load(params.lunchId));
  }

  render() {
    return (
      <div className="container">
        {JSON.stringify(this.props.lunch)}
      </div>
    );
  }
}
