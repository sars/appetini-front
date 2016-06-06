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
import { removeOrderItem, clearOrderItems, orderItemStructure } from 'redux/modules/purchase';
import { reduxForm } from 'redux-form';
import PasswordInput from 'components/PasswordInput/PasswordInput';
import styles from './styles.scss';
import ga from 'components/GaEvent/ga';
import isEmpty from 'lodash/isEmpty';
import find from 'lodash/find';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';
import transform from 'lodash/transform';

@reduxForm(
  {
    form: 'orderForm',
    fields: ['id', 'phone', 'location_attributes', 'location', 'order_items', 'order_items_attributes', 'payment_type', 'user.id',
             'user.name', 'user.phone', 'user.email', 'user.password', 'user.locations', 'user.deliveries_available']
  }, state => ({orderItems: state.purchase.orderItems, user: state.auth.user}),
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
    orderItems: PropTypes.array.isRequired,
    user: PropTypes.object,
    order: PropTypes.object,
    tariffs: PropTypes.array.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  state = {
    preparedOrderItems: this.preparedOrderItems(this.props.orderItems, this.props.user)
  };

  componentDidMount() {
    const props = this.props;
    if (props.user) {
      this.changeFields(props.fields.user, props.user);
    }
    props.fields.order_items_attributes.onChange(this.preparedOrderItems(props.orderItems, props.user).purchasing);
  }

  componentWillReceiveProps(nextProps) {
    const props = this.props;
    if (props.orderItems !== nextProps.orderItems || props.user !== nextProps.user) {
      const user = this.state.selectedUser ? this.state.selectedUser : nextProps.user;
      const newItems = this.preparedOrderItems(nextProps.orderItems, user);
      this.changeFields(props.fields.user, user);
      this.setState({preparedOrderItems: newItems});
      props.fields.order_items_attributes.onChange(newItems.purchasing);
    }
  }

  /**
   * @description This function prepares array of lunches to display in order list.
   * @param items Array of "Lunch" objects.
   * @param user User.
   * @returns {{purchasing: null[], grouped}}
   */
  preparedOrderItems(items, user) {
    const { tariffs } = this.props;
    const groupedItems = this.groupedItems(items);
    const individualTariffItem = orderItemStructure('DeliveryTariff', find(tariffs, {individual: true}));
    const zeroTariffItem = orderItemStructure('DeliveryTariff', { price: 0, zero: true });
    const individualTariffItems = [];
    /**
     * @description This variable represents deliveries amount for current order including user's deliveries available and purchasing deliveries in order.
     * @constant { number }
     */
    let deliveriesAvailable = (user ? user.deliveries_available : 0) + this.purchasedTariffsCount(items);
    /**
     * @description This function adds delivery to each group in order list. If user has available deliveries, function will add delivery with zero price;
     * @constant {object}
     */
    const itemsWithDelivers = transform(groupedItems, (groupedItemsResult, dateItems, date) => {
      groupedItemsResult[date] = transform(dateItems, (dateItemsResult, cookItems, cookId) => {
        if (deliveriesAvailable > 0) {
          deliveriesAvailable--;
          dateItemsResult[cookId] = [...cookItems, zeroTariffItem];
        } else {
          dateItemsResult[cookId] = [...cookItems, individualTariffItem];
          individualTariffItems.push(individualTariffItem);
        }
      }, {});
    }, {});

    return {
      purchasing: [...items, ...individualTariffItems],
      grouped: itemsWithDelivers
    };
  }

  /**
   * @description This function returns object grouped by delivery time and cooks.
   * @param orderItems Array of lunches.
   */

  purchasedTariffsCount(items) {
    return items.reduce((result, item) => result + (item.resource_type === 'DeliveryTariff' ? item.resource.amount : 0), 0);
  }

  /**
   * @description This function returns deliveries amount.
   * @param items Array of "Lunch" objects.
   * @returns {*}
   */

  groupedItems(orderItems) {
    const lunchesItems = filter(orderItems, {resource_type: 'Lunch'});
    const groupedByDate = groupBy(lunchesItems, 'resource.ready_by');
    return mapValues(groupedByDate, items => groupBy(items, 'resource.cook.id'));
  }

  changeFields = (changingField, value) => {
    Object.keys(changingField).forEach(fieldName => {
      if (value[fieldName]) {
        changingField[fieldName].onChange(value[fieldName]);
      }
    });
  };

  handleUserSelect = (selectedUser) => {
    const { fields, orderItems } = this.props;
    const newItems = this.preparedOrderItems(orderItems, selectedUser);
    this.setState({
      preparedOrderItems: newItems,
      selectedUser: selectedUser
    });
    this.changeFields(fields.user, selectedUser);
    fields.order_items_attributes.onChange(newItems.purchasing);
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
    const { fields, handleSubmit, submitting, user } = this.props;
    const { order } = this.state;
    const orderItems = this.state.preparedOrderItems;
    const submitLabel = fields.payment_type.value === 'liqpay' ? 'Оплатить' : 'Оформить заказ';
    const orderExist = Boolean(order);
    const locationsEmpty = isEmpty(fields.user.locations.value);
    const hasLunches = this.props.orderItems.some(item => item.resource_type === 'Lunch');

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
            ? <UsersAutocomplete direction="down" onUserSelect={::this.handleUserSelect}
                                 value={{id: fields.user.id.value, name: fields.user.name.value}}/>
            : <Input disabled={Boolean(user)} placeholder="Введите имя" {...fields.user.name}/>
          }
        </div>

        <div>
          <h3>Телефон</h3>
          <Input disabled={Boolean(user && user.phone)} placeholder="Введите телефон" {...fields.user.phone}/>
        </div>

        {!user && <div>
          <h3>Email</h3>
          <Input type="email" placeholder="Введите email" {...fields.user.email}/>
        </div>}

        {!user && <div>
          <h3>Пароль</h3>
          <PasswordInput placeholder="Введите пароль" {...fields.user.password}/>
        </div>}

        {hasLunches && <div>
          <h3>Адрес доставки</h3>
          {locationsEmpty
            ? <AddressSuggest onSuggestSelect={::this.props.fields.location.onChange} disabled={orderExist}
                              location={fields.location.value} error={fields.location.error}/>
            : <LocationsSelect className={fields.location.error && styles.withError} locations={fields.user.locations.value || []} onSelect={::this.props.fields.location.onChange}
                               location={fields.location.value} />}
          { !locationsEmpty && this.errorsFor('location')}
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
