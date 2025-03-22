import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addBooking } from '../services/api';
import busImages from '../assets/busImages';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const bookingData = location.state?.bookingData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!bookingData) {
    navigate('/buses');
    return null;
  }

  const handleConfirmPayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Create the booking with CONFIRMED status
      const bookingPayload = {
        ...bookingData,
        status: 'CONFIRMED'
      };

      await addBooking(bookingPayload);
      
      // Show success popup
      setShowSuccess(true);
      
      // Navigate to bookings page after 2 seconds
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Failed to confirm payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const busImage = bookingData.bus ? busImages.getBusImage(bookingData.bus) : busImages.default;

  return (
    <div className="container">
      {showSuccess && (
        <>
          <div className="success-popup-overlay" />
          <div className="success-popup">
            <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <h2 className="success-title">Booking Successful!</h2>
            <p className="success-message">Your ticket has been booked successfully</p>
          </div>
        </>
      )}

      <div className="page-header">
        <h1 className="page-title">Payment Details</h1>
      </div>

      {error && (
        <div className="premium-alert premium-alert-error">
          <svg className="premium-alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <div className="payment-container">
        <div className="payment-card">
          <div className="payment-header">
            <h2>Booking Summary</h2>
          </div>

          <div className="bus-image-container">
            <img src={busImage} alt={bookingData.bus?.name || 'Bus'} className="bus-image" />
          </div>

          <div className="payment-details">
            <div className="payment-detail-row">
              <span className="payment-label">Bus Name:</span>
              <span className="payment-value">{bookingData.bus?.name || `Bus #${bookingData.busId}`}</span>
            </div>

            <div className="payment-detail-row">
              <span className="payment-label">Route:</span>
              <span className="payment-value">{bookingData.bus?.route || 'N/A'}</span>
            </div>

            <div className="payment-detail-row">
              <span className="payment-label">Seat Number:</span>
              <span className="payment-value">{bookingData.seatNumber}</span>
            </div>

            <div className="payment-detail-row">
              <span className="payment-label">Travel Date:</span>
              <span className="payment-value">
                {new Date(bookingData.bookingDate).toLocaleDateString()}
              </span>
            </div>

            <div className="payment-detail-row">
              <span className="payment-label">Travel Time:</span>
              <span className="payment-value">
                {new Date(bookingData.bookingDate).toLocaleTimeString()}
              </span>
            </div>

            <div className="payment-detail-row total">
              <span className="payment-label">Total Amount:</span>
              <span className="payment-value price">₹{bookingData.amount}</span>
            </div>
          </div>

          <div className="payment-actions">
            <button
              className="premium-btn premium-btn-secondary"
              onClick={() => navigate('/buses')}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="premium-btn premium-btn-primary"
              onClick={handleConfirmPayment}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="premium-spinner"></div>
                  Processing...
                </>
              ) : (
                'Confirm Payment'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage; 