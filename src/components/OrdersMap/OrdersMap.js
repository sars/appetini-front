import React, {Component, PropTypes} from 'react';
import {GoogleMap, Marker} from 'react-google-maps';
import GoogleMapLoader from 'components/GoogleMapLoader/GoogleMapLoader';
import Card, { CardContent } from 'components/Card/Card';
import styles from './styles.scss';
import Button from 'components/Button/Button';

export default class OrdersMap extends Component {
  static propTypes = {
    orders: PropTypes.array,
    orderPosition: PropTypes.object,
    clearOrderLocationHandler: PropTypes.func
  };

  fit = (map, bounds) => {
    const { orderPosition } = this.props;
    if (!orderPosition && bounds && map) {
      map.fitBounds(bounds);
    }
  }

  render() {
    const {orders, orderPosition, clearOrderLocationHandler} = this.props;
    const defaultCenter = {lat: 50.907777, lng: 34.797297999999955};
    const mapOptions = {mapTypeControl: false, streetViewControl: false, zoom: 17, center: orderPosition ? orderPosition : defaultCenter};
    let bounds;

    const markers = orders.map((order) => {
      return {
        position: {lat: order.location.lat, lng: order.location.lng},
        label: order.id.toString()
      };
    });

    if (typeof google !== 'undefined') {
      bounds = new window.google.maps.LatLngBounds();
      markers.forEach(marker => {
        bounds.extend(new window.google.maps.LatLng(marker.position.lat, marker.position.lng));
      });
    }

    const googleMapElement = (
      <GoogleMap options={mapOptions} ref={map => this.fit(map, bounds)}>
        {markers && markers.map((marker, idx) => {
          return (<Marker {...marker} key={idx} />);
        })}
      </GoogleMap>
    );

    const mapContainer = (
      <div className={styles.map}></div>
    );

    return (
      <Card>
        <CardContent>
          <div className={styles.mapContainer}>
            <GoogleMapLoader containerElement={mapContainer} googleMapElement={googleMapElement} />
            {orderPosition &&
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
