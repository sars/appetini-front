import React, { PropTypes, Component } from 'react';
import Input from 'components/Input/Input';
import Button from 'components/Button/Button';
import AddressSuggest from 'components/AddressSuggest/AddressSuggest';
import OrderItems from 'components/OrderItems/OrderItems';
import { RadioGroup, RadioButton } from 'react-toolbox';
import { show as showToast } from 'redux/modules/toast';
import { open as openModal } from 'redux/modules/modals';
import { removeOrderItem, clearOrderItems } from 'redux/modules/purchase';
import { reduxForm } from 'redux-form';
import styles from './styles.scss';

@reduxForm(
  {
    form: 'orderForm',
    fields: ['id', 'phone', 'location_attributes', 'location', 'order_items', 'payment_type',
             'user.name', 'user.phone', 'user.email', 'user.password']
  }, state => ({user: state.auth.user, orderItems: state.purchase.orderItems}),
  { openModal, showToast, removeOrderItem, clearOrderItems }
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
    orderItems: PropTypes.array.isRequired,
    order: PropTypes.object
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  handleSuggestSelect(suggest) {
    this.props.fields.location_attributes.onChange(suggest);
  }

  errorsFor(fieldName) {
    const { fields } = this.props;
    return fields[fieldName].error && !fields[fieldName].visited &&
      <div className={styles.error}>{fields[fieldName].error}</div>;
  }

  handleRemoveItem(item) {
    this.props.removeOrderItem(item);
  }

  clearOrderItems() {
    this.props.clearOrderItems();
    this.context.router.push('/');
  }

  render() {
    const { fields, handleSubmit, submitting, user, orderItems, order } = this.props;
    const submitLabel = fields.payment_type.value === 'liqpay' ? 'Оплатить' : 'Оформить заказ';
    const hasLunches = orderItems.some(item => item.resource_type === 'Lunch');

    return (
      <form className={styles.root} onSubmit={handleSubmit}>
        <h1>Оформление заказа</h1>

        {!user && <div>
          <Button flat accent label="У меня есть аккаунт" type="button"
                  onClick={() => this.props.openModal('LoginForm', 'Авторизация')}/>
        </div>}

        <div>
          <h3>Имя</h3>
          <Input disabled={Boolean(user)} {...fields.user.name}/>
        </div>

        <div>
          <h3>Телефон</h3>
          <Input disabled={Boolean(user)} {...fields.user.phone}/>
        </div>

        {!user && <div>
          <h3>Email</h3>
          <Input type="email" {...fields.user.email}/>
        </div>}

        {!user && <div>
          <h3>Password</h3>
          <Input type="password" {...fields.user.password}/>
        </div>}

        {hasLunches && <div>
          <h3>Адресс доставки</h3>
          <AddressSuggest onSuggestSelect={::this.handleSuggestSelect} disabled={Boolean(order)}
                          initialValue={fields.location.value && fields.location.value.full_address}
          />
          {this.errorsFor('location')}
        </div>}

        <div>
          <h3>Ваш заказ:</h3>
          <OrderItems items={orderItems} user={user} onRemove={::this.handleRemoveItem}/>
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
