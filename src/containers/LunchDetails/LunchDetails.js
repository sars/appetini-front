import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';

@asyncConnect({
  lunch: (params, helpers) => helpers.client.get('/lunches/' + params.lunchId)
})
@connect(state => ({auth: state.auth}))
export default class LunchDetails extends Component {
  static propTypes = {
    lunch: PropTypes.object.isRequired
  };

  render() {
    const {resource: lunch} = this.props.lunch.data;
    const {cook} = lunch;

    return (
      <div className="container">
        <h1>Обед от {cook.first_name} {cook.last_name}</h1>
      </div>
    );
  }
}
