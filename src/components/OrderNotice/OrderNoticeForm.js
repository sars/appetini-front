import React, { PropTypes } from 'react';
import Input from 'components/Input/Input';
import { IconButton } from 'react-toolbox/lib/button';
import styles from './styles.scss';
import classNames from 'classnames';

export default class OrderNoticeForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    orderId: PropTypes.number.isRequired,
    readyBy: PropTypes.string.isRequired
  };

  state = {
    notice: {
      order_id: this.props.orderId,
      ready_by: this.props.readyBy
    }
  };

  onChange = (value) => {
    this.setState({
      notice: {
        ...this.state.notice,
        content: value
      }
    });
  };

  submit = () => {
    this.props.onSubmit(this.state.notice);
    this.setState({ editMode: false });
  };

  makeEditable = () => {
    this.setState({ editMode: true });
  };

  cancel = () => {
    this.setState({
      editMode: false,
      notice: {
        ...this.state.notice,
        content: undefined
      }
    });
  };

  buttons = () => {
    const { editMode } = this.state;

    if (editMode) {
      return (
        <span>
          <IconButton onClick={this.submit} className={styles.icon} icon="done" inverse/>
          <IconButton onClick={this.cancel} className={styles.icon} icon="cancel" inverse/>
        </span>
      );
    }
    return <IconButton onClick={this.makeEditable} className={styles.icon} icon="add_box" inverse/>;
  };

  render() {
    const { editMode, notice } = this.state;

    return (
      <div className={classNames(styles.notice, styles.new)}>
        {this.buttons()}
        <span>Создать заметку: </span>
        {editMode && <Input value={notice.content} multiline={true} onChange={this.onChange}/>}
      </div>
    );
  }
}
