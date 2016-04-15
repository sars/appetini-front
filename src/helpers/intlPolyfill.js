export default function(cb) {
  if (!global.Intl) {
    require.ensure([
      'intl',
      'intl/locale-data/jsonp/en.js'
    ], (require) => {
      require('intl');
      require('intl/locale-data/jsonp/en.js');
      require('intl/locale-data/jsonp/ru.js');
      cb();
    });
  } else {
    cb();
  }
}
