import { Component } from 'react';

export default class VKRetargeting extends Component {

  componentDidMount() {
    (window.Image ? (new Image()) : document.createElement('img')).src = window.location.protocol + '//vk.com/rtrg?r=GUhOCqSmSICvUITzlSRfRJM5YpK/0lf5gI/hKrLv8U/uxmsVd0wcwHm3JhJkC5mYr*o3BMuKYQ/p9I7*dayGE1uDdZf4XuBCuQADA4EQK5VuSD0juP9qE6b97LP5TfLHhGmGAmXbrclR/pLFOg09tiAfzYq*z9GuyT*SAV/GWY4-';
  }

  render() {
    return null;
  }
}
