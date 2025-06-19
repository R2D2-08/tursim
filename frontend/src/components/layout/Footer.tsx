import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <Link to="/" className="footer-link">Home</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 