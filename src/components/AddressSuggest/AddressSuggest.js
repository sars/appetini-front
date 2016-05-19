import React, { Component, PropTypes } from 'react';
import Geosuggest from 'react-geosuggest';
import Input from 'components/Input/Input';
import styles from './styles.scss';
import GoogleMap from 'google-map-react';
const icon = require('./marker.png');

export default class AddressSuggest extends Component {
  static propTypes = {
    location: PropTypes.object,
    disabled: PropTypes.bool,
    onSuggestSelect: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {description: props.location ? props.location.description : null};
  }

  componentWillReceiveProps(nextProps) {
    const description = nextProps.location ? nextProps.location.description : null;

    if (description !== this.state.description) {
      this.setState({ description });
    }
  }

  onChangeDescription(value) {
    this.setState({description: value});

    if (this.props.location) {
      this.props.onSuggestSelect({...this.props.location, description: value});
    }
  }

  defaultCenter = {lat: 50.907777, lng: 34.797297999999955};

  handleSuggestSelect(suggest) {
    this.props.onSuggestSelect({
      lat: suggest.location.lat,
      lng: suggest.location.lng,
      place_id: suggest.placeId,
      full_address: suggest.label,
      description: this.state.description
    });
  }

  render() {
    const { location, disabled } = this.props;
    const locationCenter = location ? {lat: location.lat, lng: location.lng} : undefined;
    const cityLatLng = (typeof google === 'object') ? new window.google.maps.LatLng(this.defaultCenter.lat, this.defaultCenter.lng) : undefined;
    const mapOptions = {mapTypeControl: false, streetViewControl: false, center: locationCenter, zoom: location ? 17 : 13};

    return (
      <div>
        <Geosuggest country="ua" types={['address']} radius={10000} location={cityLatLng} disabled={disabled}
                    placeholder="например, 203, Барановская улица, Сумы" onSuggestSelect={::this.handleSuggestSelect}
                    initialValue={location ? location.full_address : undefined}
        />
        <div className={styles.colWrapper}>
          <div className={styles.mapContainer}>
            <GoogleMap {...mapOptions} defaultCenter={this.defaultCenter}>
              {location && <span className={styles.marker} lat={location.lat} lng={location.lng}><img src={icon} alt="marker"/></span>}
            </GoogleMap>
          </div>
          <Input multiline className={styles.textareaContainer} onChange={::this.onChangeDescription}
                 placeholder="К вам трудно добраться? Укажите ориентиры, номер подъезда, номер домофона или квартиры, если нужно"
                 value={this.state.description} disabled={disabled}
          />
        </div>
      </div>
    );
  }
}
