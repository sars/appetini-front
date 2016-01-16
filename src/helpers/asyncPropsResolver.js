export default (Component, params, cb) => {
  const result = Component.loadProps(params);
  return result ? result.then(cb, cb) : cb();
};
