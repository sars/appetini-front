import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { show as showToast } from 'redux/modules/toast';
import { tempImageRequest } from 'helpers/tempImageRequest';
import styles from './styles.scss';

@connect(null, { showToast })
export default class ImageField extends Component {
  static propTypes = {
    showToast: PropTypes.func.isRequired,
    onTempImage: PropTypes.func.isRequired,
    value: PropTypes.object
  };

  static contextTypes = {
    client: PropTypes.object.isRequired
  };

  state = {
    tempImage: null
  };

  onDrop(files) {
    files.forEach(file => {
      tempImageRequest(this.context.client, file).then(tempImage => {
        this.props.onTempImage(tempImage && tempImage.id);
        this.setState({ tempImage });
      }).catch(error => this.props.showToast(error));
    });
  }

  removeTempImage() {
    this.props.onTempImage(null);
    this.setState({ tempImage: null });
  }

  render() {
    const { value } = this.props;
    const { tempImage } = this.state;
    return (
      <div>
        <Dropzone ref="dropzone" onDrop={::this.onDrop} multiple={false}
                  className={styles.dropzone} activeClassName={styles.activeDropzone}>
          <div>Перетяните в эту зону изображение, либо нажмите и укажите путь.</div>
        </Dropzone>
        <div className={styles.imagesPreviews}>
          {tempImage ?
            <div className={styles.imagePreview}>
              <img src={tempImage.image.thumb.url}/>
              <span className={styles.imagePreviewRemove} onClick={::this.removeTempImage}><span className="fa fa-minus"/></span>
            </div> :
            value && <div className={styles.imagePreview}>
              <img src={value.thumb.url}/>
            </div>
          }
        </div>
      </div>
    );
  }
}
