import React, {Component} from 'react';
import Helmet from 'react-helmet';
import Button from 'react-toolbox/lib/button';
import Dialog from 'react-toolbox/lib/dialog';
import Input from 'react-toolbox/lib/input';

export default class MyComponent extends Component {

  state = {
    active: false
  };

  handleToggle = () => {
    this.setState({active: !this.state.active});
  };

  actions = [
    { label: 'Cancel', onClick: this.handleToggle },
    { label: 'Save', onClick: this.handleToggle }
  ];

  render() {
    return (
      <div className="container">
        <Helmet title="About Us"/>
        <div>wefwerfwefewf</div>
        <Button label="Login popup" onClick={this.handleToggle} raised mini accent />
        <Dialog actions={this.actions} active={this.state.active}
                title="My awesome dialog" onOverlayClick={this.handleToggle}>
          <section>
            <Input type="email" label="Email address" icon="email" value={this.state.email} />
            <Input type="password" label="Password" icon="lock" value={this.state.password} />
          </section>
        </Dialog>
      </div>
    );
  }
}
