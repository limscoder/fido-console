import React from 'react';
import ReactDOM from 'react-dom';
// eslint-disable-next-line
import * as types from 'styled-components/cssprop'
import './index.css';
import './resources/fonts/source-code-pro/SourceCodePro-Regular.ttf';
import App from './components/App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();