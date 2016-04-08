import React, { Component, PropTypes } from 'react';
import { close as closeStyle } from '../Modal/styles.scss';
import styles from './ImagesPreview.scss';
import classNames from 'classnames';
import Overlay from 'react-toolbox/lib/overlay';

export default class ImagesPreview extends Component {

  static propTypes = {
    images: PropTypes.array,
    image: PropTypes.object,
    template: PropTypes.func,
    currentImageId: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      currentChangedImageId: props.currentImageId,
      active: false,
      overlayClosing: false
    };
  }

  handleClick = () => {
    this.setState({
      active: true,
      overlayClosing: false
    });
  }

  handleClose = () => {
    this.setState({
      overlayClosing: true
    });

    setTimeout(() => {
      this.setState({
        active: false
      });
    }, 500);
  }

  handleNavigation = (id) => {
    this.setState({
      currentChangedImageId: id
    });
  }

  handleNextImage = () => {
    const images = this.props.images ? this.props.images : [...this.props.image];
    const {currentChangedImageId} = this.state;
    if (currentChangedImageId === images.length - 1) {
      this.setState({
        currentChangedImageId: 0
      });
    } else {
      this.setState({
        currentChangedImageId: currentChangedImageId + 1
      });
    }
  }

  render() {
    const {currentImageId, template} = this.props;
    const images = this.props.images ? this.props.images : [...this.props.image];
    const {currentChangedImageId, active, overlayClosing} = this.state;
    const overlayClass = classNames(styles.overlay, active ? styles.overlayActive : '', overlayClosing ? styles.overlayClosing : '');
    return (
        <div>
          {!template && <img src={images[currentImageId].thumb.url} className="pointer" onClick={::this.handleClick}/>}
          {template && template(::this.handleClick)}
          {active &&
            <Overlay active={active} onClick={::this.handleClose} className={overlayClass}>
              <div className={styles.imagePreviewWrapper}>

                <div className={styles.imageWrapper}>
                  {
                    images.map((item, idx) => {
                      return <img className={classNames(styles.imagePreview, currentChangedImageId === idx ? styles.activePhoto : '')} src={images[idx].url} key={idx} onClick={this.handleNextImage}/>;
                    })
                  }
                  <div className={classNames(styles.imagePreviewNavigationWrapper, styles.mobile)}>
                    <ul className={styles.imagePreviewNavigation}>
                      {
                        images.map((item, idx) => {
                          return <span onClick={() => this.handleNavigation(idx)} key={idx} className={classNames(currentChangedImageId === idx ? styles.activeNav : '')}/>;
                        })
                      }
                    </ul>
                  </div>
                  <div className={closeStyle} onClick={::this.handleClose}></div>
                </div>
                <div className={styles.imagePreviewNavigationWrapper}>
                  <ul className={styles.imagePreviewNavigation}>
                    {
                      images.map((item, idx) => {
                        return <span onClick={() => this.handleNavigation(idx)} key={idx} className={classNames(currentChangedImageId === idx ? styles.activeNav : '')}/>;
                      })
                    }
                  </ul>
                </div>
              </div>
            </Overlay>
          }
        </div>
    );
  }
}
