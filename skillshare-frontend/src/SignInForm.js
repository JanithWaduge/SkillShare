import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthStyles.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send login request to the backend for authentication
      const res = await axios.post('http://localhost:8081/api/users/authenticate', {
        email,
        password
      });

      if (res.data === 'Authentication successful') {
        toast.success('✅ Successfully signed in!');
        setTimeout(() => navigate('/posts'), 1500);
      } else {
        toast.error('❌ Invalid credentials. Please try again.');
      }
    } catch {
      toast.error('❌ An error occurred. Please try again later.');
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Sign in to Talento</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email or phone"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SignInForm;
