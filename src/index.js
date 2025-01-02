import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
window.addEventListener('storage', (event) => {
    if (event.storageArea === localStorage && !localStorage.getItem('email')) {
        window.location.href = '/login';
    }
});
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
