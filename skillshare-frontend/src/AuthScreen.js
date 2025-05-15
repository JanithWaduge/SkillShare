import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthStyles.css';

const AuthScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <h1 className="auth-title">Welcome to Talento</h1>
      <p className="auth-subtext">Your professional skill-sharing platform</p>
      <div className="auth-buttons">
        <button onClick={() => navigate('/signin')} className="sign-in-btn">Sign In</button>
        <button onClick={() => navigate('/users')} className="sign-up-btn">Join Now</button>
      </div>
    </div>
  );
};

export default AuthScreen;
