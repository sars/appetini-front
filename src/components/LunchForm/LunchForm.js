import React, { PropTypes, Component } from 'react';
import Dropdown from 'components/Dropdown/Dropdown';
import CheckButtonsGroup from 'components/CheckButtonsGroup/CheckButtonsGroup';
import DatePicker from 'components/DatePicker/DatePicker';
import Input from 'components/Input/Input';
import Button from 'components/Button/Button';
import Checkbox from 'react-toolbox/lib/checkbox';
import MultiImagesField from 'components/ImageField/MultiImagesField';
import { reduxForm } from 'redux-form';
import { getCooks, getFoodPreferences } from 'redux/modules/common';
import classNames from 'classnames';
import styles from './styles.scss';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

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

@reduxForm(
  {
    form: 'lunchForm',
    fields: ['id', 'cook_id', 'amount', 'photos_temp_image_ids', 'initial_price', 'accept_rules',
      'dishes[].id', 'dishes[].name', 'dishes[].size', 'dishes[].dish_type', 'dishes[]._destroy',
      'removing_photos', 'food_preference_ids', 'ready_by_date', 'ready_by_time', 'dishes_count', 'photos']
    // https://github.com/erikras/redux-form/issues/621
    // https://github.com/erikras/redux-form/issues/514
    // initialValues: {
    //   dishes: [{name: '', size: ''}]
    // }
  },
  state => ({
    cooks: state.common.cooks,
    cookLoadState: state.common.loadState.cooks || {},
    foodPreferences: state.common.foodPreferences,
    foodPreferencesLoadState: state.common.loadState.foodPreferences || {}
  }),
  {getCooks, getFoodPreferences}
)
export default class LunchForm extends Component {
  static propTypes = {
    cooks: PropTypes.array,
    foodPreferences: PropTypes.array,
    cookLoadState: PropTypes.object,
    foodPreferencesLoadState: PropTypes.object,
    fields: PropTypes.object.isRequired,
    getCooks: PropTypes.func.isRequired,
    getFoodPreferences: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    error: PropTypes.object,
    acceptRules: PropTypes.bool,
    submitting: PropTypes.bool,
    title: PropTypes.string.isRequired,
    sendLabel: PropTypes.string.isRequired
  };

  componentDidMount() {
    if (!this.props.cooks && !this.props.cookLoadState.loading) {
      this.props.getCooks();
    }

    if (!this.props.foodPreferences && !this.props.foodPreferencesLoadState.loading) {
      this.props.getFoodPreferences();
    }
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

  addDish() {
    const { fields } = this.props;
    fields.dishes.addField();
    fields.dishes_count.onChange();
  }

  removeDish(index) {
    return () => {
      const { fields } = this.props;
      if (fields.dishes[index].id.value) {
        fields.dishes[index]._destroy.onChange(true);
      } else {
        fields.dishes.removeField(index);
      }

      fields.dishes_count.onChange();
    };
  }

  revertDish(dishField) {
    return (event) => {
      event.preventDefault();
      dishField._destroy.onChange(false);
    };
  }

  removePhoto(index, photos) {
    this.props.fields.removing_photos.onChange(photos);
  }

  handleTempImages(tempImages) {
    this.props.fields.photos_temp_image_ids.onChange(tempImages.map(item => item.id));
  }

  errorsFor(fieldName) {
    const { fields } = this.props;
    return fields[fieldName].error && !fields[fieldName].visited &&
      <div className={styles.error}>{fields[fieldName].error}</div>;
  }

  render() {
    const cooks = this.getCooks();
    const preferences = this.getPreferences();
    const { fields, title, acceptRules, handleSubmit, submitting, sendLabel } = this.props;

    return (
      <form className={styles.root} onSubmit={handleSubmit}>
        <h1>{title}</h1>
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
          <MultiImagesField onRemove={::this.removePhoto} onTempImages={::this.handleTempImages}
                            value={fields.photos.value} removingImages={fields.removing_photos.value}
          />
          {this.errorsFor('photos')}
        </div>
        <div className={styles.section}>
          <h3>Состав обеда</h3>
          <table className={styles.dishesTable}>
            <ReactCSSTransitionGroup component="tbody" transitionEnterTimeout={310} transitionLeaveTimeout={310} transitionName="dish-tr">
              <tr key="0">
                <th>Название</th>
                <th className={styles.dishSizeCol}>Размер</th>
                <th className={styles.dishTypeCol}>Тип</th>
              </tr>
              {fields.dishes.map((dishField, index) =>
                dishField._destroy.value
                ? <tr key={index + 1}>
                    <td className={styles.removeDishTd} colSpan="3">
                      <a href="#" onClick={::this.revertDish(dishField)}>
                        Отменить удаление "{dishField.name.value}"
                      </a>
                    </td>
                  </tr>
                : <tr key={index + 1}>
                    <td><Input {...dishField.name}/></td>
                    <td className={styles.dishSizeCol}><Input {...dishField.size}/></td>
                    <td className={styles.dishTypeCol}><Dropdown source={dishTypes} {...dishField.dish_type}/></td>
                    <td>
                      {fields.dishes.length > 0 && <Button icon="remove" floating accent mini onClick={::this.removeDish(index)}/>}
                    </td>
                  </tr>
              )}
            </ReactCSSTransitionGroup>
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
          {this.errorsFor('food_preference_ids')}
        </div>

        {acceptRules &&
          <div className={styles.acceptRules}>
            <Checkbox {...fields.accept_rules}
              label="Я принимаю условия и помню про чистые руки, гигиену, правила упаковки и доставки"
            />
          </div>
        }

        <div className={styles.acceptRules}>
          <Button flat accent label={sendLabel} type="submit" disabled={submitting}/>
        </div>

      </form>
    );
  }
}
