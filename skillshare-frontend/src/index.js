import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import UserManagement from './UserManagement';  // Import the new component


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<UserManagement />} />  {/* This will be the default route */}
        <Route path="/posts" element={<App />} />  {/* This will route to the posts page */}
      </Routes>
    </Router>
  </React.StrictMode>
);


