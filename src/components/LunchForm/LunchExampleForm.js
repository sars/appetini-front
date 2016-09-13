import React, { PropTypes } from 'react';
import Dropdown from 'components/Dropdown/Dropdown';
import CheckButtonsGroup from 'components/CheckButtonsGroup/CheckButtonsGroup';
import Input from 'components/Input/Input';
import Button from 'components/Button/Button';
import { reduxForm } from 'redux-form';
import { getCooks, getFoodPreferences } from 'redux/modules/common';
import classNames from 'classnames';
import styles from './styles.scss';
import { Link } from 'react-router';
import BaseLunchForm from './BaseLunchForm';

@reduxForm(
  {
    form: 'lunchForm',
    fields: ['id', 'cook_id', 'cook', 'photos_temp_image_ids', 'initial_price', 'accept_rules', 'description',
      'dishes[].id', 'dishes[].name', 'dishes[].size', 'dishes[].dish_type', 'dishes[]._destroy',
      'removing_photos', 'food_preference_ids', 'dishes_count', 'photos', 'disable_minutes']
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
export default class LunchExampleForm extends BaseLunchForm {
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
    team: PropTypes.bool,
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
    const { cooks, fields } = this.props;
    const currentCook = fields.cook.value;
    const allCooks = cooks ? [
      { label: 'Выберите кулинара' },
      ...cooks.map(cook => ({label: cook.first_name + ' ' + cook.last_name, value: cook.id.toString()}))
    ] : [{ label: 'Загрузка...' }];

    if (currentCook && currentCook.disabled) {
      allCooks.push({label: currentCook.first_name + ' ' + currentCook.last_name, value: currentCook.id.toString()});
    }

    return allCooks;
  }

  getPreferences() {
    const { foodPreferences } = this.props;
    return foodPreferences && foodPreferences.reduce((result, preference) => ({...result, [preference.id]: preference.name}), {});
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
            <h3>Время до заказа (мин)</h3>
            <Input {...fields.disable_minutes}/>
          </div>
        </div>
        {this.descriptionField()}
        {this.photosField()}
        {this.dishesField()}
        {this.priceField()}
        <div className={styles.section}>
          <h3>Предпочтения</h3>
          <CheckButtonsGroup source={preferences} {...fields.food_preference_ids}/>
          {this.errorsFor('food_preference_ids')}
        </div>

        {acceptRules && this.acceptRulesField()}
        <div className={styles.acceptRules}>
          {this.submitButton(sendLabel, submitting)}
          {fields.id.value && <span>
            <Link className={styles.linkButton} to={'/admin/lunch_examples/' + fields.id.value + '/clone'}>
              <Button flat outlined label="Клонировать"/>
            </Link>
            <Link className={styles.linkButton} to={`/admin/lunches/new?lunchExampleIds=[${fields.id.value}]`}>
              <Button flat outlined label="Создать обед"/>
            </Link>
          </span>}
        </div>
      </form>
    );
  }
}
