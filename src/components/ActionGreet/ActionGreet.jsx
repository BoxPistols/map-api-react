import React, {Component} from 'react';
import Greeting from '../../components/Greeting/Greeting';

class ActionGreet extends Component {
  constructor (props) {
    super (props);
    this.state = {
      name: 'jjj',
    };
  }

  handleIn () {
    this.setState ({name: 'Bob'});
  }
  handleOut () {
    this.setState ({name: 'Mike'});
  }
  render () {
    return (
      <div
        onMouseOver={() => this.handleIn ()}
        onMouseOut={() => this.handleOut ()}
      >
        <Greeting name={this.state.name} />
      </div>
    );
  }
}

export default ActionGreet;
