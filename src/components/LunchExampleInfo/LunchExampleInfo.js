import React, { PropTypes, Component } from 'react';
import Input from 'components/Input/Input';
import ImagesPreview from 'components/ImagesPreview/ImagesPreview';
import styles from './styles.scss';
import isEmpty from 'lodash/isEmpty';

export default class LunchExampleInfo extends Component {
  static propTypes = {
    lunchExampleId: PropTypes.number
  };

  static contextTypes = {
    client: PropTypes.object.isRequired
  };

  state = {
    lunchExample: {}
  };

  componentDidMount() {
    const { lunchExampleId } = this.props;
    if (lunchExampleId) {
      this.context.client.get(`/lunch_examples/${lunchExampleId}`).then(response => this.setState({lunchExample: response.resource}));
    }
  }

  dishesTable(lunchExample) {
    return (
      <table className={styles.dishesTable}>
        <thead>
          <tr>
            <th>Название</th>
            <th>Размер</th>
            <th>Тип</th>
          </tr>
        </thead>
        <tbody>
          {lunchExample.dishes.map((dishField, index) =>
            <tr key={index}>
              <td><Input disabled value={dishField.name}/></td>
              <td className={styles.dishCol}>{this.inputField(dishField.size)}</td>
              <td className={styles.dishType}>{this.dishTypeField(dishField.dish_type)}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  dishTypeField(value) {
    const dishTypes = {
      salad: 'Салат', soup: 'Суп', main: 'Основное', side: 'Гарнир'
    };
    return (
      <Input disabled value={dishTypes[value]}/>
    );
  }

  inputField(value, multi) {
    return (
      <Input disabled value={value} multiline={multi}/>
    );
  }

  imageField(lunchExample) {
    return (
      <ImagesPreview images={lunchExample.photos} currentImageId={0}/>
    );
  }

  render() {
    const { lunchExample } = this.state;
    const fields = !isEmpty(lunchExample)
      ? [{name: 'Кулинар', data: this.inputField(lunchExample.cook.full_name)},
        {name: 'Фотографии', data: this.imageField(lunchExample)},
        {name: 'Описание', data: this.inputField(lunchExample.description, true)},
        {name: 'Состав обеда', data: this.dishesTable(lunchExample)},
        {name: 'Цена', data: this.inputField(Number(lunchExample.initial_price) + ' грн')}
      ] : [];

    return (
      <div className={styles.lunchExampleInfo}>
        {fields.map((field, idx) => {
          return (
            <div key={idx} className={styles.field}>
              <h3>{field.name}</h3>
              {field.data}
            </div>
          );
        })}
      </div>
    );
  }
}
