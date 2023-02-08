import React from 'react';
import ReactDOM from 'react-dom/client';
import { IEApp } from 'icetf';
import { Router } from 'ice-router-dom';
import reportWebVitals from './reportWebVitals';

// 导入当前模块
import './Module'
import './index.css';

class App extends React.Component {
    render() {
        return <IEApp router={Router} />
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();