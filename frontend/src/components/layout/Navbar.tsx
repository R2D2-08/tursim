import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token') !== null;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleMenuToggle = () => setMenuOpen((open) => !open);
  const handleMenuClose = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">Turing Machine Simulator</Link>
        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="navbar-link">Dashboard</Link>
              <Link to="/code-editor" className="navbar-link">Code Runner</Link>
              <Link to="/documentation" className="navbar-link">Docs</Link>
              <Link to="/profile" className="navbar-link">Profile</Link>
              <button onClick={handleLogout} className="navbar-link">Logout</button>
            </>
          ) : (
            <>
              <Link to="/documentation" className="navbar-link">Docs</Link>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/signup" className="navbar-link">Signup</Link>
            </>
          )}
        </div>
        <button className="navbar-menu-icon" aria-label="Menu" onClick={handleMenuToggle}>
          <span className="navbar-menu-bar" />
          <span className="navbar-menu-bar" />
          <span className="navbar-menu-bar" />
        </button>
      </div>
      {menuOpen && (
        <div className="navbar-dropdown" onClick={handleMenuClose}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="navbar-link">Dashboard</Link>
              <Link to="/code-editor" className="navbar-link">Code Runner</Link>
              <Link to="/documentation" className="navbar-link">Docs</Link>
              <Link to="/profile" className="navbar-link">Profile</Link>
              <button onClick={handleLogout} className="navbar-link">Logout</button>
            </>
          ) : (
            <>
              <Link to="/documentation" className="navbar-link">Docs</Link>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/signup" className="navbar-link">Signup</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar; 