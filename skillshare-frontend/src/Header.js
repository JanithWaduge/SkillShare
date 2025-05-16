import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">Talento</div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/tutorials">Tutorials</Link>
        <Link to="/quizzes">Quizzes</Link>
      </nav>
    </header>
  );
}

export default Header;
