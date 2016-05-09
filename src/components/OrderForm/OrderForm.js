import React, { PropTypes, Component } from 'react';
import Input from 'components/Input/Input';
import Button from 'components/Button/Button';
import AddressSuggest from 'components/AddressSuggest/AddressSuggest';
import LocationsSelect from 'components/Locations/Select';
import UsersAutocomplete from 'components/UsersAutocomplete/UsersAutocomplete';
import OrderItems from 'components/OrderItems/OrderItems';
import { RadioGroup, RadioButton } from 'react-toolbox';
import { show as showToast } from 'redux/modules/toast';
import { open as openModal } from 'redux/modules/modals';
import { removeOrderItem, clearOrderItems } from 'redux/modules/purchase';
import { reduxForm } from 'redux-form';
import PasswordInput from 'components/PasswordInput/PasswordInput';
import styles from './styles.scss';
import ga from 'components/GaEvent/ga';
import isEmpty from 'lodash/isEmpty';

@reduxForm(
  {
    form: 'orderForm',
    fields: ['id', 'phone', 'location_attributes', 'location', 'order_items', 'payment_type', 'user.id',
             'user.name', 'user.phone', 'user.email', 'user.password', 'user.locations']
  }, null, { openModal, showToast, removeOrderItem, clearOrderItems }
)

export default class OrderForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    removeOrderItem: PropTypes.func.isRequired,
    clearOrderItems: PropTypes.func.isRequired,
    error: PropTypes.object,
    submitting: PropTypes.bool,
    user: PropTypes.object,
    orderItems: PropTypes.object.isRequired,
    order: PropTypes.object,
    showAddressField: PropTypes.bool
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    if (props.user) {
      this.changeFields(props.fields.user, props.user);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.user !== nextProps.user && nextProps.user) {
      this.changeFields(nextProps.fields.user, nextProps.user);
    }
  }

  changeFields = (changingField, value) => {
    Object.keys(changingField).forEach(fieldName => {
      if (value[fieldName]) {
        changingField[fieldName].onChange(value[fieldName]);
      }
    });
  };

  handleUserSelect = (selectedUser) => {
    const { fields } = this.props;
    this.changeFields(fields.user, selectedUser);
  };

  errorsFor(fieldName) {
    const { fields } = this.props;
    return fields[fieldName].error && !fields[fieldName].visited &&
      <div className={styles.error}>{fields[fieldName].error}</div>;
  }

  handleRemoveItem(item) {
    this.props.removeOrderItem(item);
  }

  clearOrderItems() {
    ga('Cancel purchase');
    this.props.clearOrderItems();
    this.context.router.push('/');
  }

  render() {
    const { fields, handleSubmit, submitting, user, orderItems, order, showAddressField } = this.props;
    const submitLabel = fields.payment_type.value === 'liqpay' ? 'Оплатить' : 'Оформить заказ';
    const orderExist = Boolean(order);
    const locationsEmpty = isEmpty(fields.user.locations.value);

    return (
      <form className={styles.root} onSubmit={handleSubmit}>

        <h1>Оформление заказа</h1>
        {!user && <div>
          <Button flat accent label="У меня есть аккаунт" type="button"
                  onClick={() => this.props.openModal('LoginForm', 'Авторизация')}/>
        </div>}

        <div>
          <h3>Имя</h3>
          { user && (user.role === 'admin')
            ? <UsersAutocomplete direction="down" onSelect={this.handleUserSelect}
                                 value={{id: fields.user.id.value, name: fields.user.name.value}}/>
            : <Input disabled={Boolean(user)} {...fields.user.name}/>
          }
        </div>

        <div>
          <h3>Телефон</h3>
          <Input disabled={Boolean(user && user.phone)} {...fields.user.phone}/>
        </div>

        {!user && <div>
          <h3>Email</h3>
          <Input type="email" {...fields.user.email}/>
        </div>}

        {!user && <div>
          <h3>Password</h3>
          <PasswordInput placeholder="Password" {...fields.user.password}/>
        </div>}

        {showAddressField && <div>
          <h3>Адрес доставки</h3>
          {locationsEmpty
            ? <AddressSuggest onSuggestSelect={::this.props.fields.location.onChange} disabled={orderExist}
                              location={fields.location.value} />
            : <LocationsSelect locations={fields.user.locations.value || []} onSelect={::this.props.fields.location.onChange}
                               location={fields.location.value} />}
          {this.errorsFor('location')}
        </div>}

        <div>
          <h3>Ваш заказ:</h3>
          <OrderItems items={orderItems} onRemove={::this.handleRemoveItem}/>
          {this.errorsFor('order_items')}
        </div>

        <div>
          <h3>Способ оплаты:</h3>
          <RadioGroup className={styles.paymentType} {...fields.payment_type}>
            <RadioButton label="Наличными курьеру" value="cash"/>
            <RadioButton label="Кредитная карта, Приватбанк" value="liqpay"/>
          </RadioGroup>
          {this.errorsFor('payment_type')}
        </div>

        {!order && <div className={styles.submitContainer}>
          <Button flat accent label={submitLabel} type="submit" disabled={submitting}/>
          <Button flat outlined label="Отменить и вернуться к меню" type="button" onClick={::this.clearOrderItems}/>
        </div>}

      </form>
    );
  }
}
