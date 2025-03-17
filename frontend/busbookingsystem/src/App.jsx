import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import BusList from './components/BusList';
import BookingList from './components/BookingList';
import UserList from './components/UserList';
import AddBus from './components/AddBus';
import AddBooking from './components/AddBooking';
import AddUser from './components/AddUser';
import './styles/global.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/buses" element={<BusList />} />
            <Route path="/bookings" element={<BookingList />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/buses/add" element={<AddBus />} />
            <Route path="/users/add" element={<AddUser />} />
            <Route path="/bookings/add" element={<AddBooking />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
