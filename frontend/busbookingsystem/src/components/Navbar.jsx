import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#5754E1' }}>
            <path d="M6 17h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2z"></path>
            <path d="M1 6v2"></path>
            <path d="M23 6v2"></path>
            <path d="M1 16v2"></path>
            <path d="M23 16v2"></path>
            <path d="M8 20v-4"></path>
            <path d="M16 20v-4"></path>
            <path d="M4 9h16"></path>
          </svg>
          <span className="logo-text">BusGo</span>
        </Link>

        <button className="mobile-menu-button" onClick={toggleMenu}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {menuOpen ? (
              <path d="M18 6L6 18M6 6l12 12"></path> // X icon when menu is open
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18"></path> // Hamburger icon when menu is closed
            )}
          </svg>
        </button>

        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <NavLink to="/" className="navbar-link" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/buses" className="navbar-link" onClick={() => setMenuOpen(false)}>
            Buses
          </NavLink>
          {currentUser && (
            <NavLink to="/bookings" className="navbar-link" onClick={() => setMenuOpen(false)}>
              Bookings
            </NavLink>
          )}
          {currentUser && currentUser.role === 'ADMIN' && (
            <NavLink to="/users" className="navbar-link" onClick={() => setMenuOpen(false)}>
              Users
            </NavLink>
          )}
        </div>

        <div className={`navbar-actions ${menuOpen ? 'active' : ''}`}>
          {currentUser ? (
            <>
              <span className="user-greeting">
                Hi, {currentUser.name.split(' ')[0]}
              </span>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-button" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/signup" className="signup-button" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 