import React, { Component, PropTypes } from 'react';
import Dropdown from 'components/Dropdown/Dropdown';
import classNames from 'classnames';
import styles from './styles.scss';
import moment from 'moment';

export default class LunchDropdown extends Component {
  static propTypes = {
    className: PropTypes.string
  };

  static contextTypes = {
    client: PropTypes.object.isRequired
  };

  state = {
    lunches: []
  };

  componentDidMount() {
    this.context.client.get('/lunch_examples', {params: {per_page: 2000}}).then(response => this.setState({lunches: response.resources}));
  }

  template = (lunch) => {
    return (
      <div className={classNames(styles.lunchExample, lunch.placeholder ? styles.placeholder : null)}>
        {lunch.photo && <img src={lunch.photo}/>}
        <div className={styles.description}>
          {lunch.label && <div>{lunch.label}</div>}
          {lunch.price && <div>Цена: {Number(lunch.price) + ' грн'}</div>}
          {lunch.created && <div>Добавлено: {lunch.created}</div>}
        </div>
      </div>
    );
  };

  render() {
    const { lunches } = this.state;
    const preparedLunches = [{label: 'Выберите шаблон обеда', placeholder: true}, ...lunches.map(lunch => {
      return {value: lunch.id, label: `Кулинар: ${lunch.cook.full_name_genitive}`, photo: lunch.photos[0].thumb.url, price: lunch.price,
        created: moment(lunch.created_at).format('DD/MM/YYYY')};
    })];
    return (
      <Dropdown auto styles={styles} source={preparedLunches} template={this.template} size="20" {...this.props}/>
    );
  }
}
