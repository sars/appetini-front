export default function valueFromLocationQuery(props, name) {
  const value = props.location.query && props.location.query[name];
  return value && JSON.parse(value);
}
