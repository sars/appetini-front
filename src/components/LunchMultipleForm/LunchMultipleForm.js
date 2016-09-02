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
import classNames from 'classnames';

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

  state = {
    allLunches: {}
  }

  setToAllLunches = (field, value) => {
    this.setState({
      allLunches: {
        ...this.state.allLunches,
        [field]: value
      }
    });
    this.props.fields.lunchExamples.forEach(lunch => lunch.lunchItems.forEach(item => item[field].onChange(value)));
  }

  addLunchItems = (date) => {
    this.props.fields.lunchExamples.forEach(lunch => {
      lunch.lunchItems.addField({ready_by_date: date});
    });
  }

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
                <DatePicker disabled={!!lunch.team.value} minDate={new Date()} {...lunch.ready_by_date}/>
              </td>
              <td>
                <DeliveryTimeDropdown disabled={!!lunch.team.value} {...lunch.ready_by_time}/>
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

  allLunchesAttrsTable = () => {
    const { allLunches } = this.state;
    return (
      <Card className={styles.lunchExampleCard}>
        <h2 className={styles.allLunchesSetterTitle}>Множественное задание параметров</h2>
        <table className={classNames(styles.table, styles.allLunchesTable)}>
          <thead>
          <tr>
            <td>Корпоративный</td>
            <td>Количество</td>
            <td>Время</td>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>
              <Checkbox className={styles.team} checked={allLunches.team} onChange={this.setToAllLunches.bind(this, 'team')}/>
            </td>
            <td>
              <Input value={allLunches.available_count} onChange={this.setToAllLunches.bind(this, 'available_count')}/>
            </td>
            <td>
              <DeliveryTimeDropdown disabled={!!allLunches.team} value={allLunches.ready_by_time} onChange={this.setToAllLunches.bind(this, 'ready_by_time')}/>
            </td>
          </tr>
          </tbody>
        </table>
        <div className={styles.wrapperDatePickerButton}>
          <DatePicker wrapperClassName={styles.datePickerButton} label="Добавить обед" minDate={new Date()}
                      value={allLunches.ready_by_date} onChange={this.addLunchItems}/>
        </div>
      </Card>
    );
  }

  render() {
    const { fields, lunchExamples, handleSubmit, submitting, error } = this.props;
    return (
      <form className={styles.rootMultiple} onSubmit={handleSubmit}>
        <h1>Множественное добавление обедов</h1>
        <div className={styles.lunchExampleInfo}>
          {fields.lunchExamples.length > 0 ?
            [
              this.allLunchesAttrsTable(),
              fields.lunchExamples.map((lunchExample, index) =>
                <Card className={styles.lunchExampleCard} key={index}>
                  {this.lunchExampleInfo(lunchExample.id.value, lunchExamples)}
                  {this.lunchTable(lunchExample.lunchItems)}
                </Card>
              )
            ]
            : <div>Нет выбраных шаблонов</div>}
        </div>
        {!!error && <div className={styles.error}>{error}</div>}
        <Button className={styles.submitBtn} flat accent label="Создать обеды" type="submit" disabled={submitting || !fields.lunchExamples.length}/>
      </form>
    );
  }
}
