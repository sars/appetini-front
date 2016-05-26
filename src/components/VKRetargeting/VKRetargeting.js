import { Component } from 'react';

export default class VKRetargeting extends Component {

  componentDidMount() {
    (window.Image ? (new Image()) : document.createElement('img')).src = window.location.protocol + '//vk.com/rtrg?r=bk0UW9kIErJ49JK5XehMqiGOHwZsAo0IT4z/6uPAWVIDOS*4rBvkgTgYjgYj4P7QGra*FtO5f6ZXa8898NRVRfc7ffU0GeneMmvzmdgjOiqNGi6UAID5vWMTjGqJI0Ruc2fx6cYFsTsVy9aBFOGNgmqjkF6Ut17CeA5atVgEjK0-';
  }

  render() {
    return null;
  }
}
