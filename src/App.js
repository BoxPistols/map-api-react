import React from 'react';
import './App.sass';
import Box from './components/Box/Box';
import ActionGreet from './components/ActionGreet/ActionGreet';

function App () {
  return (
    <div className="App">
      <section className="section">
      <Box />
      </section>
      <section className="section">
        <ActionGreet />
      </section>
    </div>
  );
}
export default App;
