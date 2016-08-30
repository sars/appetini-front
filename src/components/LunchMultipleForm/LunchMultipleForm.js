import React, { PropTypes, Component } from 'react';
import { reduxForm } from 'redux-form';
import styles from './styles.scss';
import Card from 'components/Card/Card';
import DishList from 'components/DishList/DishList';
import Checkbox from 'react-toolbox/lib/checkbox';
import ImagesPreview from 'components/ImagesPreview/ImagesPreview';
import DeliveryTimeDropdown from 'components/DeliveryTimeDropdown/DeliveryTimeDropdown';
import DatePicker from 'components/DatePicker/DatePicker';
import Input from 'components/Input/Input';
import Button from 'components/Button/Button';

@reduxForm(
  {
    form: 'lunchMultipleForm',
    fields: ['lunchExamples[].id', 'lunchExamples[].lunchItems[].available_count', 'lunchExamples[].lunchItems[].team',
      'lunchExamples[].lunchItems[].ready_by_time', 'lunchExamples[].lunchItems[].ready_by_date']
  }
)
export default class LunchMultipleForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    lunchExamples: PropTypes.array.isRequired,
    error: PropTypes.string,
    submitting: PropTypes.bool
  };

  lunchExampleInfo(lunchExampleId, lunchExamples) {
    const item = lunchExamples.find(example => example.id === lunchExampleId);
    return (
      <div className={styles.lunchExampleBlock}>
        <div>{item.id}</div>
        <div>{item.cook.full_name_genitive}</div>
        <div>
          <DishList dishes={item.dishes}/>
        </div>
        <div className={styles.hiddenXs}>
          <div className={styles.photoWrapper}>
            <ImagesPreview images={item.photos} currentImageId={0}/>
          </div>
        </div>
        <div className={styles.hiddenXs}>{Number(item.price) + ' грн'}</div>
      </div>
    );
  }

  lunchTable(lunches) {
    return (
      <table className={styles.table}>
        {!!lunches.length && <thead>
          <tr>
            <td>Корпоративный</td>
            <td>Количество</td>
            <td>Дата</td>
            <td>Время</td>
          </tr>
        </thead>}
        <tbody>
          {lunches.map((lunch, index) =>
            <tr key={index}>
              <td>
                <Checkbox className={styles.team} {...lunch.team}/>
              </td>
              <td>
                <Input {...lunch.available_count}/>
              </td>
              <td>
                {!lunch.team.value && <DatePicker readonly={!!lunch.team.value} minDate={new Date()} {...lunch.ready_by_date}/>}
              </td>
              <td>
                {!lunch.team.value && <DeliveryTimeDropdown disabled={!!lunch.team.value} {...lunch.ready_by_time}/>}
              </td>
              <td>
                <Button type="button" icon="remove" floating accent mini onClick={() => lunches.removeField(index)}/>
              </td>
            </tr>
          )}
          <tr>
            <td colSpan="5">
              <Button type="button" flat outlined label="Добавить обед" onClick={() => lunches.addField()}/>
            </td>
          </tr>
          </tbody>
      </table>
    );
  }

  render() {
    const { fields, lunchExamples, handleSubmit, submitting, error } = this.props;
    return (
      <form className={styles.rootMultiple} onSubmit={handleSubmit}>
        <h1>Множественное добавление обедов</h1>
        <div className={styles.lunchExampleInfo}>
          {fields.lunchExamples.length > 0 ?
            fields.lunchExamples.map((lunchExample, index) =>
              <Card className={styles.lunchExampleCard} key={index}>
                {this.lunchExampleInfo(lunchExample.id.value, lunchExamples)}
                {this.lunchTable(lunchExample.lunchItems)}
              </Card>
            )
            : <div>Нет выбраных шаблонов</div>}
        </div>
        {!!error && <div className={styles.error}>{error}</div>}
        <Button className={styles.submitBtn} flat accent label="Создать обеды" type="submit" disabled={submitting || !fields.lunchExamples.length}/>
      </form>
    );
  }
}
