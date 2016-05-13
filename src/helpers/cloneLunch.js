import isObject from 'lodash/isObject';
import { tempImageRequest } from './tempImageRequest';
import cloneDeep from 'lodash/cloneDeep';
import mimeTypes from 'mime-types';

const getFileFromUrl = (url) => {
  return fetch(url, {
    method: 'GET'
  }).then((response) => {
    return response.arrayBuffer().then((array) => {
      const arrayBufferView = new Uint8Array( array );
      return new Blob([ arrayBufferView ], { type: mimeTypes.lookup(url) });
    });
  });
};

const removeIds = (obj) => {
  for (const key in obj) {
    if (key === 'id') {
      obj[key] = null;
    }
    if (isObject(obj[key])) {
      removeIds(obj[key]);
    }
  }
};

const cloneLunch = (lunch, client) => {
  return Promise.all(lunch.photos.map((item) => {
    return getFileFromUrl(item.url).then((blob) => {
      const file = new File([blob], item.url.split('/').pop());
      return tempImageRequest(client, file);
    });
  }))
    .then((images) => {
      const newLunch = cloneDeep(lunch);
      removeIds(newLunch);
      newLunch.photos_temp_image_ids = images.map(img => img.id);
      newLunch.photos = images.map(img => img.image);
      return newLunch;
    });
};

export default cloneLunch;
