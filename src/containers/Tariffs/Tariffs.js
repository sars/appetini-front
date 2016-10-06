import React, { Component, PropTypes } from 'react';
import { asyncConnect } from 'redux-async-connect';
import styles from './styles.scss';
import Tariff from './Tariff/Tariff';
import { addOrderItem } from 'redux/modules/purchase';
import { connect } from 'react-redux';
import { updateMeta } from 'redux/modules/meta';
import ga from 'components/GaEvent/ga';
import { prepareMetaForReducer } from 'helpers/getMeta';

@asyncConnect([
  {key: 'tariffs', promise: ({helpers, store}) => {
    if (!store.getState().reduxAsyncConnect.tariffs) {
      return helpers.client.get('/delivery_tariffs').then(tariffs => tariffs.resources);
    }
  }}
])
@connect((state) => ({metas: state.reduxAsyncConnect.metas}), { addOrderItem, updateMeta })
export default class Tariffs extends Component {
  static propTypes = {
    tariffs: PropTypes.array.isRequired,
    metas: PropTypes.array.isRequired,
    addOrderItem: PropTypes.func.isRequired,
    updateMeta: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentDidMount() {
    const meta = prepareMetaForReducer(this.props.metas, 'resource', 'tariffs', true);
    this.props.updateMeta({...meta, url: window.location.href});
  }

  purchase(tariff) {
    return () => {
      this.props.addOrderItem('DeliveryTariff', tariff);
      this.context.router.push('/checkout');
      ga('Tariff ' + tariff.amount);
    };
  }

  render() {
    const {tariffs} = this.props;

    return (
      <div className={styles.root}>
        <h1>Тарифные планы</h1>
        <div className={styles.description}>
          Подпишитесь на тарифный план, чтобы экономить на доставке. Вы сможете использовать
          купленные вами доставки в любое удобное для вас время в течении месяца*.
          <div>
            <small>*30 дней с даты покупки тарифного плана.</small>
          </div>
        </div>
        <div className={styles.tariffs}>
          {tariffs.map((tariff, index) =>
            !tariff.individual && <Tariff tariff={tariff} key={index} onBuyClick={::this.purchase(tariff)}/>
          )}
        </div>
        <div className={styles.comment}>* Оплата производится с помощью LiqPay, вы будете перенаправлены...</div>
      </div>
    );
  }
}
