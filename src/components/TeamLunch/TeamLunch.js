import React, {Component, PropTypes} from 'react';
import Card, { CardContent } from 'components/Card/Card';
import ImagesPreview from 'components/ImagesPreview/ImagesPreview';
import PortionManipulate from 'components/PortionManipulator/PortionManipulator';

export default class TeamLunch extends Component {
  static propTypes = {
    lunch: PropTypes.object.isRequired,
    onChangeAmount: PropTypes.func.isRequired,
    amount: PropTypes.number.isRequired
  };

  render() {
    const styles = require('./TeamLunch.scss');
    const { lunch, amount, onChangeAmount } = this.props;

    return (<Card className={styles.container}>
        <div className={styles.imagePreviewWrapper}>
          <ImagesPreview images={lunch.photos} currentImageId={0}/>
        </div>
      <div className={styles.infoCard}>
        <CardContent className={styles.cardContent}>
          <h3>Состав обеда:</h3>
          <ul>
            {lunch.dishes.map(dish => {
              return (
                <li className={styles.dish} key={dish.id}>
                  <span>{dish.name}</span>
                  <span className={styles.dots}/>
                  <span className={styles.size}>{dish.size}</span>
                </li>
              );
            })}
          </ul>
        </CardContent>
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
            <PortionManipulate availableCount={lunch.available_count} amount={amount} onChangeAmount={onChangeAmount} />
          </CardContent>
      </div>
    </Card>);
  }
}
