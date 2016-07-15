import React, { Component, PropTypes } from 'react';
import { asyncConnect } from 'redux-async-connect';
import styles from './styles.scss';
import ResourcesIndex from 'components/ResourcesIndex/ResourcesIndex';
import ReactPagination from 'components/Pagination/Pagination';

const PER_PAGE = 10;
@asyncConnect([
  {key: 'orders', promise: ({ helpers, store }) => {
    const state = store.getState();
    const ordersQuery = state.routing.location.query;
    const ordersParams = { page: ordersQuery.page || 1, per_page: PER_PAGE };
    return helpers.client.get('/orders', { params: ordersParams })
      .then(orders => orders);
  }}
])
export default class AdminOrdersIndex extends Component {
  static propTypes = {
    orders: PropTypes.object.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  changePage(page) {
    const { router } = this.context;
    const params = { page: Number(page.selected) + 1, per_page: PER_PAGE };
    router.push({
      pathname: '/orders',
      query: params
    });
  }

  render() {
    const { orders } = this.props;
    const fields = [
      { title: 'Номер заказа', value: order => order.id },
      { title: 'Статус оплаты', value: order => order.payed ? 'Оплачен' : 'Не оплачен' },
      { title: 'Сумма заказа', value: order => Number(order.total_price) + ' грн.' }
    ];
    const defaultActions = ['details'];
    const pagesCount = Math.ceil(orders.meta.total / PER_PAGE);

    return (
      <div className={styles.ordersPageWrapper}>
        <ResourcesIndex resources={orders.resources} title="История заказов" fields={fields}
          urlName="orders" defaultActions={defaultActions}/>
        {pagesCount > 1 && <ReactPagination pagesCount={pagesCount} changePage={::this.changePage} />}
      </div>
    );
  }
}
