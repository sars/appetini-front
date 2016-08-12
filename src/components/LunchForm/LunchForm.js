import React, { PropTypes, Component } from 'react';
import DeliveryTimeDropdown from 'components/DeliveryTimeDropdown/DeliveryTimeDropdown';
import DatePicker from 'components/DatePicker/DatePicker';
import Input from 'components/Input/Input';
import { reduxForm } from 'redux-form';
import { Link } from 'react-router';
import Checkbox from 'react-toolbox/lib/checkbox';
import classNames from 'classnames';
import styles from './styles.scss';
import Button from 'components/Button/Button';
import LunchDropdown from 'components/LunchDropdown/LunchDropdown';

@reduxForm(
  {
    form: 'lunchForm',
    fields: ['available_count', 'team', 'lunch_example_id', 'ready_by_date', 'ready_by_time']
  }
)
export default class LunchForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    error: PropTypes.object,
    team: PropTypes.bool,
    submitting: PropTypes.bool,
    title: PropTypes.string.isRequired,
    sendLabel: PropTypes.string.isRequired
  };

  render() {
    const { fields, title, handleSubmit, submitting, sendLabel } = this.props;

    return (
      <form className={styles.root} onSubmit={handleSubmit}>
        <h1>{title}</h1>
        <LunchDropdown className={styles.filter} {...fields.lunch_example_id}/>
        <div className={styles.team}>
          <h3>Корпоративный</h3>
          <Checkbox {...fields.team}/>
        </div>
        {!fields.team.value && <div className={classNames(styles.section, styles.twoColSection)}>
          <div>
            <h3>Дата</h3>
            <DatePicker minDate={new Date()} {...fields.ready_by_date}/>
          </div>
          <div>
            <h3>Время</h3>
            <DeliveryTimeDropdown {...fields.ready_by_time}/>
          </div>
        </div>}
        <div className={classNames(styles.section, styles.twoColSection)}>
          <div>
            <h3>Количество</h3>
            <Input {...fields.available_count}/>
          </div>
        </div>
        <div className={styles.acceptRules}>
          <Button flat accent label={sendLabel} type="submit" disabled={submitting}/>
          <Link className={styles.linkButton} to="/admin/lunches">
            <Button flat outlined label="К списку обедов"/>
          </Link>
        </div>
      </form>
    );
  }
}
