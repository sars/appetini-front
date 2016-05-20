import { Component, PropTypes } from 'react';

const facebookPixel = (id) => {
  /* eslint-disable */
  (function(){!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', id.toString());})();
  /* eslint-enable */
};

export default class FacebookPixel extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentDidMount() {
    facebookPixel(this.props.id);
    this.historyListener = this.context.router.listen(location => {
      if (!location) {
        return;
      }
      window.fbq('track', 'PageView');
    });
  }

  componentWillUnmount() {
    if (!this.historyListener) {
      return;
    }
    this.historyListener();
    this.historyListener = null;
  }

  render() {
    return null;
  }
}
