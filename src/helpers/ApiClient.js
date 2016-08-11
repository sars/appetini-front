import superagent from 'superagent';
import config from '../config';
import { setUser, clearToken } from 'redux/modules/auth';
import { show as showToast } from 'redux/modules/toast';

const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(path) {
  const adjustedPath = path[0] !== '/' ? '/' + path : path;
  if (__SERVER__) {
    // Prepend host and port of the API server to the path.
    return 'http://' + config.apiHost + ':' + config.apiPort + '/api' + adjustedPath;
  }
  // Prepend `/api` to relative URL, to proxy to API server.
  return '/api' + adjustedPath;
}

/*
 * This silly underscore is here to avoid a mysterious "ReferenceError: ApiClient is not defined" error.
 * See Issue #14. https://github.com/erikras/react-redux-universal-hot-example/issues/14
 *
 * Remove it at your own risk.
 */
class _ApiClient {
  constructor(req) {
    methods.forEach((method) =>
      this[method] = (path, { params, data, attach } = {}) => new Promise((resolve, reject) => {
        const request = superagent[method](formatUrl(path));

        if (params) {
          request.query(params);
        }

        if (attach) {
          for (const [fieldName, file] of Object.entries(attach)) {
            request.attach(fieldName, file);
          }
        }

        if (__SERVER__ && req.get('cookie')) {
          request.set('cookie', req.get('cookie'));
        }

        if (data) {
          request.send(data);
        }

        request.end((err, { body, headers } = {}) => {
          if ((headers && headers['x-remove-user-token']) === 'yes') {
            const { dispatch } = this.store;
            dispatch(clearToken());
            dispatch(setUser());
            dispatch(showToast('Время сессии истекло - необходимо войти снова', 'cancel', 'error'));
          }
          return err ? reject(body || err) : resolve(body);
        });
      }));
  }

  setStore(store) {
    this.store = store;
  }
}

const ApiClient = _ApiClient;

export default ApiClient;
