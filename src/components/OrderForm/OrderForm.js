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
import { removeOrderItem, clearOrderItems, clearOrder, orderItemStructure, changeAmountOrderItem } from 'redux/modules/purchase';
import { reduxForm } from 'redux-form';
import PasswordInput from 'components/PasswordInput/PasswordInput';
import styles from './styles.scss';
import ga from 'components/GaEvent/ga';
import isEmpty from 'lodash/isEmpty';
import find from 'lodash/find';
import pick from 'lodash/pick';
import pull from 'lodash/pull';
import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';
import transform from 'lodash/transform';
import omit from 'lodash/omit';
import pickBy from 'lodash/pickBy';
import isPlainObject from 'lodash/isPlainObject';

@reduxForm(
  {
    form: 'orderForm',
    fields: ['id', 'phone', 'location_attributes', 'location', 'order_items', 'order_items_attributes', 'payment_type', 'user.id',
             'user.name', 'user.phone', 'user.email', 'user.password', 'user.locations', 'user.deliveries_available']
  }, state => ({orderItems: state.purchase.orderItems, user: state.auth.user, initialOrder: state.purchase.order}),
  { openModal, showToast, removeOrderItem, clearOrderItems, clearOrder, changeAmountOrderItem }
)
export default class OrderForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    initializeForm: PropTypes.func.isRequired,
    showToast: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    removeOrderItem: PropTypes.func.isRequired,
    changeAmountOrderItem: PropTypes.func.isRequired,
    clearOrderItems: PropTypes.func.isRequired,
    clearOrder: PropTypes.func,
    error: PropTypes.object,
    submitting: PropTypes.bool,
    orderItems: PropTypes.array.isRequired,
    user: PropTypes.object,
    initialOrder: PropTypes.object,
    tariffs: PropTypes.array.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  state = {
    preparedOrderItems: this.preparedOrderItems(
      this.props.orderItems,
      this.props.initialOrder ? this.props.initialOrder.user : this.props.user,
      this.props.initialOrder && this.props.initialOrder.order_items
    )
  };

  componentWillMount() {
    const { initializeForm, initialOrder, user } = this.props;
    const initialFormValues = {};

    if (initialOrder) {
      Object.assign(initialFormValues, {
        id: initialOrder.id,
        payment_type: initialOrder.payment_type,
        location: initialOrder.location,
        user: initialOrder.user,
        // Old order items from editing order
        order_items: initialOrder.order_items.map(item => {
          // Mark all old delivery tariffs as destroying because we will add new delivery tariffs items based on new
          // lunches in checkout
          if (item.resource_type === 'DeliveryTariff') {
            return { ...item, _destroy: 1 };
          } else if (item.resource_type === 'Lunch') {
            return {
              ...item,
              resource: { ...item.resource, mutual_available_count: item.resource.available_count + item.amount }
            };
          }

          return item;
        })
      });
    } else if (user) {
      Object.assign(initialFormValues, { user });
    }

    Object.assign(initialFormValues, {
      order_items_attributes: this.state.preparedOrderItems.purchasing
    });

    initializeForm(initialFormValues);
  }

  componentWillReceiveProps(nextProps) {
    // orderItems - new order items
    const { orderItems, fields } = this.props;
    const userData = pickBy(mapValues(fields.user, field => field.value));
    const userFromReduxForm = isEmpty(userData) ? null : userData;
    const isNextUser = (this.props.user !== nextProps.user) && nextProps.user;
    const user = isNextUser ? nextProps.user : userFromReduxForm;

    const nextFields = nextProps.fields;
    if (orderItems !== nextProps.orderItems || this.props.user !== nextProps.user || fields.order_items.value !== nextFields.order_items.value ) {
      const newItems = this.preparedOrderItems(nextProps.orderItems, user, nextProps.fields.order_items.value);
      this.setState({preparedOrderItems: newItems});
      fields.order_items_attributes.onChange(newItems.purchasing);
    }

    if (isNextUser) {
      this.changeFields(fields.user, user);
    }
  }

  getLocations(locations = [], location) {
    const resultLocations = locations.map(item => omit(item, ['id', 'resource_id', 'resource_type']));
    if (location) {
      const index = locations.findIndex(item => item.place_id === location.place_id);
      if (index === -1) {
        resultLocations.push(location);
      } else {
        resultLocations[index] = location;
      }
    }
    return resultLocations;
  }

  /**
   * @description This function prepares array of lunches to display in order list.
   * @param newItems Array of new order items
   * @param user User.
   * @param oldItems Array of old order items from editing order
   * @returns {{purchasing: null[], grouped}}
   */
  preparedOrderItems(newItems, user, oldItems) {
    const items = this.preventDuplicateItems(newItems, oldItems);
    const { tariffs } = this.props;
    const groupedItems = this.groupedItems(items);
    const individualTariffItem = orderItemStructure('DeliveryTariff', find(tariffs, {individual: true}));
    const zeroTariffItem = orderItemStructure('DeliveryTariff', { price: 0, zero: true });
    const individualTariffItems = [];
    /**
     * @description This variable represents deliveries amount for current order including user's deliveries available
     * and purchasing deliveries in order (when user orders tariffs from tariff`s page).
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
          if (cookItems.every(item => item._destroy)) {
            dateItemsResult[cookId] = [...cookItems];
          } else {
            dateItemsResult[cookId] = [...cookItems, individualTariffItem];
            individualTariffItems.push(individualTariffItem);
          }
        }
      }, {});
    }, {});

    return {
      purchasing: [...items, ...individualTariffItems],
      grouped: itemsWithDelivers
    };
  }

  preventDuplicateItems(newItems, oldItems = []) {
    const newItemsWithoutOld = newItems.slice(0);

    return oldItems.map(item => {
      const newItem = find(newItems, pick(item, ['resource_id', 'resource_type']));
      if (newItem) {
        pull(newItemsWithoutOld, newItem);
        const newAmount = item.amount + newItem.amount;
        return { ...item, amount: newAmount };
      }
      return item;
    }).concat(newItemsWithoutOld);
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
    const lunchesItems = orderItems.filter(items => (items.resource_type === 'Lunch' || items.resource_type === 'TeamOrder'));
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
    const newItems = this.preparedOrderItems(orderItems, selectedUser, fields.order_items.value);
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
      <div className={styles.error}>{this.parseError(fields[fieldName].error)}</div>;
  }

  parseError(error) {
    if (error instanceof Array) {
      return error.join(', ');
    } else if (typeof error === 'object') {
      return transform(error, (result, value, key) => {
        const msg = isPlainObject(value) ? `${key}: { ${this.parseError(value)} }` : `${key}: ${this.parseError(value)}`;
        return result.push(msg);
      }, []).join('; ');
    }
    return error;
  }

  changeAmountOrderItem(currentItem, amountDelta) {
    const { fields } = this.props;
    if (currentItem.id) {
      fields.order_items.onChange(fields.order_items.value.map(orderItem => {
        const currentAmount = amountDelta + currentItem.amount;
        const availableCount = orderItem.resource.mutual_available_count;
        if (orderItem.id === currentItem.id && currentAmount > 0 && currentAmount <= availableCount) {
          return {
            ...orderItem,
            amount: amountDelta + orderItem.amount
          };
        }
        return orderItem;
      }));
    } else {
      this.props.changeAmountOrderItem(currentItem, amountDelta);
    }
  }

  handleRemoveItem(item) {
    if (item.id) {
      const orderItems = this.props.fields.order_items;
      orderItems.onChange(orderItems.value.map(orderItem => {
        if (orderItem.id === item.id) {
          return { ...orderItem, _destroy: 1 };
        }
        return orderItem;
      }));
    } else {
      this.props.removeOrderItem(item);
    }
  }

  cancelRemove(item) {
    const orderItems = this.props.fields.order_items;
    orderItems.onChange(orderItems.value.map(orderItem => {
      if (orderItem.id === item.id) {
        return omit(orderItem, ['_destroy']);
      }
      return orderItem;
    }));
  }

  clearOrderItems() {
    ga('Cancel purchase');
    this.props.clearOrderItems();
    this.context.router.push('/');
  }

  render() {
    const { fields, handleSubmit, submitting, user } = this.props;
    const orderItems = this.state.preparedOrderItems;
    const submitLabel = fields.payment_type.value === 'liqpay' ? 'Оплатить' : 'Оформить заказ';
    const orderExist = Boolean(this.props.initialOrder);
    const hasLunches = fields.order_items_attributes.value && fields.order_items_attributes.value.some(item => item.resource_type === 'Lunch' || item.resource_type === 'TeamOrder');
    const locations = user && !isEmpty(fields.user.locations.value) && this.getLocations(fields.user.locations.value, fields.location.value);

    return (
      <form className={styles.root} onSubmit={handleSubmit}>

        <h1>{(orderExist && `Редактирвание заказа №${fields.id.value}`) || 'Оформление заказа'}</h1>
        <div>
          {!user && <Button flat accent label="У меня есть аккаунт" type="button"
                  onClick={() => this.props.openModal('LoginForm', 'Авторизация')}/>}
          {orderExist && <Button flat outlined label="Отменить" type="button" onClick={() => {::this.props.clearOrder(); this.context.router.push('/');}}/>}
        </div>

        <div>
          <h3>Ваш заказ:</h3>
          <OrderItems items={orderItems} onRemove={::this.handleRemoveItem} onChangeAmount={::this.changeAmountOrderItem} cancelRemove={::this.cancelRemove} />
          {this.errorsFor('order_items')}
        </div>

        <div>
          <h3>Имя</h3>
          { user && (user.role === 'admin')
            ? <UsersAutocomplete direction="down" onUserSelect={::this.handleUserSelect}
                                 value={{id: fields.user.id.value, name: fields.user.name.value, email: fields.user.email.value}}/>
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
          {isEmpty(locations)
            ? <AddressSuggest onSuggestSelect={::this.props.fields.location.onChange}
                              location={fields.location.value} error={fields.location.error}/>
            : <LocationsSelect className={fields.location.error && styles.withError} locations={locations} onSelect={::this.props.fields.location.onChange}
                               location={fields.location.value} />}
          { !isEmpty(locations) && this.errorsFor('location')}
        </div>}

        <div>
          <h3>Способ оплаты:</h3>
          <RadioGroup className={styles.paymentType} {...fields.payment_type}>
            <RadioButton label="Наличными курьеру" value="cash"/>
            <RadioButton label="Кредитная карта, Приватбанк" value="liqpay"/>
          </RadioGroup>
          {this.errorsFor('payment_type')}
        </div>

        <div className={styles.submitContainer}>
          <Button flat accent label={submitLabel} type="submit" disabled={submitting}/>
          <Button flat outlined label="Отменить и вернуться к меню" type="button" onClick={::this.clearOrderItems}/>
        </div>

      </form>
    );
  }
}
