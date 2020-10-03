import React from 'react';
import Style from './Box.module.sass';
export default function Box () {
  class Counter extends React.Component {
    render () {
      return (
        <div style={{backgroundColor: this.props.color}}>
          0
        </div>
      );
    }
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
