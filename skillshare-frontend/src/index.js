import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen';
import AuthScreen from './pages/AuthScreen';
import App from './App';
import Tutorials from './TutorialList';
import LearnPage from './LearnPage';
import ViewAllTutorials from './ViewAllTutorialsAdmin';
import Profile from './components/Profile';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/posts" element={<App />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tutorials" element={<Tutorials />} />
        <Route path="/learn/:id" element={<LearnPage />} />
        <Route path="/admin/tutorials" element={<ViewAllTutorials />} />
      </Routes>
    </Router>
  </React.StrictMode>
);