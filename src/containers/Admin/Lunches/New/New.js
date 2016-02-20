import React, { PropTypes, Component } from 'react';
import Dropdown from 'components/Dropdown/Dropdown';
import CheckButtonsGroup from 'components/CheckButtonsGroup/CheckButtonsGroup';
import DatePicker from 'components/DatePicker/DatePicker';
import Input from 'components/Input/Input';
import Button from 'components/Button/Button';
import Checkbox from 'react-toolbox/lib/checkbox';
import Dropzone from 'react-dropzone';
import { reduxForm } from 'redux-form';
import { addTempImage, removeTempImage, createLunch } from 'redux/modules/creatingLunch';
import { getCooks, getFoodPreferences } from 'redux/modules/common';
import normalizeErrors from 'helpers/normalizeErrors';
import { show as showToast } from 'redux/modules/toast';
import moment from 'moment';
import classNames from 'classnames';
import styles from './styles.scss';

const dishTypes = [
  { label: 'Выберите тип' },
  { label: 'Салат', value: 'salad' },
  { label: 'Суп', value: 'soup' },
  { label: 'Основное', value: 'main' },
  { label: 'Гарнир', value: 'side' }
];

const deliveryTimeOptions = [
  { label: 'Выберите время' },
  { value: new Date(2000, 0, 1, 12, 30).toString(), label: '12:30 - 13:00' },
  { value: new Date(2000, 0, 1, 13, 30).toString(), label: '13:30 - 14:00' }
];

function readyByDateTime(date, time) {
  return date && time && moment(date).set({hours: time.getHours(), time: time.getMinutes()});
}

@reduxForm(
  {
    form: 'lunch',
    fields: ['cook_id', 'amount', 'photos_temp_image_ids', 'initial_price', 'accept_rules', 'food_preference_ids',
             'dishes[].name', 'dishes[].size', 'dishes[].dish_type', 'ready_by_date', 'ready_by_time', 'dishes_count']
    // https://github.com/erikras/redux-form/issues/621
    // https://github.com/erikras/redux-form/issues/514
    // initialValues: {
    //   dishes: [{name: '', size: ''}]
    // }
  },
  state => ({
    cooks: state.common.cooks,
    cookLoadState: state.common.loadState.cooks || {},
    tempImages: state.creatingLunch.tempImages,
    foodPreferences: state.common.foodPreferences,
    foodPreferencesLoadState: state.common.loadState.foodPreferences || {}
  }),
  {addTempImage, removeTempImage, getCooks, getFoodPreferences, createLunch, showToast}
)
export default class New extends Component {
  static propTypes = {
    cooks: PropTypes.array,
    foodPreferences: PropTypes.array,
    cookLoadState: PropTypes.object,
    foodPreferencesLoadState: PropTypes.object,
    fields: PropTypes.object.isRequired,
    tempImages: PropTypes.array.isRequired,
    createLunch: PropTypes.func.isRequired,
    getCooks: PropTypes.func.isRequired,
    getFoodPreferences: PropTypes.func.isRequired,
    addTempImage: PropTypes.func.isRequired,
    removeTempImage: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired,
    error: PropTypes.object
  };


  static contextTypes = {
    client: PropTypes.object.isRequired
  };

  componentDidMount() {
    if (!this.props.cooks && !this.props.cookLoadState.loading) {
      this.props.getCooks();
    }

    if (!this.props.foodPreferences && !this.props.foodPreferencesLoadState.loading) {
      this.props.getFoodPreferences();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.tempImages !== nextProps.tempImages) {
      console.log('rgerg');
      nextProps.fields.photos_temp_image_ids.onChange(nextProps.tempImages.map(item => item.id));
    }
  }

  onDrop(files) {
    files.forEach(file => {
      this.context.client.post('/temp_images', { attach: {'resource[image]': file} }).then(responce => {
        this.props.addTempImage(responce.resource);
      }).catch(error => console.log(error));
    });
  }

  getCooks() {
    const { cooks } = this.props;
    return cooks ? [
      { label: 'Выберите кулинара' },
      ...cooks.map(cook => ({label: cook.first_name + ' ' + cook.last_name, value: cook.id.toString()}))
    ] : [{ label: 'Загрузка...' }];
  }

  getPreferences() {
    const { foodPreferences } = this.props;
    return foodPreferences && foodPreferences.reduce((result, preference) => ({...result, [preference.id]: preference.name}), {});
  }

  removeTempImage(tempImage) {
    return () => {
      this.props.removeTempImage(tempImage);
    };
  }

  addDish() {
    const { fields } = this.props;
    fields.dishes.addField();
    fields.dishes_count.onChange(fields.dishes.length + 1);
  }

  removeDish(index) {
    return () => {
      const { fields } = this.props;
      fields.dishes.removeField(index);
      fields.dishes_count.onChange(fields.dishes.length - 1);
    };
  }

  errorsFor(fieldName) {
    const { fields } = this.props;
    return fields[fieldName].error && !fields[fieldName].visited &&
      <div className={styles.error}>{fields[fieldName].error}</div>;
  }

  submit() {
    this.props.handleSubmit(lunch => {
      lunch.dishes_attributes = lunch.dishes;

      return new Promise((resolve, reject) => {
        const lunchAttributes = {...lunch, ready_by: readyByDateTime(lunch.readyByDate, lunch.readyByTime)};
        this.props.createLunch(lunchAttributes).then(response => {
          this.props.showToast('Обед успешно добавлен');
          resolve(response);
        })
        .catch(response => {
          const errors = normalizeErrors(response.errors);
          errors.photos_temp_image_ids = errors.photos;
          reject({...errors, _error: errors});
        });
      });
    })();
  }

  render() {
    const cooks = this.getCooks();
    const preferences = this.getPreferences();
    const { fields } = this.props;

    return (
      <div className={styles.root}>
        <h1>Создание обеда</h1>
        <div className={classNames(styles.section, styles.twoColSection)}>
          <div>
            <h3>Кулинар</h3>
            <Dropdown auto source={cooks} size="15" {...fields.cook_id}/>
          </div>
        </div>
        <div className={classNames(styles.section, styles.twoColSection)}>
          <div>
            <h3>Дата</h3>
            <DatePicker minDate={new Date()} {...fields.ready_by_date}/>
          </div>
          <div>
            <h3>Время</h3>
            <Dropdown auto source={deliveryTimeOptions} size="15" {...fields.ready_by_time}/>
          </div>
        </div>
        <div className={classNames(styles.section, styles.twoColSection)}>
          <div>
            <h3>Количество</h3>
            <Input {...fields.amount}/>
          </div>
        </div>
        <div className={styles.section}>
          <h3>Фотографии</h3>
          <Dropzone ref="dropzone" onDrop={::this.onDrop} className={styles.dropzone} activeClassName={styles.activeDropzone}>
            <div>Try dropping some files here, or click to select files to upload.</div>
          </Dropzone>
          <div className={styles.imagesPreviews}>
            {this.props.tempImages.map(tempImage =>
              <div className={styles.imagePreview} key={tempImage.id}>
                <img src={tempImage.image.thumb.url}/>
                <Button className={styles.imagePreviewRemove} icon="remove" accent mini onClick={::this.removeTempImage(tempImage)} />
              </div>
            )}
          </div>
          {this.errorsFor('photos_temp_image_ids')}
        </div>
        <div className={styles.section}>
          <h3>Состав обеда</h3>
          <table className={styles.dishesTable}>
            <tbody>
              <tr>
                <th>Название</th>
                <th className={styles.dishSizeCol}>Размер</th>
                <th className={styles.dishTypeCol}>Тип</th>
              </tr>
              {fields.dishes.map((dishField, index) =>
                <tr key={index}>
                  <td><Input {...dishField.name}/></td>
                  <td className={styles.dishSizeCol}><Input {...dishField.size}/></td>
                  <td className={styles.dishTypeCol}><Dropdown source={dishTypes} {...dishField.dish_type}/></td>
                  {fields.dishes.length > 0 &&
                    <td><Button icon="remove" floating accent mini onClick={::this.removeDish(index)}/></td>
                  }
                </tr>
              )}
            </tbody>
          </table>
          <Button flat outlined label="Добавить" onClick={::this.addDish}/>
          {this.errorsFor('dishes_count')}
        </div>
        <div className={styles.section}>
          <h3>Цена</h3>
          <Input {...fields.initial_price}/>
        </div>
        <div className={styles.section}>
          <h3>Предпочтения</h3>
          <CheckButtonsGroup source={preferences} {...fields.food_preference_ids}/>
        </div>
        <div className={styles.acceptRules}>
          <Checkbox {...fields.accept_rules}
            label="Я принимаю условия и помню про чистые руки, гигиену, правила упаковки и доставки"
          />
        </div>

        <div className={styles.acceptRules}>
          <Button flat accent label="Создать обед" onClick={::this.submit}/>
        </div>
      </div>
    );
  }
}
