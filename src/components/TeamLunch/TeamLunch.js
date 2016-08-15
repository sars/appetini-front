import React, {Component, PropTypes} from 'react';
import Card from 'components/Card/Card';
import Dishes from 'components/Dishes/Dishes';
import ImagesPreview from 'components/ImagesPreview/ImagesPreview';
import PortionManipulate from 'components/PortionManipulator/PortionManipulator';
import styles from './styles.scss';
import sumBy from 'lodash/sumBy';
import find from 'lodash/find';
import { connect } from 'react-redux';
import OrderTable from 'components/OrderTable/OrderTable';

@connect(state => ({
  teamOrderPreferences: state.teamOrderPreferences
}))
export default class TeamLunch extends Component {
  static propTypes = {
    lunch: PropTypes.object.isRequired,
    teamOrderPreferences: PropTypes.object.isRequired,
    onChangeAmount: PropTypes.func.isRequired,
    isOwner: PropTypes.bool,
    amount: PropTypes.number.isRequired
  };

  changeAmountHandle = (currentBuyerAmount, token, name) => {
    const { lunch, onChangeAmount, teamOrderPreferences } = this.props;
    const buyerId = token || teamOrderPreferences.user.token;
    const buyerName = name || teamOrderPreferences.user.name;
    const currentOrderItem = find(lunch.order_item_info, {buyer_id: buyerId});
    const oldAmount = currentOrderItem ? currentOrderItem.amount : 0;
    const currentOrderItemAmount = sumBy(lunch.order_item_info, 'amount') - oldAmount + currentBuyerAmount;
    if (currentOrderItemAmount <= lunch.available_count && currentBuyerAmount >= 0) {
      onChangeAmount(lunch, currentBuyerAmount, buyerId, buyerName);
    }
  }

  render() {
    const { lunch, amount, isOwner } = this.props;
    const { token } = this.props.teamOrderPreferences.user;
    const orderItemAmountSum = sumBy(lunch.order_item_info, 'amount');
    const availableCount = lunch.order_item_info ? undefined : lunch.available_count;
    const showOrderTable = orderItemAmountSum > amount;
    return (
      <Card className={styles.container}>
        <div className={styles.imagePreviewWrapper}>
          <ImagesPreview images={lunch.photos} currentImageId={0}/>
        </div>
        <div className={styles.infoCard}>
          <div className={styles.priceSection}>
            <h3>Стоимость обеда:</h3>
            <span className={styles.price}>{Number(lunch.price)}<span className={styles.currency}> грн</span></span>
          </div>
          <div className={styles.dishesWrapper}>
            <Dishes dishes={lunch.dishes}/>
          </div>
          { lunch.description &&
            <div className={styles.descriptionWrapper}>
              <h3>Описание обеда:</h3>
              <span className={styles.description}>
                {lunch.description}
              </span>
            </div>
          }
        </div>
        <div className={styles.amountCard}>
          <h3 className={styles.textHeader}>Мой заказ</h3>
          <PortionManipulate availableCount={availableCount} amount={amount} onChangeAmount={this.changeAmountHandle} />
          {showOrderTable && <OrderTable orderItems={lunch.order_item_info} buyerId={token} showRemove={isOwner} onChangeAmount={this.changeAmountHandle}/>}
          {lunch.order_item_info && <div className={styles.summary}>
            <span className={styles.ordered}>{`Заказано: ${orderItemAmountSum}`}</span>
            <span className={styles.available}>|</span>
            <span className={styles.available}>{`Доступно: ${lunch.available_count}`}</span>
          </div>}
        </div>
      </Card>
    );
  }
}
