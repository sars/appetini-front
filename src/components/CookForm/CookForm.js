import React, { PropTypes, Component } from 'react';
import Input from 'components/Input/Input';
import Button from 'components/Button/Button';
import MultiImagesField from 'components/ImageField/MultiImagesField';
import ImageField from 'components/ImageField/ImageField';
import AddressSuggest from 'components/AddressSuggest/AddressSuggest';
import { show as showToast} from 'redux/modules/toast';
import { reduxForm } from 'redux-form';
import classNames from 'classnames';
import styles from './styles.scss';

@reduxForm(
  {
    form: 'cookForm',
    fields: ['id', 'main_photo_temp_image_id', 'other_photos_temp_image_ids', 'removing_other_photos', 'removing_sanitary_book_photos',
      'sanitary_book_photos', 'sanitary_book_photos_temp_image_ids', 'first_name', 'last_name', 'first_name_genitive', 'last_name_genitive', 'other_photos', 'main_photo', 'location_attributes', 'location',
      'user.id', 'user.phone', 'user.email', 'user.password', 'user.facebook', 'user.vkontakte', 'fee_percent']
  }, null, {showToast}
)
export default class CookForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired,
    error: PropTypes.object,
    submitting: PropTypes.bool,
    title: PropTypes.string.isRequired,
    sendLabel: PropTypes.string.isRequired
  };

  onDrop(files) {
    files.forEach(file => {
      this.context.client.post('/temp_images', { attach: {'resource[image]': file} }).then(responce => {
        this.setState({ tempImage: responce.resource });
      }).catch(() => this.props.showToast('Ошибка при добавлении картинки'));
    });
  }

  removeOtherPhoto(index, photos) {
    this.props.fields.removing_other_photos.onChange(photos);
  }

  removeSanitaryBookPhoto(index, photos) {
    this.props.fields.removing_sanitary_book_photos.onChange(photos);
  }

  errorsFor(fieldName) {
    const { fields } = this.props;
    return fields[fieldName].error && !fields[fieldName].visited &&
      <div className={styles.error}>{fields[fieldName].error}</div>;
  }

  render() {
    const { fields, title, handleSubmit, submitting, sendLabel } = this.props;

    return (
      <form className={styles.root} onSubmit={handleSubmit}>
        <h1>{title}</h1>
        <div className={classNames(styles.section, styles.twoColSection)}>
          <div>
            <h3>Имя</h3>
            <Input {...fields.first_name}/>
          </div>
          <div>
            <h3>Фамилия</h3>
            <Input {...fields.last_name}/>
          </div>
        </div>
        <div className={classNames(styles.section, styles.twoColSection)}>
          <div>
            <h3>Имя (родительный)</h3>
            <Input {...fields.first_name_genitive}/>
          </div>
          <div>
            <h3>Фамилия (родительный)</h3>
            <Input {...fields.last_name_genitive}/>
          </div>
        </div>


        <input type="hidden" {...fields.user.id}/>

        <div className={styles.section}>
          <h3>Телефон</h3>
          <Input {...fields.user.phone}/>
        </div>

        <div className={styles.section}>
          <h3>Email</h3>
          <Input type="email" {...fields.user.email}/>
        </div>

        <div className={styles.section}>
          <h3>Password</h3>
          <Input type="password" {...fields.user.password}/>
        </div>

        <div className={classNames(styles.section, styles.twoColSection)}>
          <div>
            <h3>Facebook</h3>
            <Input {...fields.user.facebook}/>
          </div>
          <div>
            <h3>Vkontakte</h3>
            <Input {...fields.user.vkontakte}/>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Основное фото</h3>
          <ImageField onTempImage={fields.main_photo_temp_image_id.onChange} value={fields.main_photo.value}/>
          {this.errorsFor('main_photo')}
        </div>

        <div className={styles.section}>
          <h3>Другие фото</h3>
          <MultiImagesField onRemove={::this.removeOtherPhoto} onTempImages={fields.other_photos_temp_image_ids.onChange}
                            value={fields.other_photos.value} tempImagesIds={fields.other_photos_temp_image_ids.value} removingImages={fields.removing_other_photos.value}
          />
          {this.errorsFor('other_photos')}
        </div>
        <div className={styles.section}>
          <h3>Фото санитарной книги</h3>
          <MultiImagesField onRemove={::this.removeSanitaryBookPhoto} onTempImages={fields.sanitary_book_photos_temp_image_ids.onChange}
                            value={fields.sanitary_book_photos.value} tempImagesIds={fields.sanitary_book_photos_temp_image_ids.value} removingImages={fields.removing_sanitary_book_photos.value}
          />
          {this.errorsFor('sanitary_book_photos')}
        </div>

        <div className={styles.section}>
          <h3>Адрес</h3>
          <AddressSuggest onSuggestSelect={::this.props.fields.location.onChange} location={fields.location.value} />
          {this.errorsFor('location')}
        </div>

        <div className={styles.section}>
          <h3>Fee percent</h3>
          <Input type="number" {...fields.fee_percent} min="0" max="100" step="1"/>
        </div>

        <div className={styles.submitContainer}>
          <Button flat accent label={sendLabel} type="submit" disabled={submitting}/>
        </div>

      </form>
    );
  }
}
