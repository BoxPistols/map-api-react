import React, {Component} from 'react';
import Greeting from '../../components/Greeting/Greeting';

class ActionGreet extends Component {
  constructor (props) {
    super (props);
    this.state = {
      name: 'myName',
    };
  }

  // handleIn () {
  //   this.setState ({name: 'Bob'});
  // }
  // handleOut () {
  //   this.setState ({name: 'Mike'});
  // }

  handleNameChange(e){
    console.log(e.target.value)
    this.setState({name: e.target.value})
  }
  render () {
    return (
      <div
        // onMouseOver={() => this.handleIn ()}
        // onMouseOut={() => this.handleOut ()}
      >
      <input
        type="text"
        value={this.state.name}
        onChange={e => this.handleNameChange(e)}
        />

        <Greeting name={this.state.name} />
      </div>
    );
  }
}

export default ActionGreet;
