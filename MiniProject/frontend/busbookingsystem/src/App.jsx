import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import BusList from './components/BusList';
import BookingList from './components/BookingList';
import UserList from './components/UserList';
import AddBus from './components/AddBus';
import EditBus from './components/EditBus';
import AddBooking from './components/AddBooking';
import AddUser from './components/AddUser';
import Login from './components/Login';
import Signup from './components/Signup';
import PaymentPage from './components/PaymentPage';
import TransferSeatPage from './components/TransferSeatPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './styles/global.css';
import './styles/forms.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/buses" element={<BusList />} />
              
              {/* Protected routes for authenticated users */}
              <Route element={<ProtectedRoute />}>
                <Route path="/bookings" element={<BookingList />} />
                <Route path="/bookings/add" element={<AddBooking />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/transfer-seat" element={<TransferSeatPage />} />
              </Route>
              
              {/* Protected routes for admins */}
              <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="/users" element={<UserList />} />
                <Route path="/users/add" element={<AddUser />} />
                <Route path="/buses/add" element={<AddBus />} />
                <Route path="/buses/edit/:id" element={<EditBus />} />
              </Route>
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
