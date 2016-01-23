import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import DeliveryPeriod from 'components/DeliveryPeriod/DeliveryPeriod';

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
        <div>
          <h1>Обед от {cook.first_name} {cook.last_name}</h1>
          <DeliveryPeriod time={lunch.ready_by} />
        </div>
        <div className="leftSidebar">
          <img src={cook.main_photo.url} width="300" />
        </div>
        <div className="center">
          <div className="photos">
            {lunch.photos.map((photo, index) => {
              return <img key={index} src={photo.url} width="300" />;
            })}
          </div>
          <div className="composition">
            <h3>Состав обеда</h3>
            <ul>
              {lunch.dishes.map(dish => {
                return (
                  <li key={dish.id}>
                    <span>{dish.name}</span>
                    <span>{dish.size}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
