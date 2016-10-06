import valueFromLocationQuery from 'helpers/valueFromLocationQuery';
import isArray from 'lodash/isArray';
const logo = 'http://appetini.com/logo.png';

const getKey = (key, fromMetas) => {
  return fromMetas ? key : `meta_${key}`;
};

export const prepareMetaForReducer = (resources, key, value, fromMetas) => {
  const resource = isArray(resources) ? resources.find(item => item[key] === value) : resources;
  return resource ? {
    title: resource[getKey('title', fromMetas)],
    description: resource[getKey('description', fromMetas)],
    image: resource[getKey('image', fromMetas)] || logo,
    url: resource[getKey('url')]
  } : {};
};


export const lunchesMeta = (props) => {
  if (valueFromLocationQuery(props, 'preferences')) {
    return prepareMetaForReducer(props.preferences, 'id', valueFromLocationQuery(props, 'preferences'));
  }
  if (valueFromLocationQuery(props, 'cook_id')) {
    return prepareMetaForReducer(props.cooks.resources, 'id', valueFromLocationQuery(props, 'cook_id'));
  }
  return false;
};


const getMeta = (meta) => {
  return [
    // vk
    {name: 'title', content: meta.title},
    {name: 'description', content: meta.description},
    {name: 'image', content: meta.image},
    {name: 'url', content: meta.url},
    {name: 'site_name', content: meta.site_name},
    // fb
    {property: 'og:title', content: meta.title},
    {property: 'og:description', content: meta.description},
    {property: 'og:image', content: meta.image},
    {property: 'og:url', content: meta.url},
    {property: 'og:site_name', content: meta.site_name},
    // twitter
    {name: 'twitter:title', content: meta.title},
    {name: 'twitter:description', content: meta.description},
    {name: 'twitter:image:src', content: meta.image},
    {name: 'twitter:domain', content: meta.site_name}
  ];
};

export default getMeta;
