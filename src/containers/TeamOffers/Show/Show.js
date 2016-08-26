import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import TeamLunch from 'components/TeamLunch/TeamLunch';
import find from 'lodash/find';
import without from 'lodash/without';
import sumBy from 'lodash/sumBy';
import forIn from 'lodash/forIn';
import { addTeamOrder } from 'redux/modules/purchase';
import TeamOfferContainer from 'components/TeamOfferContainer/TeamOfferContainer';
import { show as showToast } from 'redux/modules/toast';
import { addTeamOrderToOwner } from 'redux/modules/teamOrderPreferences';
import styles from './styles.scss';
import BuyModal from 'components/BuyModal/BuyModal';
import Helmet from 'react-helmet';
import { origin } from 'config';

const getLunchAmount = (lunch, teamOrder) => {
  const lunchInOrder = find(teamOrder.order_items_attributes, {resource_id: lunch.id});
  return lunchInOrder ? lunchInOrder.amount : 0;
};

@asyncConnect([
  {key: 'offer', promise: ({params, helpers}) => {
    return helpers.client.get(`/team_offers/${params.offerId}`)
      .then(response => response.resource);}
  }
])
@connect(state => ({
  reviews: state.common.reviews,
  user: state.auth.user
}), { addTeamOrder, showToast, addTeamOrderToOwner })
export default class TeamOfferShow extends Component {
  static propTypes = {
    offer: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    addTeamOrder: PropTypes.func.isRequired,
    user: PropTypes.object,
    showToast: PropTypes.func.isRequired,
    addTeamOrderToOwner: PropTypes.func.isRequired
  };

  static contextTypes = {
    client: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      teamOrder: {
        team_offer_id: props.offer.id,
        order_items_attributes: []
      },
      showModal: false
    };
  }

  onBuyHandle = () => {
    this.buy((response) => {
      this.props.addTeamOrder(response.resource);
      this.props.showToast('Корпоративный обед успешно добавлен в корзину', 'accept', 'done');
      this.setState({ showModal: true });
    });
  }

  checkout = () => {
    this.context.router.push('/checkout');
  }

  buy = (callback) => {
    const { client } = this.context;
    const { teamOrder } = this.state;
    client.post('/team_orders/', {data: {resource: teamOrder}})
      .then(response => {
        callback(response);
      })
      .catch(response => {
        const errors = [];
        forIn(response.errors, errorsArray => errorsArray.map(error => errors.push(error)));
        this.props.showToast(errors.join('; '), 'warning', 'error');
      });
  }

  handleChangeAmount = (lunch, amount) => {
    const { teamOrder } = this.state;
    const orderLunches = teamOrder.order_items_attributes;
    if (amount <= lunch.available_count && amount >= 0) {
      const newOrderLunches = without(orderLunches, find(orderLunches, {resource_id: lunch.id}));
      if ( amount > 0 ) {
        newOrderLunches.push({resource_id: lunch.id, amount: amount, resource_type: 'Lunch', price: lunch.price});
      }
      this.setState({
        teamOrder: {
          ...teamOrder,
          order_items_attributes: newOrderLunches
        }
      });
    }
  }

  handleModalClose = () => {
    this.context.router.push('/');
  }

  shareTeamOrder() {
    this.buy((response) => {
      const teamOrder = response.resource;
      this.props.addTeamOrderToOwner(teamOrder.id);
      this.context.router.push(`/team_orders/owner/${teamOrder.id}?share_token=${teamOrder.share_token}`);
    });
  }

  render() {
    const { offer, user } = this.props;
    const { teamOrder } = this.state;
    const lunchesInTeamOrder = teamOrder.order_items_attributes;
    const teamOrderAmount = sumBy(lunchesInTeamOrder, (lunchInOrder) => lunchInOrder.amount);
    const totalPrice = sumBy(lunchesInTeamOrder, lunch => lunch.price * lunch.amount);
    const disabled = !lunchesInTeamOrder.length;
    return (
      <TeamOfferContainer offer={offer}
                          onShare={::this.shareTeamOrder}
                          totalPrice={totalPrice}
                          user={user}
                          orderedAmount={teamOrderAmount}
                          disabled={disabled}
                          onBuy={::this.onBuyHandle}>
        <Helmet meta={[
          {property: 'og:title', content: 'Appetini - доставка обедов для корпоративных клиентов'},
          {property: 'og:description', content: 'Комплексный обед за 33 грн'},
          {property: 'og:image', content: `${origin}${offer.lunches[0].photos[0].thumb.url}`}
        ]}/>
        <BuyModal onClose={this.handleModalClose} active={this.state.showModal} onClick={this.checkout}/>
        <div className={styles.lunchesWrapper}>
          {offer.lunches.map((lunch, idx) => {
            return (<TeamLunch key={idx} lunch={lunch} onChangeAmount={::this.handleChangeAmount}
                               amount={getLunchAmount(lunch, teamOrder)}/>);
          })}
        </div>
      </TeamOfferContainer>
    );
  }
}
