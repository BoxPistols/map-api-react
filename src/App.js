import React, { Component } from 'react'
import './App.sass'
//import Box from './components/Box/Box';
// import ActionGreet from './components/ActionGreet/ActionGreet'
import SearchForm from './components/SearchForm/SearchForm'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  handlePlaceSubmit(place) {
    console.log(place)
  }
  render() {
    return (
      <div className="App">
        <section className="section">{/* <Box >*/}</section>
        {/*<ActionGreet />*/}
        <section className="section">
          <h1>緯度軽度検索</h1>
          <SearchForm onSubmit={(place) => this.handlePlaceSubmit(place)} />
        </section>
      </div>
    )
  }
}
export default App
