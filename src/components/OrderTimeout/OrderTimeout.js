import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import padStart from 'lodash/padStart';

export default class OrderTimeout extends Component {
  static propTypes = {
    lunch: PropTypes.object,
    className: PropTypes.string
  }

  state = {
    time: ''
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({
        time: this.getTime()
      });
    }, 100);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getTime() {
    const time = moment.duration(moment(this.props.lunch.ready_by).subtract(this.props.lunch.disable_minutes, 'minutes').diff(moment()));
    const showTimer = Math.floor(time.asHours()) < 24;
    const timeCheck = (int) => {
      if (int >= 0) {
        return padStart(int, 2, '0');
      }
      return '00';
    };
    if (showTimer) {
      return timeCheck(Math.floor(time.asHours())) + ':' + timeCheck(Math.floor(time.minutes())) + ':' + timeCheck(Math.floor(time.seconds()));
    }
    return 'больше дня';
  }

  render() {
    const {className} = this.props;
    return (
        <span className={className}>{this.state.time}</span>
    );
  }
}
