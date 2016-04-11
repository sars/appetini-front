import React, { Component, PropTypes } from 'react';
import Geosuggest from 'react-geosuggest';
import GoogleMapLoader from 'react-google-maps/lib/GoogleMapLoader';
import GoogleMap from 'react-google-maps/lib/GoogleMap';
import Marker from 'react-google-maps/lib/Marker';
import Input from 'components/Input/Input';
import styles from './styles.scss';

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

    const cityLatLng = (typeof google === 'object') ? new google.maps.LatLng(this.defaultCenter.lat, this.defaultCenter.lng) : undefined; // eslint-disable-line no-undef

    const mapContainer = (
      <div className={styles.map}></div>
    );

    const mapOptions = {mapTypeControl: false, streetViewControl: false};

    const googleMapElement = (
      <GoogleMap options={mapOptions} center={location || this.defaultCenter} zoom={location ? 17 : 11}>
        {location && <Marker position={location} />}
      </GoogleMap>
    );

    return (
      <div>
        <Geosuggest country="ua" types={['address']} radius={10000} location={cityLatLng} disabled={disabled}
                    placeholder="например, 203, Барановская улица, Сумы" onSuggestSelect={::this.handleSuggestSelect}
                    initialValue={location ? location.full_address : undefined}
        />
        <div className={styles.colWrapper}>
          <GoogleMapLoader containerElement={mapContainer} googleMapElement={googleMapElement} />
          <Input multiline placeholder="К вам трудно добраться? Укажите ориентиры, номер подъезда, номер домофона или квартиры, если нужно" className={styles.textarea}
                 onChange={::this.onChangeDescription} value={this.state.description} disabled={disabled} />
        </div>
      </div>
    );
  }
}
