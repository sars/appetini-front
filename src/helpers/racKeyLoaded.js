const racKeyLoaded = (store, key) => {
  return Boolean(store.getState().reduxAsyncConnect[key]);
};

export default racKeyLoaded;
