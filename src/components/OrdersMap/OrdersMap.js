import React, {Component, PropTypes} from 'react';
import GoogleMap from 'google-map-react';
import Card, { CardContent } from 'components/Card/Card';
import styles from './styles.scss';
import Button from 'components/Button/Button';

export default class OrdersMap extends Component {
  static propTypes = {
    orders: PropTypes.array,
    orderPosition: PropTypes.object,
    clearOrderLocationHandler: PropTypes.func
  };

  state = {
    gmap: undefined
  }

  setMap = (map) => {
    this.setState({
      gmap: map
    });
  }

  render() {
    const { orders, orderPosition, clearOrderLocationHandler } = this.props;
    const { gmap } = this.state;
    const mapOptions = {mapTypeControl: false, streetViewControl: false,
      center: orderPosition ? orderPosition : {lat: 50.907777, lng: 34.797297999999955}};
    let bounds;
    const places = orders.map((order, idx) => {
      return (
        <div key={idx} lat={order.location.lat} lng={order.location.lng} className={styles.markerWrapper}>
          <div className={styles.marker}>
            <div className={styles.markerTextWrapper}><span>{order.id}</span></div>
            <div className={styles.markerTriangle}></div>
            <div className={styles.infoBox}>{order.location.full_address}</div>
          </div>
        </div>
      );
    });

    if (typeof google !== 'undefined') {
      bounds = new window.google.maps.LatLngBounds();
      orders.forEach(order => {
        bounds.extend(new window.google.maps.LatLng(order.location.lat, order.location.lng));
      });
    }

    if (gmap && !!places.length) {
      gmap.fitBounds(bounds);
    }

    return (
      <Card>
        <CardContent>
          <div className={styles.mapContainer}>
            <GoogleMap {...mapOptions} defaultZoom={14}
                                       onGoogleApiLoaded={({map}) => this.setMap(map)}
                                       yesIWantToUseGoogleMapApiInternals>
              {places}
            </GoogleMap>
            { orderPosition && orders.length > 1 &&
              <div className={styles.allLocationsWrapper}>
                <Button flat accent label="Показать все" onClick={clearOrderLocationHandler} />
              </div>
            }
          </div>
        </CardContent>
      </Card>
    );
  }
}
