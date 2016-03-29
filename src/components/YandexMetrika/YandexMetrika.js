import { PropTypes } from 'react';
import ym, {Initializer as YM} from 'react-yandex-metrika';

export default class YandexMetrica extends YM {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentDidMount() {
    super.componentDidMount();
    window.ym.init([36431420], {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true
    });

    this.historyListener = this.context.router.listen((location) => {
      if (!location) {
        return;
      }

      this.pageview(location);
    });
  }

  componentWillUnmount() {
    if (!this.historyListener) {
      return;
    }

    this.historyListener();
    this.historyListener = null;
  }

  pageview(location = {}) {
    const path = location.pathname + location.search;
    if (this.latestUrl === path) {
      return;
    }

    this.latestUrl = path;

    // wait for correct title
    setTimeout(() => {
      ym('hit', path, {title: document.title});
    }, 0);
  }
}
