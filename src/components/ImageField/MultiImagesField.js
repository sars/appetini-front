import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { show as showToast } from 'redux/modules/toast';
import without from 'lodash/without';
import { tempImageRequest } from 'helpers/tempImageRequest';
import styles from './styles.scss';

@connect(null, { showToast })
export default class MultiImagesField extends Component {
  static propTypes = {
    showToast: PropTypes.func.isRequired,
    onRemove: PropTypes.func,
    onTempImages: PropTypes.func.isRequired,
    value: PropTypes.array,
    removingImages: PropTypes.array,
    tempImagesIds: PropTypes.array
  };

  static contextTypes = {
    client: PropTypes.object.isRequired
  };

  static defaultProps = {
    removingImages: []
  };

  state = {
    tempImages: []
  };

  componentWillReceiveProps = (nextProps) => {
    if (!nextProps.tempImagesIds || !nextProps.tempImagesIds.length) this.setState({tempImages: []});
  };

  onDrop(files) {
    files.forEach(file => {
      tempImageRequest(this.context.client, file).then(tempImage => {
        const tempImages = [...this.state.tempImages, tempImage];
        this.props.onTempImages(tempImages.map(item => item.id));
        this.setState({ tempImages });
      }).catch(error => this.props.showToast(error));
    });
  }

  removeTempImage(tempImage) {
    return () => {
      const tempImages = without(this.state.tempImages, tempImage);
      this.props.onTempImages(tempImages.map(item => item.id));
      this.setState({ tempImages });
    };
  }

  removeImage(index) {
    const { onRemove, removingImages } = this.props;
    return onRemove(index, [...removingImages, index]);
  }

  render() {
    const { value, removingImages } = this.props;
    const { tempImages } = this.state;
    return (
      <div>
        <Dropzone ref="dropzone" onDrop={::this.onDrop} className={styles.dropzone} activeClassName={styles.activeDropzone}>
          <div>Перетяните в эту зону изображения, либо нажмите и укажите путь.</div>
        </Dropzone>
        <div className={styles.imagesPreviews}>
          {tempImages.map(tempImage =>
            <div className={styles.imagePreview} key={tempImage.id}>
              <img src={tempImage.image.thumb.url}/>
              <span className={styles.imagePreviewRemove} onClick={() => this.removeTempImage(tempImage)}><span className="fa fa-minus"/></span>
            </div>
          )}
          {value && value.map((image, index) =>
            removingImages.indexOf(index) === -1 &&
              <div className={styles.imagePreview} key={index}>
                <img src={image.thumb.url}/>
                <span className={styles.imagePreviewRemove} onClick={() => this.removeImage(index)}><span className="fa fa-minus"/></span>
              </div>
          )}
        </div>
      </div>
    );
  }
}
