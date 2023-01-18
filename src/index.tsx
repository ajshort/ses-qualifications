import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import './index.scss';

const element = document.getElementById('root');

if (!element) {
  throw new Error('Could not find the root element');
}

const root = ReactDOM.createRoot(element);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
