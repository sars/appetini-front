import React, { PropTypes, Component } from 'react';
import styles from './styles.scss';
import Input from 'components/Input/Input';
import MultiImagesField from 'components/ImageField/MultiImagesField';
import Dropdown from 'components/Dropdown/Dropdown';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Button from 'components/Button/Button';
import Checkbox from 'react-toolbox/lib/checkbox';

const dishTypes = [
  { label: 'Выберите тип' },
  { label: 'Салат', value: 'salad' },
  { label: 'Суп', value: 'soup' },
  { label: 'Основное', value: 'main' },
  { label: 'Гарнир', value: 'side' }
];

export default class BaseLunchForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired
  };

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

  errorsFor(fieldName) {
    const { fields } = this.props;
    return fields[fieldName].error && !fields[fieldName].visited &&
      <div className={styles.error}>{fields[fieldName].error}</div>;
  }

  descriptionField() {
    return (
      <div>
        <h3>Описание</h3>
        <Input {...this.props.fields.description} multiline={true}/>
      </div>
    );
  }

  photosField() {
    const { fields } = this.props;
    return (
      <div className={styles.section}>
        <h3>Фотографии</h3>
        <MultiImagesField onRemove={::this.removePhoto} tempImagesIds={fields.photos_temp_image_ids.value} onTempImages={fields.photos_temp_image_ids.onChange}
                          value={fields.photos.value} removingImages={fields.removing_photos.value}
        />
        {this.errorsFor('photos_temp_image_ids')}
      </div>
    );
  }

  dishesField() {
    const { fields } = this.props;
    return (
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
                  {fields.dishes.length > 0 && <Button type="button" icon="remove" floating accent mini onClick={::this.removeDish(index)}/>}
                </td>
              </tr>
            )}
          </ReactCSSTransitionGroup>
        </table>

        <Button type="button" flat outlined label="Добавить" onClick={::this.addDish}/>
        {this.errorsFor('dishes_count')}
      </div>
    );
  }

  priceField() {
    return (
      <div className={styles.section}>
        <h3>Цена</h3>
        <Input {...this.props.fields.initial_price}/>
      </div>
    );
  }

  acceptRulesField() {
    return (
      <div className={styles.acceptRules}>
        <Checkbox {...this.props.fields.accept_rules}
                  label="Я принимаю условия и помню про чистые руки, гигиену, правила упаковки и доставки"
        />
      </div>
    );
  }

  submitButton(label, submitting) {
    return (
      <Button flat accent label={label} type="submit" disabled={submitting}/>
    );
  }

}
