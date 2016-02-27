import React, { Component, PropTypes } from 'react';
import { asyncConnect } from 'redux-async-connect';
import styles from './styles.scss';
import Tariff from './Tariff/Tariff';

@asyncConnect([
  {key: 'tariffs', promise: ({helpers}) => helpers.client.get('/delivery_tariffs').then(tariffs => tariffs.resources)}
])
export default class Tariffs extends Component {
  static propTypes = {
    tariffs: PropTypes.array.isRequired
  };

  render() {
    const {tariffs} = this.props;

    return (
      <div className={styles.root}>
        <h1>Тарифные планы</h1>
        <div>
          Экономьте на доставке, подписавшись. Вы сможете использовать купленные вами доставки
          в любое удобное для вас время в течении месяца
        </div>
        <div className={styles.tariffs}>
          {tariffs.map((tariff, index) =>
            <Tariff tariff={tariff} key={index} className={styles.tariff}/>
          )}
        </div>
        <div>* Оплата производится с помощью LiqPay, вы будете перенаправлены...</div>
      </div>
    );
  }
}
