import _GoogleMapLoader from 'react-google-maps/lib/GoogleMapLoader';

// https://github.com/tomchentw/react-google-maps/pull/252
export default class GoogleMapLoader extends _GoogleMapLoader {
  mountGoogleMap(domEl) {
    if (domEl !== null) {
      super.mountGoogleMap(domEl);
    }
  }
}
