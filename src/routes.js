import React from 'react';
import { IndexRoute, Route } from 'react-router';
import hooks from './routerHooks';
import {
    Root,
    App,
    Home,
    Lunches,
    Cooks,
    About,
    LoginSuccess,
    NotFound,
    LunchDetails,
    AuthorizedApp,
    TeamOffers,
    TeamOfferShow,
    TeamOrderShow,
    AdminDashboard,
    AdminLunches,
    AdminLunchesNew,
    AdminLunchesEdit,
    AdminLunchesExamples,
    AdminLunchesExamplesNew,
    AdminLunchesExamplesEdit,
    AdminLunchesExamplesClone,
    AdminOrders,
    AdminCooks,
    AdminCooksNew,
    AdminCooksEdit,
    AdminOrderItems,
    Tariffs,
    OrderShow,
    OrdersIndex,
    Checkout,
    Recovery,
    Registration,
    Settings,
    OrderSuccess,
    CookOrdersPage,
    DraftLunchesEdit,
    DraftLunchesNew,
    DraftLunchesList,
    CourierOrdersPage
} from 'containers';

export default (store, client) => {
  const { userLoad, confirmEmail, requireLogin, checkCurrentCook, loadEditOrder } = hooks(store, client);

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route onEnter={userLoad} client={client} component={Root}>
      <Route path="/team_orders/:orderId(/reviews)" component={TeamOrderShow}/>
      <Route path="/" component={App}>
        { /* Routes requiring login */ }
        <Route onEnter={requireLogin} component={AuthorizedApp}>
          <Route path="loginSuccess" component={LoginSuccess}/>
        </Route>

        <IndexRoute component={Home}/>

        <Route path="users/confirm/:token" onEnter={confirmEmail}/>

        <Route path="join" component={Registration}/>
        <Route path="lunches" component={Lunches}/>
        <Route path="team_offers" component={TeamOffers}/>
        <Route path="team_offers/:offerId(/reviews)" component={TeamOfferShow}/>
        <Route path="/team_orders/owner/:orderId(/reviews)" component={TeamOrderShow}/>
        <Route path="cooks" component={Cooks}/>
        <Route path="recovery" component={Recovery}/>
        <Route path="recovery/:token" component={Recovery.Password}/>

        <Route path="about" component={About}/>
        <Route path="lunches/:lunchId(/reviews)" component={LunchDetails}/>
        <Route path="tariffs" component={Tariffs}/>
        <Route path="checkout" component={Checkout}/>
        <Route path="order/:orderId/success" component={OrderSuccess}/>
        <Route path="settings" component={Settings}/>
        <Route path="cooks/:cookId/orders" component={CookOrdersPage}/>
        <Route path="cooks/:cookId/draft_lunches" onEnter={checkCurrentCook}
               component={AuthorizedApp} authCondition={user => user && (user.cook || user.role === 'admin')}>
          <IndexRoute component={DraftLunchesList}/>
          <Route path="new" component={DraftLunchesNew}/>
          <Route path=":draftLunchId/edit" component={DraftLunchesEdit}/>
        </Route>
        <Route path="courier/orders" component={CourierOrdersPage}/>
        <Route path="orders" component={OrdersIndex}/>
        <Route path="orders/:orderId" component={OrderShow}/>
        <Route path="orders/:orderId/edit" onEnter={loadEditOrder}/>

      <Route path="admin" onEnter={requireLogin} component={AuthorizedApp} authCondition={user => user && user.role === 'admin'}>
        <IndexRoute component={AdminDashboard}/>
        <Route path="orders" component={AdminOrders}/>
        <Route path="order_items" component={AdminOrderItems}/>
        <Route path="lunches" component={AdminLunches}/>
        <Route path="lunches/:lunchId/edit" component={AdminLunchesEdit}/>
        <Route path="lunches/new" component={AdminLunchesNew}/>
        <Route path="lunch_examples" component={AdminLunchesExamples}/>
        <Route path="lunch_examples/new" component={AdminLunchesExamplesNew}/>
        <Route path="lunch_examples/:lunchExampleId/edit" component={AdminLunchesExamplesEdit}/>
        <Route path="lunch_examples/:lunchExampleId/clone" component={AdminLunchesExamplesClone}/>
        <Route path="cooks" component={AdminCooks}/>
        <Route path="cooks/:cookId/edit" component={AdminCooksEdit}/>
        <Route path="cooks/new" component={AdminCooksNew}/>
      </Route>

        { /* Catch all route */ }
        <Route path="*" component={NotFound} status={404}/>
      </Route>
    </Route>
  );
};
