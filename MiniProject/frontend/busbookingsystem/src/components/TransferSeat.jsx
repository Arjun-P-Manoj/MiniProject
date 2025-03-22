import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserBookings, getBusById } from '../services/api';
import { useAuth } from '../context/AuthContext';
import busImages from '../assets/busImages';

const TransferSeat = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, [currentUser]);

  const fetchBusData = async (busId) => {
    try {
      const response = await getBusById(busId);
      return response.data;
    } catch (err) {
      console.error(`Error fetching bus data for ID ${busId}:`, err);
      return null;
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getUserBookings(currentUser.id);
      
      // Fetch bus data for each booking
      const bookingsWithBusData = await Promise.all(response.data.map(async (booking) => {
        if (booking.busId) {
          const busData = await fetchBusData(booking.busId);
          if (busData) {
            booking.bus = busData;
          }
        }
        return booking;
      }));
      
      // Filter only confirmed bookings
      const confirmedBookings = bookingsWithBusData.filter(booking => booking.status === 'CONFIRMED');
      setBookings(confirmedBookings);
      setError(null);
    } catch (err) {
      setError('Failed to fetch bookings. Please try again later.');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!selectedBooking || !recipientEmail) {
      setError('Please select a booking and enter recipient email');
      return;
    }

    // TODO: Implement the transfer logic
    // This will be implemented when we create the backend endpoint
    console.log('Transfer request:', {
      bookingId: selectedBooking.id,
      recipientEmail
    });
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Transfer Seat</h1>
        <p className="page-subtitle">Transfer your confirmed booking to another user</p>
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
        <div className="transfer-section">
          <h2 className="section-title">Select Booking to Transfer</h2>
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner-large"></div>
              <p>Loading bookings...</p>
            </div>
          ) : bookings.length > 0 ? (
            <div className="booking-grid">
              {bookings.map(booking => (
                <div 
                  key={booking.id} 
                  className={`booking-card ${selectedBooking?.id === booking.id ? 'selected' : ''}`}
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div className="booking-card-header">
                    <div className="booking-info">
                      <h3 className="booking-title">
                        {booking.bus?.name || `Bus #${booking.busId}`}
                      </h3>
                      <p className="booking-route">
                        {booking.bus?.route || 'Route information not available'}
                      </p>
                    </div>
                    <div className="status-badge status-badge-confirmed">
                      CONFIRMED
                    </div>
                  </div>
                  
                  <div className="booking-card-content">
                    <div className="booking-details-grid">
                      <div className="booking-detail-item">
                        <span className="booking-detail-label">Seat Number</span>
                        <span className="booking-detail-value">{booking.seatNumber}</span>
                      </div>
                      
                      <div className="booking-detail-item">
                        <span className="booking-detail-label">Date & Time</span>
                        <span className="booking-detail-value">
                          {new Date(booking.bookingDate).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="booking-detail-item">
                        <span className="booking-detail-label">Amount</span>
                        <span className="booking-detail-value price">₹{booking.amount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <svg className="no-results-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="no-results-text">No confirmed bookings found.</p>
            </div>
          )}
        </div>

        {selectedBooking && (
          <div className="transfer-form">
            <h2 className="section-title">Transfer Details</h2>
            <div className="form-group">
              <label htmlFor="recipientEmail">Recipient's Email</label>
              <input
                type="email"
                id="recipientEmail"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="Enter recipient's email address"
                className="premium-input"
              />
            </div>
            <button 
              className="premium-btn premium-btn-primary"
              onClick={handleTransfer}
            >
              Transfer Seat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferSeat; 