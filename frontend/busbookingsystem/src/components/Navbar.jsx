import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          BusBooking
        </Link>
        <div className="navbar-links">
          <Link to="/buses" className="nav-link">Buses</Link>
          <Link to="/bookings" className="nav-link">Bookings</Link>
          <Link to="/users" className="nav-link">Users</Link>
          <Link to="/buses/add" className="nav-link">Add Bus</Link>
          <Link to="/users/add" className="nav-link">Add User</Link>
          <Link to="/bookings/add" className="nav-link">Add Booking</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 