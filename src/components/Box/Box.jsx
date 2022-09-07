import React from 'react'
import Style from './Box.module.scss'
export default function Box() {
  // Class Component
  class Counter extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        count: 0,
      }
    }

    countUp() {
      this.setState((prevState) => {
        return {
          count: prevState.count + 1,
        }
      })
    }
    render() {
      return (
        <div style={{ backgroundColor: this.props.color }} onClick={this.countUp}>
          {this.state.count}
        </div>
      )
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
  )
}
