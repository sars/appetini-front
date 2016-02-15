import React from 'react';
import {IndexRoute, Route} from 'react-router';
import {
    App,
    Home,
    Widgets,
    About,
    Login,
    LoginSuccess,
    Survey,
    NotFound,
    LunchDetails,
    AuthorizedApp
  } from 'containers';
import { setUser } from 'redux/modules/auth';

export default (store, client) => {
  const requireLogin = (nextState) => {
    const { user } = store.getState().auth;

    if (__SERVER__ && !user) {
      nextState.location.state = {...nextState.location.state, responseStatus: 403};
    }
  };

  const userLoad = (nextState, replaceState, cb) => {
    const state = store.getState();
    const { user } = state.auth;
    if (!user) {
      const userFromToken = state.auth.tokenPayload.user;
      if (userFromToken) {
        client.get('/users/' + userFromToken.id).then(result => {
          store.dispatch(setUser(result.resource));
          cb();
        }).catch(() => {
          cb();
        });
        return;
      }
    }
    cb();
  };

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App} onEnter={userLoad} client={client}>
      { /* Routes requiring login */ }
      <Route onEnter={requireLogin} component={AuthorizedApp}>
        { /* Home (main) route */ }
        <IndexRoute component={Home}/>
        <Route path="loginSuccess" component={LoginSuccess}/>
      </Route>

      { /* Routes */ }
      <Route path="about" component={About}/>
      <Route path="login" component={Login}/>
      <Route path="survey" component={Survey}/>
      <Route path="widgets" component={Widgets}/>

      <Route path="lunches/:lunchId" component={LunchDetails}/>

      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
