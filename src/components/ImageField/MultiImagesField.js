import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';
import Button from 'components/Button/Button';
import { connect } from 'react-redux';
import { show as showToast } from 'redux/modules/toast';
import without from 'lodash/without';
import { tempImageRequest } from './helpers';
import styles from './styles.scss';

@connect(null, { showToast })
export default class MultiImagesField extends Component {
  static propTypes = {
    showToast: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onTempImages: PropTypes.func.isRequired,
    value: PropTypes.array,
    removingImages: PropTypes.array
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

  onDrop(files) {
    files.forEach(file => {
      tempImageRequest(this.context.client, file).then(tempImage => {
        const tempImages = [...this.state.tempImages, tempImage];
        this.props.onTempImages(tempImages);
        this.setState({ tempImages });
      }).catch(error => this.props.showToast(error));
    });
  }

  removeTempImage(tempImage) {
    return () => {
      const tempImages = without(this.state.tempImages, tempImage);
      this.props.onTempImages(tempImages);
      this.setState({ tempImages });
    };
  }

  removeImage(index) {
    return () => {
      const { onRemove, removingImages } = this.props;
      onRemove(index, [...removingImages, index]);
    };
  }

  render() {
    const { value, removingImages } = this.props;
    const { tempImages } = this.state;
    return (
      <div>
        <Dropzone ref="dropzone" onDrop={::this.onDrop} className={styles.dropzone} activeClassName={styles.activeDropzone}>
          <div>Try dropping some files here, or click to select files to upload.</div>
        </Dropzone>
        <div className={styles.imagesPreviews}>
          {tempImages.map(tempImage =>
            <div className={styles.imagePreview} key={tempImage.id}>
              <img src={tempImage.image.thumb.url}/>
              <Button className={styles.imagePreviewRemove} icon="remove" accent mini onClick={::this.removeTempImage(tempImage)} />
            </div>
          )}
          {value && value.map((image, index) =>
            removingImages.indexOf(index) === -1 &&
              <div className={styles.imagePreview} key={index}>
                <img src={image.thumb.url}/>
                <Button className={styles.imagePreviewRemove} icon="remove" accent mini onClick={::this.removeImage(index)} />
              </div>
          )}
        </div>
      </div>
    );
  }
}
