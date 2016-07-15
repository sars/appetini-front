import React from 'react';
import { IndexRoute, Route } from 'react-router';
import hooks from './routerHooks';
import {
    App,
    Home,
    Lunches,
    Cooks,
    About,
    LoginSuccess,
    NotFound,
    LunchDetails,
    AuthorizedApp,
    AdminDashboard,
    AdminLunches,
    AdminLunchesNew,
    AdminLunchesEdit,
    AdminLunchesClone,
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
    CourierOrdersPage
} from 'containers';

export default (store, client) => {
  const { userLoad, confirmEmail, requireLogin } = hooks(store, client);

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App} onEnter={userLoad} client={client}>
      { /* Routes requiring login */ }
      <Route onEnter={requireLogin} component={AuthorizedApp}>
        <Route path="loginSuccess" component={LoginSuccess}/>
      </Route>

      <IndexRoute component={Home}/>

      <Route path="users/confirm/:token" onEnter={confirmEmail}/>

      <Route path="join" component={Registration}/>
      <Route path="lunches" component={Lunches}/>
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
      <Route path="courier/orders" component={CourierOrdersPage}/>
      <Route path="orders" component={OrdersIndex}/>
      <Route path="orders/:orderId" component={OrderShow}/>

      <Route path="admin" onEnter={requireLogin} component={AuthorizedApp} authCondition={user => user && user.role === 'admin'}>
        <IndexRoute component={AdminDashboard}/>
        <Route path="orders" component={AdminOrders}/>
        <Route path="order_items" component={AdminOrderItems}/>
        <Route path="lunches" component={AdminLunches}/>
        <Route path="lunches/:lunchId/edit" component={AdminLunchesEdit}/>
        <Route path="lunches/:lunchId/clone" component={AdminLunchesClone}/>
        <Route path="lunches/new" component={AdminLunchesNew}/>
        <Route path="cooks" component={AdminCooks}/>
        <Route path="cooks/:cookId/edit" component={AdminCooksEdit}/>
        <Route path="cooks/new" component={AdminCooksNew}/>
      </Route>

      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
