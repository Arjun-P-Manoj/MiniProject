import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="premium-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <svg className="logo-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
            <path d="M2 8h20"></path>
          </svg>
          <span className="logo-text">BusBooking</span>
        </Link>

        <div className="navbar-mobile-toggle" onClick={toggleMenu}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="menu-icon">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>

        <div className={`navbar-links-container ${isMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-links">
            <li className="nav-item">
              <Link to="/" className={`nav-link ${isActive('/')}`} onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/buses" className={`nav-link ${isActive('/buses')}`} onClick={closeMenu}>
                Buses
              </Link>
            </li>
            {currentUser && (
              <>
                <li className="nav-item">
                  <Link to="/bookings" className={`nav-link ${isActive('/bookings')}`} onClick={closeMenu}>
                    My Bookings
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/transfer-seat" className={`nav-link ${isActive('/transfer-seat')}`} onClick={closeMenu}>
                    Transfer Seat
                  </Link>
                </li>
              </>
            )}
            {currentUser?.role === 'ADMIN' && (
              <li className="nav-item">
                <Link to="/users" className={`nav-link ${isActive('/users')}`} onClick={closeMenu}>
                  Users
                </Link>
              </li>
            )}
          </ul>

          <div className="navbar-auth">
            {currentUser ? (
              <div className="user-menu">
                <div className="user-info">
                  <span className="user-name">{currentUser.name}</span>
                  {currentUser.role === 'ADMIN' && <span className="user-badge">Admin</span>}
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                  <svg className="logout-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="login-btn" onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/register" className="register-btn" onClick={closeMenu}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 