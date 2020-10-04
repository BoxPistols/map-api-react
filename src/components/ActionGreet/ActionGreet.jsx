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
  /*
   * フォームの入力値変動の監視用関数
   * 仮引数のセット
   * setState nameの値
   * onChange側でe.target.valueでターゲットの値を取得
   */
  handleChangeName (e) {
    this.setState ({name: e.target.value});
  }
  render () {
    return (
      <div>
        <input
          type="text"
          value={this.state.name}
          // event関数 値の監視と取得
          onChange={e => this.handleChangeName (e)}
        />
        {/* 設置する値の送信 */}
        <button onClick={() => this.handleChangeName ('Bob!')}>Button</button>
        <p>State: {this.state.msg}</p>
        <p>Props: {this.props.msg}</p>
        {/* 表示する受動値 */}
        <Greeting name={this.state.name} />
      </div>
    );
  }
}

export default ActionGreet;
