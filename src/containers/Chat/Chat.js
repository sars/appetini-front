import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

@connect(
  state => ({user: state.auth.user})
)
export default class Chat extends Component {

  static propTypes = {
    user: PropTypes.object
  };

  state = {
    message: '',
    messages: []
  };

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onMessageReceived = (data) => {
    const messages = this.state.messages;
    messages.push(data);
    this.setState({messages});
  }

  handleSubmit = () => {
  }

  render() {
    const style = require('./Chat.scss');
    const {user} = this.props;

    return (
      <div className={style.chat + ' container'}>
        <h1 className={style}>Chat</h1>

        {user &&
        <div>
          <ul>
          {this.state.messages.map((msg) => {
            return <li key={`chat.msg.${msg.id}`}>{msg.from}: {msg.text}</li>;
          })}
          </ul>
          <form className="login-form" onSubmit={this.handleSubmit}>
            <input type="text" ref="message" placeholder="Enter your message"
             value={this.state.message}
             onChange={(event) => {
               this.setState({message: event.target.value});
             }
            }/>
            <button className="btn" onClick={this.handleSubmit}>Send</button>
          </form>
        </div>
        }
      </div>
    );
  }
}
