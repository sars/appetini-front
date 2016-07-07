import React, { Component, PropTypes } from 'react';
import OrdersForCookCourier from 'components/OrdersForCookCourier/OrdersForCookCourier';
import styles from 'components/CookOrderPreview/styles.scss';
import { Card } from 'react-toolbox/lib/card';
import Checkbox from 'react-toolbox/lib/checkbox';
import Button from 'components/Button/Button';
import { Link } from 'react-router';
import ImagesPreview from 'components/ImagesPreview/ImagesPreview';
import { asyncConnect, loadSuccess } from 'redux-async-connect';
import { connect } from 'react-redux';
import {getParams} from 'helpers/ordersDateHelper';
import reviewOrderItem from 'helpers/reviewOrderItem';


@asyncConnect([
  {key: 'orderItems', promise: ({ helpers, location }) =>
    helpers.client.get('/order_items', {params: {page: 1, per_page: 10, ...getParams(location)}})
  }
])
@connect(state => ({user: state.auth.user}), {loadSuccess})
export default class OrderItems extends Component {
  static propTypes = {
    orderItems: PropTypes.object.isRequired,
    loadSuccess: PropTypes.func.isRequired,
    user: PropTypes.object,
    location: PropTypes.object
  };

  static contextTypes = {
    client: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 1
    };
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.location !== nextProps.location) {
      this.setState({
        page: 1
      });
    }
  }

  onItemReviewed = (orderItem, checked) => {
    reviewOrderItem(orderItem, checked, this.props.user, this.context.client)
      .then(response => {
        const reviewedOrderItem = response ? response.resource : null;
        this.setOrderItems(orderItem.id, reviewedOrderItem);
      });
  }

  setOrderItems = (currentOrderItemId, reviewedOrderItem) => {
    const { orderItems } = this.props;
    const newOrderItems = orderItems.resources.map((orderItem) => {
      if (orderItem.id === currentOrderItemId) return {...orderItem, reviewed_order_item: reviewedOrderItem};
      return orderItem;
    });
    this.props.loadSuccess('orderItems', {...orderItems, resources: newOrderItems});
  }

  loadMoreOrderItems = () => {
    const { page } = this.state;
    const { client } = this.context;
    const { location, orderItems} = this.props;
    client.get('/order_items', {params: {page: page + 1, per_page: 10, ...getParams(location)}})
      .then(response => {
        this.props.loadSuccess('orderItems', {...orderItems, resources: [...orderItems.resources, ...response.resources]});
        this.setState({
          page: page + 1
        });
      });
  }

  render() {
    const { location } = this.props;
    const { orderItems } = this.props;
    return (
      <div>
        <OrdersForCookCourier title="Позиции заказа" location={location}>
          <div>
            <Card className={styles.orderPreviewWrapper}>
              {orderItems.resources.length > 0 ?
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <td className={styles.hiddenXs}>Обработано</td>
                      <td className={styles.showXs}><i className="fa fa-eye"/></td>
                      <td>ИД</td>
                      <td>Кулинар</td>
                      <td>Блюда</td>
                      <td className={styles.hiddenXs}>Фото</td>
                      <td className={styles.hiddenXs}>Цена</td>
                      <td className={styles.hiddenXs}>Просмотр Обеда</td>
                    </tr>
                  </thead>
                  <tbody>
                  {orderItems.resources.map((item, idx) =>
                    <tr key={idx}>
                      <td>
                        <Checkbox checked={Boolean(item.reviewed_order_item && item.reviewed_order_item.id)}
                                    onChange={(checked) => this.onItemReviewed(item, checked)}/>
                      </td>
                      <td>{item.id}</td>
                      <td>{item.resource.cook.full_name_genitive}</td>
                      <td>
                        {item.resource.dishes.map((dish, index) => {
                          return (
                            <div key={index} className={styles.dish}>
                              <span className={styles.dishName}>{dish.name}</span>
                            </div>);
                        })}
                      </td>
                      <td className={styles.hiddenXs}>
                        <div className={styles.photoWrapper}>
                          <ImagesPreview images={item.resource.photos} currentImageId={0}/>
                        </div>
                      </td>
                      <td className={styles.hiddenXs}>{item.resource.price}</td>
                      <td className={styles.hiddenXs}><Link to={`/lunches/${item.resource_id}`}><Button flat accent label="Обед"/></Link></td>
                    </tr>
                  )}
                  </tbody>
                </table>
                : <h2 className={styles.ordersPlaceholder}>Нет заказов</h2>
              }
            </Card>
            {orderItems.resources.length < orderItems.meta.total &&
              <div className={styles.textCenter}>
                <Button flat accent label="Загрузить еще" onClick={::this.loadMoreOrderItems}/>
              </div>
            }
          </div>
        </OrdersForCookCourier>
      </div>
    );
  }
}
