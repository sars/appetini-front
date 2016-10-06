import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { prepareMetaForReducer } from 'helpers/getMeta';
import { updateMeta } from 'redux/modules/meta';
import { connect } from 'react-redux';
import styles from './styles.scss';
import config from 'config';


@connect(state => ({metas: state.reduxAsyncConnect.metas}), { updateMeta })
export default class About extends Component {
  static propTypes = {
    metas: PropTypes.array.isRequired,
    updateMeta: PropTypes.func.isRequired
  };

  componentDidMount() {
    const meta = prepareMetaForReducer(this.props.metas, 'resource', 'about', true);
    this.props.updateMeta({...meta, url: window.location.href});
  }

  render() {
    return (
      <div className={styles.root}>
        <h1>О нас</h1>
        <Helmet title="О нас"/>

        <p>
          Appetini - это интернет-сервис по доставке комплексных обедов на офисы и домой.
          Рестораны и частные кулинары размещают на сайте Appetini свои лучшие предложения,
          чтобы вы в обед всегда были сыты и полны энергии.
          Мы предоставляем удобный интерфейс для заказа приготовленных обедов и осуществляем доставку.
        </p>
        <p>
          Обеды доставляются каждый день кроме выходных с 12:30 до 13:00.
          Заказ можно делать заранее (например, на завтра или на несколько дней вперед).
          Стоимость индивидуальной (одноразовой) доставки 15грн на любое количество порций от одного ресторана или кулинара.
          Для постоянных клиентов (купивших доставки по подписке) стоимость значительно ниже - 10-12грн в зависимости от тарифного плана.
        </p>
        <p>
          Appetini сотрудничает на постоянной основе с офисами по всему городу, присоединяйтесь и вы.
          Будем рады вашим отзывам и идеям, мы развиваемся и становимся лучше вместе с вами и благодаря вам.
          Хотите есть вкусную и здоровую еду каждый день? Заходите и заказывайте! Будьте вкусными и здоровыми!
        </p>
        <p>
          По всем вопросам обращайтесь пожалуйста по телефону <a className={styles.link} href={'tel:' + config.app.phone}>{config.app.phone}</a> или по email: <span className={styles.link}>support@appetini.com</span>
        </p>
      </div>
    );
  }
}
