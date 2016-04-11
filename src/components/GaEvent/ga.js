const gAnalytics = (eventCategory) => {
  if (window.ga) {
    window.ga('send', {
      hitType: 'event',
      eventCategory: eventCategory,
      eventAction: 'click'
    });
  }
};

export default gAnalytics;
