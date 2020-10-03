import React from 'react';
import Style from './Box.module.sass';
export default function Box () {
  function Counter (props) {
    function countUp (c) { // 仮引数
      return alert (c);
    }
    return (
      <div
        style={{backgroundColor: props.color}}
        onClick={() => countUp (props.color)}
      >
        0
      </div>
    );
  }
  return (
    <div>
      <div className={Style.box}>
        <Counter color="#4ecdc4" />
        <Counter color="#ffe66d" />
        <Counter color="#ff6b6b" />
      </div>
    </div>
  );
}
