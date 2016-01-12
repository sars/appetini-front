function getDefaults() {
  return {
    facebook: {
      name: 'facebook',
      authUrl: '/api/auth/facebook',
      dataUrl: '/api/facebook/data',
      authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
      redirectUri: window.location.origin + '/',
      requiredUrlParams: ['display', 'scope'],
      scope: ['email'],
      scopeDelimiter: ',',
      display: 'popup',
      popupOptions: { width: 580, height: 400 }
    },
    vkontakte: {
      name: 'vkontakte',
      authUrl: '/api/auth/vkontakte',
      dataUrl: '/api/vkontakte/data',
      authorizationEndpoint: 'https://oauth.vk.com/authorize',
      redirectUri: window.location.origin + '/',
      requiredUrlParams: ['display', 'scope'],
      scope: ['email'],
      scopeDelimiter: ',',
      display: 'popup',
      popupOptions: { width: 580, height: 400 }
    }
  };
}

function stringifyPopupOptions(options) {
  const parts = [];
  for (const [key, value] of Object.entries(options)) {
    parts.push(key + '=' + value);
  }
  return parts.join(',');
}

function preparePopupOptions(options = {}) {
  const width = options.width || 500;
  const height = options.height || 500;

  return {
    ...options,
    width: width,
    height: height,
    left: window.screenX + ((window.outerWidth - width) / 2),
    top: window.screenY + ((window.outerHeight - height) / 2.5)
  };
}

function parseQueryString(keyValue) {
  const obj = {};
  (keyValue || '').split('&').forEach((pair) => {
    if (pair) {
      const value = pair.split('=');
      const key = decodeURIComponent(value[0]);
      obj[key] = (typeof value[1] !== 'undefined') ? decodeURIComponent(value[1]) : true;
    }
  });
  return obj;
}

function apiRequest(urlName, oauthData, config) {
  return new Promise((resolve, reject) => {
    const apiUrl = config[urlName];
    const client = new XMLHttpRequest();

    client.open('POST', apiUrl, true);
    client.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    client.send('code=' + oauthData.code + '&client_id=' + config.clientId + '&redirect_uri=' + config.redirectUri);

    client.onload = () => {
      if (client.status >= 200 && client.status < 300) {
        const result = JSON.parse(client.responseText);
        resolve(result);
      } else {
        reject(client.statusText);
      }
    };
  });
}

function pollPopup(popupWindow) {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      try {
        const documentOrigin = document.location.host;
        const popupWindowOrigin = popupWindow.location.host;

        if (popupWindowOrigin === documentOrigin) {
          popupWindow.document.removeChild(popupWindow.document.documentElement);
          if (popupWindow.location.search || popupWindow.location.hash) {
            const queryParams = popupWindow.location.search.substring(1).replace(/\/$/, '');
            const hashParams = popupWindow.location.hash.substring(1).replace(/[\/$]/, '');
            const hash = parseQueryString(hashParams);
            const qs = parseQueryString(queryParams);

            const result = {...qs, ...hash};

            if (result.error) {
              reject(result);
            } else {
              resolve(result);
            }

            clearInterval(interval);

            popupWindow.close();
          }
        }
      } catch (error) {
        // Ignore DOMException: Blocked a frame with origin from accessing a cross-origin frame.
      }
    });
  });
}

function buildQueryString(qs) {
  const parts = [];
  for (const [key, value] of Object.entries(qs)) {
    parts.push(key + '=' + value);
  }
  return parts.join('&');
}

function openPopup(providerConfig) {
  const preparedPopupOptions = preparePopupOptions(providerConfig.popupOptions);
  const stringifiedPopupOptions = stringifyPopupOptions(preparedPopupOptions);
  const qsObject = {
    display: providerConfig.display,
    scope: providerConfig.scope.join(providerConfig.scopeDelimiter),
    response_type: 'code',
    client_id: providerConfig.clientId,
    redirect_uri: providerConfig.redirectUri
  };
  const url = providerConfig.authorizationEndpoint + '?' + buildQueryString(qsObject);

  const popupWindow = window.open(url, '_blank', stringifiedPopupOptions);

  if (popupWindow && popupWindow.focus) {
    popupWindow.focus();
  }

  return popupWindow;
}

export default class Oauth {
  constructor(config) {
    const defaultConfig = getDefaults();

    this.config = {};
    for (const key of Object.keys(defaultConfig)) {
      this.config[key] = Object.assign({}, defaultConfig[key], config[key]);
    }
  }

  authenticatedRequest(provider, type) {
    const providerConfig = this.config[provider];
    const popupWindow = openPopup(providerConfig);

    return pollPopup(popupWindow).then((oauthData) => apiRequest(type, oauthData, providerConfig));
  }

  retrieveData(provider) {
    return this.authenticatedRequest(provider, 'dataUrl');
  }

  authenticate(provider) {
    return this.authenticatedRequest(provider, 'authUrl');
  }
}
