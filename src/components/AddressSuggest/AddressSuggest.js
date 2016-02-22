import React, { Component, PropTypes } from 'react';
import Geosuggest from 'react-geosuggest';
import './styles.scss';

export default class AddressSuggest extends Component {
  static propTypes = {
    onSuggestSelect: PropTypes.func.isRequired
  };

  handleSuggestSelect(suggest) {
    this.props.onSuggestSelect({
      lat: suggest.location.lat,
      lng: suggest.location.lng,
      place_id: suggest.placeId,
      full_address: suggest.label
    });
  }

  render() {
    const cityLatLng = (typeof google === 'object') && new google.maps.LatLng(50.907777, 34.797297999999955); // eslint-disable-line no-undef

    return (
      <Geosuggest country="ua" types={['address']} onSuggestSelect={::this.handleSuggestSelect}
                  radius={10000} location={cityLatLng} {...this.props}
      />
    );
  }
}
