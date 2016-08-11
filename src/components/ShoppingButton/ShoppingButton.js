import React, { Component, PropTypes } from 'react';
import { IconButton } from 'react-toolbox/lib/button';
import styles from './styles.scss';

export default class ShoppingCart extends Component {
  static propTypes = {
    countItems: PropTypes.number.isRequired,
    className: PropTypes.string
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  buy = () => {
    this.context.router.push('/checkout');
  };

  countLunch() {
    const { countItems } = this.props;
    if (countItems > 9) {
      return '*';
    } else if (countItems === 0) {
      return '';
    }
    return countItems;
  }

  render() {
    return (
      <div className={this.props.className}>
        <IconButton onClick={this.buy} className={styles.btnShopping} icon="shopping_cart" accent>
          {this.props.countItems && <div className={styles.shopPoint}>{this.countLunch()}</div>}
        </IconButton>
      </div>
    );
  }
}
