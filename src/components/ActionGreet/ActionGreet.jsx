import React, {Component} from 'react';
import Greeting from '../../components/Greeting/Greeting';

class ActionGreet extends Component {
  constructor (props) {
    super (props);
    this.state = {
      name: 'myName',
      msg: 'Hell in',
    };
  }

  // フォームの入力値変動の監視用関数
  handleChangeName (e) { // 引数
    this.setState ({name: e.target.value});
  }
  render () {
    return (
      <div
      >
        <input
          type="text"
          value={this.state.name}
          onChange={e => this.handleChangeName (e)}
        />
        <p>State: {this.state.msg}</p>
        <p>Props: {this.props.msg}</p>
        <Greeting name={this.state.name}/>
      </div>
    );
  }
}

export default ActionGreet;
