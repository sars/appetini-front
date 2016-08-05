import React, {Component, PropTypes} from 'react';
import { asyncConnect } from 'redux-async-connect';
import DeliveryPeriod from 'components/DeliveryPeriod/DeliveryPeriod';
import ColumnLayout from 'components/ColumnLayout/ColumnLayout';
import Dishes from 'components/Dishes/Dishes';
import Cook from 'components/LunchDetailsCook/Cook';
import CookPreview from 'components/LunchDetailsCook/Preview/Preview';
import Purchase from './Purchase/Purchase';
import PurchasePreview from './Purchase/Preview/Preview';
import Photos from './Photos/Photos';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { getLunch } from 'helpers/lunches';
import classNames from 'classnames';
import ga from 'components/GaEvent/ga';
import Button from 'components/Button/Button';
import { link as stylesLink } from 'components/HeaderMenu/HeaderMenu.scss';
import { Link } from 'react-router';
import Card, { CardContent } from 'components/Card/Card';

@asyncConnect([
  {key: 'lunch', promise: ({params, helpers, store}) => {
    return getLunch()({params, helpers, store}).then(lunch => lunch);
  }}
])
export default class LunchDetails extends Component {
  static propTypes = {
    lunch: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  static contextTypes = {
    client: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
  };

  state = {
    cookOpened: false,
    purchaseOpened: false
  };

  handleMobilePurchase = () => {
    this.setState({purchaseOpened: true});
    ga('Buy(mobile)');
  };

  render() {
    const styles = require('./LunchDetails.scss');
    const { lunch } = this.props;
    const { cook } = lunch;

    const leftSidebarClasses = classNames(styles.leftSidebar, {
      [styles.leftSidebarOpened]: this.state.cookOpened
    });

    const buyContainerClasses = classNames(styles.buyContainer, {
      [styles.buyContainerOpened]: this.state.purchaseOpened
    });

    return (
      <ColumnLayout className={styles.root}>
        <div className={styles.middlePart}>
          <div className={styles.middlePartContent}>
            <div className={leftSidebarClasses}>
              <ReactCSSTransitionGroup transitionEnterTimeout={310} transitionLeaveTimeout={310} transitionName="overlay">
                {this.state.cookOpened && <div key="overlay" className={styles.overlay}
                                               onClick={() => this.setState({cookOpened: false})}></div>}
              </ReactCSSTransitionGroup>
              <div className={styles.cookContainer}>
                <Cook cook={cook}/>
              </div>
            </div>
            <div className={styles.lunchContainer}>
              <div className={styles.header}>
                <div className={styles.headerBackLink}>
                  <Link className={stylesLink} to="/">
                    <span>Назад к списку обедов</span>
                  </Link>
                  <h1>Обед от {cook.full_name_genitive}</h1>
                </div>
                <DeliveryPeriod className={styles.deliveryPeriod} time={lunch.ready_by} />
              </div>
              <div className={styles.previewsContainer}>
                <CookPreview cook={cook} className={styles.cookPreview}
                             onClick={() => this.setState({cookOpened: true})}/>
                <PurchasePreview lunch={lunch} className={styles.purchasePreview}
                                 onClick={::this.handleMobilePurchase}/>
              </div>
              <div className={styles.lunch}>
                <div className={styles.lunchContent}>
                  <div className={styles.lunchContentInner}>
                    <Photos className={styles.photos} lunch={lunch}/>
                    <Card><Dishes dishes={lunch.dishes}/></Card>
                    { lunch.description &&
                    <div className={styles.descriptionWrapper}>
                      <Card>
                        <CardContent>
                          <h3>Описание обеда:</h3>
                            <span className={styles.description}>
                              {lunch.description}
                            </span>
                        </CardContent>
                      </Card>
                    </div>
                    }
                  </div>
                </div>
                <div className={buyContainerClasses}>
                  <ReactCSSTransitionGroup transitionEnterTimeout={310} transitionLeaveTimeout={310} transitionName="overlay">
                    {this.state.purchaseOpened && <div key="overlay" className={styles.overlay}
                                                       onClick={() => this.setState({purchaseOpened: false})}></div>}
                  </ReactCSSTransitionGroup>
                  <div className={styles.buyContent}>
                    <Purchase lunch={lunch}/>
                  </div>
                </div>
              </div>
              <div className={styles.mobBackLink}>
                <Link to="/">
                  <Button flat outlined className={classNames(styles.button)} label="К списку обедов"/>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </ColumnLayout>
    );
  }
}
