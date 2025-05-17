import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SplashScreen from './SplashScreen';
import App from './App';
import Tutorials from './TutorialList';
import LearnPage from './LearnPage';
import ViewAllTutorials from './ViewAllTutorialsAdmin';
import AddTutorialForm from './AddTutorialForm';
import TutorialForm from './TutorialForm';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/posts" element={<App />} />
        <Route path="/tutorials" element={<Tutorials />} />
        <Route path="/learn/:id" element={<LearnPage />} />
        <Route path="/admin/tutorials" element={<ViewAllTutorials />} />
        <Route path="/admin/tutorials/add" element={<AddTutorialForm />} />
        <Route path="/admin/tutorial-form/:id" element={<TutorialForm />} />
      </Routes>
    </Router>
  </React.StrictMode>
);