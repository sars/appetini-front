import getVal from 'lodash/get';
import trim from 'lodash/trim';

export default function normalizeData(provider, data) {
  switch (provider) {
    case 'vkontakte':
      return {
        name: trim(`${getVal(data, 'first_name', '')} ${getVal(data, 'last_name', '')}`),
        email: getVal(data, 'email')
      };
    case 'facebook':
      return {
        name: trim(`${getVal(data, 'first_name', '')} ${getVal(data, 'last_name', '')}`),
        email: getVal(data, 'email')
      };
    default:
      return {};
  }
}
