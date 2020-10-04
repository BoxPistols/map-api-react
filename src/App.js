import React from 'react'
import './App.sass'
//import Box from './components/Box/Box';
import ActionGreet from './components/ActionGreet/ActionGreet'
import SearchForm from './components/SearchForm/SearchForm'

function App() {
  return (
    <div className="App">
      <section className="section">{/* <Box >*/}</section>
      <section className="section">
        {/*<ActionGreet />*/}
        <h1>緯度軽度検索</h1>
        <SearchForm />
      </section>
    </div>
  )
}
export default App
