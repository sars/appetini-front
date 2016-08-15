import React, {Component, PropTypes} from 'react';
import Button from 'components/Button/Button';
import styles from './styles.scss';

export default class OrderTable extends Component {
  static propTypes = {
    orderItems: PropTypes.array.isRequired,
    onChangeAmount: PropTypes.func.isRequired,
    buyerId: PropTypes.string,
    showRemove: PropTypes.bool
  };

  render() {
    const { orderItems, showRemove, buyerId, onChangeAmount } = this.props;
    return (
      <div>
        <table className={styles.table}>
          <caption><h3>Заказы друзей</h3></caption>
          <thead>
          <tr>
            {showRemove && <td>Удалить</td>}
            <td>Порции</td>
            <td>Имя</td>
          </tr>
          </thead>
          <tbody>
          {orderItems.map((item, idx) => {
            if (item.buyer_id && item.buyer_id !== buyerId) {
              return (
                <tr key={idx}>
                  {showRemove && <td><Button key={idx} className={styles.deleteOrder} type="button" icon="delete" mini flat
                                          onClick={() => onChangeAmount(0, item.buyer_id, item.buyer_name)}/></td>}
                  <td>{item.amount}</td>
                  <td>{item.buyer_name}</td>
                </tr>);
            }
          })}
          </tbody>
        </table>
      </div>
    );
  }
}
