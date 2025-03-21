import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookings, cancelBooking, getUserBookings } from '../services/api';
import { useAuth } from '../context/AuthContext';
import busImages from '../assets/busImages';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, [currentUser]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // If user is not admin, only fetch their own bookings
      const response = currentUser?.role === 'ADMIN' 
        ? await getBookings() 
        : await getUserBookings(currentUser.id);
      
      setBookings(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch bookings. Please try again later.');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(id);
        // Update the status in the UI without refetching
        setBookings(bookings.map(booking => 
          booking.id === id ? { ...booking, status: 'CANCELLED' } : booking
        ));
      } catch (err) {
        setError('Failed to cancel booking. Please try again.');
        console.error('Error cancelling booking:', err);
      }
    }
  };

  // Filter bookings based on the selected status
  const filteredBookings = statusFilter
    ? bookings.filter(booking => booking.status === statusFilter)
    : bookings;

  const getStatusClassName = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'status-badge-confirmed';
      case 'PENDING':
        return 'status-badge-pending';
      case 'CANCELLED':
        return 'status-badge-cancelled';
      case 'COMPLETED':
        return 'status-badge-completed';
      default:
        return 'status-badge-default';
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">My Bookings</h1>
        <button 
          className="premium-btn premium-btn-primary"
          onClick={() => navigate('/bookings/add')}
        >
          Book New Ticket
        </button>
      </div>

      {error && (
        <div className="premium-alert premium-alert-error">
          <svg className="premium-alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <div className="premium-card">
        <div className="filter-controls">
          <h3 className="filter-title">Filter by Status</h3>
          <div className="status-filter-buttons">
            <button
              className={`status-filter-btn ${statusFilter === '' ? 'active' : ''}`}
              onClick={() => setStatusFilter('')}
            >
              All
            </button>
            <button
              className={`status-filter-btn status-filter-pending ${statusFilter === 'PENDING' ? 'active' : ''}`}
              onClick={() => setStatusFilter('PENDING')}
            >
              Pending
            </button>
            <button
              className={`status-filter-btn status-filter-confirmed ${statusFilter === 'CONFIRMED' ? 'active' : ''}`}
              onClick={() => setStatusFilter('CONFIRMED')}
            >
              Confirmed
            </button>
            <button
              className={`status-filter-btn status-filter-completed ${statusFilter === 'COMPLETED' ? 'active' : ''}`}
              onClick={() => setStatusFilter('COMPLETED')}
            >
              Completed
            </button>
            <button
              className={`status-filter-btn status-filter-cancelled ${statusFilter === 'CANCELLED' ? 'active' : ''}`}
              onClick={() => setStatusFilter('CANCELLED')}
            >
              Cancelled
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner-large"></div>
          <p>Loading bookings...</p>
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="booking-grid">
          {filteredBookings.map(booking => {
            const busImage = booking.bus ? busImages.getBusImage(booking.bus) : busImages.default;
            return (
              <div key={booking.id} className="booking-card">
                <div className="booking-card-header">
                  <div className="booking-info">
                    <h2 className="booking-title">{booking.bus?.name || 'Bus details not available'}</h2>
                    <p className="booking-route">{booking.bus?.route || 'Route not available'}</p>
                  </div>
                  <div className={`status-badge ${getStatusClassName(booking.status)}`}>
                    {booking.status}
                  </div>
                </div>
                
                <div className="bus-image-container">
                  <img src={busImage} alt={booking.bus?.name} className="bus-image" />
                </div>
                
                <div className="booking-card-content">
                  <div className="booking-details-grid">
                    <div className="booking-detail-item">
                      <span className="booking-detail-label">Booking ID</span>
                      <span className="booking-detail-value">#{booking.id}</span>
                    </div>
                    
                    <div className="booking-detail-item">
                      <span className="booking-detail-label">Seat Number</span>
                      <span className="booking-detail-value">{booking.seatNumber}</span>
                    </div>
                    
                    <div className="booking-detail-item">
                      <span className="booking-detail-label">Date & Time</span>
                      <span className="booking-detail-value">{new Date(booking.bookingDate).toLocaleString()}</span>
                    </div>
                    
                    <div className="booking-detail-item">
                      <span className="booking-detail-label">Amount</span>
                      <span className="booking-detail-value price">₹{booking.amount}</span>
                    </div>
                    
                    {currentUser?.role === 'ADMIN' && (
                      <div className="booking-detail-item full-width">
                        <span className="booking-detail-label">Passenger</span>
                        <span className="booking-detail-value">{booking.user?.name || 'User not available'}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="booking-travel-info">
                    <div className="travel-time-container">
                      <div className="departure-info">
                        <span className="time-label">Departure</span>
                        <span className="time-value">{booking.bus?.departureTime || 'N/A'}</span>
                      </div>
                      <div className="travel-line">
                        <div className="dot start"></div>
                        <div className="line"></div>
                        <div className="dot end"></div>
                      </div>
                      <div className="arrival-info">
                        <span className="time-label">Arrival</span>
                        <span className="time-value">{booking.bus?.arrivalTime || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {booking.status === 'PENDING' && (
                    <div className="booking-card-actions">
                      <button
                        className="premium-btn premium-btn-danger"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-results">
          <svg className="no-results-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="no-results-text">
            {statusFilter 
              ? `No ${statusFilter.toLowerCase()} bookings found.` 
              : 'No bookings found.'}
          </p>
          <button 
            className="premium-btn premium-btn-primary"
            onClick={() => navigate('/bookings/add')}
          >
            Book New Ticket
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingList; 