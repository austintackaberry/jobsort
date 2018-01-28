import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import "babel-polyfill";
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
