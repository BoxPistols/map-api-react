import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
serviceWorker.unregister ();

(() => {
  //const name = 'my-name';

  ReactDOM.render (
    <React.StrictMode>
      {/* <p>{name.toUpperCase ()}</p> */}
      <App />
    </React.StrictMode>,
    document.getElementById ('root')
  );
}) ();
