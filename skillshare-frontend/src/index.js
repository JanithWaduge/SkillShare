import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SplashScreen from './SplashScreen';
import AuthScreen from './AuthScreen';
import SignInForm from './SignInForm';
import UserManagement from './UserManagement';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/signin" element={<SignInForm />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/posts" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
