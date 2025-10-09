import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// NO MORE CONTEXT PROVIDERS ARE NEEDED HERE.
// The Redux Provider is correctly placed inside your App.jsx file.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
