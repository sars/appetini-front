import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink, Link } from 'react-router';
import Button from 'react-toolbox/lib/button';
import DatePicker from 'react-toolbox/lib/date_picker';
import Helmet from 'react-helmet';
import { isLoaded as isInfoLoaded, load as loadInfo } from 'redux/modules/info';
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';
import { InfoBar } from 'components';
import { pushState } from 'redux-router';
import connectData from 'helpers/connectData';
import config from '../../config';

function fetchData(getState, dispatch) {
  const promises = [];
  if (!isInfoLoaded(getState())) {
    promises.push(dispatch(loadInfo()));
  }
  if (!isAuthLoaded(getState())) {
    promises.push(dispatch(loadAuth()));
  }
  return Promise.all(promises);
}

const datetime = new Date(2015, 10, 16);
const minDatetime = new Date(new Date(datetime).setDate(8));
datetime.setHours(17);
datetime.setMinutes(28);

@connectData(fetchData)
@connect(
  state => ({user: state.auth.user}),
  {logout, pushState})
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  state = {
    date2: datetime
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.pushState(null, '/loginSuccess');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState(null, '/');
    }
  };

  handleChange = (item, value) => {
    const newState = {};
    newState[item] = value;
    this.setState(newState);
  };

  handleLogout = (event) => {
    event.preventDefault();
    this.props.logout();
  };

  render() {
    const {user} = this.props;
    const styles = require('./App.scss');

    return (
      <div className={styles.app}>
        <Helmet {...config.app.head}/>
        <IndexLink to="/" activeStyle={{color: '#33e0ff'}}>
          <div className={styles.brand}/>
          <span>{config.app.title}</span>
        </IndexLink>
        {user && <Link to="/chat">Chat</Link>}

        <Link to="/widgets">Widgets</Link> /
        <Link to="/survey">Survey</Link> /
        <Link to="/about">About Us</Link> /

        {!user && <Link to="/login">Login</Link>}
        {user && <Link to="/logout">Logout</Link>}

        <div className={styles.appContent}>
          {this.props.children}
        </div>
        <InfoBar/>
        <Button label="Hello world" onClick={this.handleClick} raised mini accent />
        <section>
          <DatePicker
            label="Birthdate"
            onChange={this.handleChange.bind(this, 'date1')}
            value={this.state.date1}
          />

          <DatePicker
            label="Expiration date"
            minDate={minDatetime}
            onChange={this.handleChange.bind(this, 'date2')}
            value={this.state.date2}
          />
        </section>
        <div className="well text-center">
          Have questions? Ask for help <a
          href="https://github.com/erikras/react-redux-universal-hot-example/issues"
          target="_blank">on Github</a> or in the <a
          href="https://discord.gg/0ZcbPKXt5bZZb1Ko" target="_blank">#react-redux-universal</a> Discord channel.
        </div>
      </div>
    );
  }
}
