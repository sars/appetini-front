import React, {Component, PropTypes} from 'react';
import Card, { CardContent } from 'components/Card/Card';
import Dishes from 'components/Dishes/Dishes';
import ImagesPreview from 'components/ImagesPreview/ImagesPreview';
import PortionManipulate from 'components/PortionManipulator/PortionManipulator';
import styles from './styles.scss';

export default class TeamLunch extends Component {
  static propTypes = {
    lunch: PropTypes.object.isRequired,
    onChangeAmount: PropTypes.func.isRequired,
    amount: PropTypes.number.isRequired
  };

  changeAmountHandle = (amountDelta) => {
    const { lunch, onChangeAmount } = this.props;
    onChangeAmount(lunch, amountDelta);
  }

  render() {
    const { lunch, amount } = this.props;
    return (
      <Card className={styles.container}>
        <div className={styles.imagePreviewWrapper}>
          <ImagesPreview images={lunch.photos} currentImageId={0}/>
        </div>
        <div className={styles.infoCard}>
          <Dishes dishes={lunch.dishes}/>
          { lunch.description &&
            <div className={styles.descriptionWrapper}>
              <CardContent className={styles.cardContent}>
                <h3>Описание обеда:</h3>
                <span className={styles.description}>
                  {lunch.description}
                </span>
              </CardContent>
            </div>
          }
        </div>
        <div className={styles.amountCard}>
            <CardContent className={styles.cardContent}>
              <h3 className={styles.portionAmountHeader}>Добавьте порции</h3>
              <PortionManipulate availableCount={lunch.available_count} amount={amount} onChangeAmount={::this.changeAmountHandle} />
              {lunch.order_item_info && lunch.order_item_info.map((item, idx) => {
                if (item.buyer_id) {
                  return (
                    <div className={styles.buyer} key={idx}>{`${item.buyer_name} - ${item.amount}`}</div>
                  );
                }
              })}
              <div className={styles.priceSection}>
                <span className={styles.price}>{Number(lunch.price)}</span>грн
              </div>
            </CardContent>
        </div>
      </Card>
    );
  }
}
