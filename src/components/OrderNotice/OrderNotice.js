import React, { PropTypes } from 'react';
import Input from 'components/Input/Input';
import { IconButton } from 'react-toolbox/lib/button';
import styles from './styles.scss';

export default class OrderNotice extends React.Component {
  static propTypes = {
    notice: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    mayEdit: PropTypes.bool.isRequired
  };

  state = {
    notice: this.props.notice
  };

  onChange = (value) => {
    this.setState({
      notice: {
        ...this.state.notice,
        content: value
      }
    });
  };

  makeEditable = () => {
    this.setState({ editMode: true });
  };

  submit = () => {
    this.props.onSubmit(this.state.notice);
    this.setState({ editMode: false });
  };

  cancel = () => {
    this.setState({
      editMode: false,
      notice: this.props.notice
    });
  };

  delete = () => {
    this.props.onDelete(this.props.notice);
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
    return (
      <span>
        <IconButton onClick={this.makeEditable} className={styles.icon} icon="edit" inverse/>
        <IconButton onClick={this.delete} className={styles.icon} icon="delete_forever" inverse/>
      </span>
    );
  };

  render() {
    const { editMode, notice } = this.state;
    const { mayEdit } = this.props;

    return (
      <div className={styles.notice}>
        {mayEdit && this.buttons()}
        <span>Важно: </span>
        {editMode ?
          <Input value={notice.content} multiline={true} onChange={this.onChange}/>
        :
          <p>{notice.content}</p>
        }
      </div>
    );
  }
}
