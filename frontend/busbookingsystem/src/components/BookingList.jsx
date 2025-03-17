import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookings, deleteBooking, getUserBookings } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    fetchBookings();
  }, [currentUser, navigate]);

  const fetchBookings = async () => {
    try {
      let response;
      
      // If user is admin, fetch all bookings, otherwise fetch only user's bookings
      if (currentUser && currentUser.role === 'ADMIN') {
        response = await getBookings();
      } else if (currentUser) {
        response = await getUserBookings(currentUser.id);
      } else {
        // Should not happen since we redirect above, but just in case
        navigate('/login');
        return;
      }
      
      console.log('Bookings data:', response.data);
      setBookings(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to fetch bookings');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteBooking(id);
        fetchBookings();
      } catch (err) {
        console.error('Error deleting booking:', err);
        setError('Failed to delete booking');
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'badge badge-success';
      case 'CANCELLED':
        return 'badge badge-danger';
      case 'PENDING':
        return 'badge badge-warning';
      default:
        return 'badge';
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">
          {currentUser && currentUser.role === 'ADMIN' ? 'All Bookings' : 'My Bookings'}
        </h1>
        <button className="btn btn-primary" onClick={() => navigate('/buses')}>
          Book a Ticket
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Booking ID</th>
              {currentUser && currentUser.role === 'ADMIN' && <th>User ID</th>}
              <th>Bus ID</th>
              <th>Booking Date</th>
              <th>Seat Number</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  {currentUser && currentUser.role === 'ADMIN' && <td>{booking.userId}</td>}
                  <td>{booking.busId}</td>
                  <td>{booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{booking.seatNumber}</td>
                  <td>₹{booking.amount}</td>
                  <td>
                    <span className={getStatusBadgeClass(booking.status)}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      {currentUser && currentUser.role === 'ADMIN' && (
                        <button
                          className="btn btn-secondary"
                          onClick={() => navigate(`/bookings/edit/${booking.id}`)}
                        >
                          Edit
                        </button>
                      )}
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(booking.id)}
                      >
                        {currentUser && currentUser.role === 'ADMIN' ? 'Delete' : 'Cancel'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={currentUser && currentUser.role === 'ADMIN' ? 8 : 7} className="text-center">No bookings found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingList; 