const fbEvent = (...params) => {
  if (window.fbq) {
    window.fbq(...params);
  }
};

export default fbEvent;
