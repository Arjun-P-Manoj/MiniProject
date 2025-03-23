import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addBooking } from '../services/api';
import busImages from '../assets/busImages';
import generateBookingPDF from './BookingPDF';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const bookingData = location.state?.bookingData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [passengerDetails, setPassengerDetails] = useState([]);

  if (!bookingData) {
    navigate('/buses');
    return null;
  }

  // Initialize passenger details when component mounts
  React.useEffect(() => {
    if (bookingData.seatNumbers.length > 1) {
      // Initialize passenger details for each seat (excluding the first seat which is for the current user)
      const initialPassengerDetails = bookingData.seatNumbers.slice(1).map(seatNumber => ({
        seatNumber,
        name: '',
        age: '',
        phoneNumber: '',
        address: ''
      }));
      setPassengerDetails(initialPassengerDetails);
    }
  }, [bookingData.seatNumbers]);

  const handlePassengerDetailChange = (index, field, value) => {
    setPassengerDetails(prev => {
      const newDetails = [...prev];
      newDetails[index] = {
        ...newDetails[index],
        [field]: value
      };
      return newDetails;
    });
  };

  const validatePassengerDetails = () => {
    if (bookingData.seatNumbers.length <= 1) return true;
    
    return passengerDetails.every(detail => 
      detail.name.trim() !== '' &&
      detail.age.trim() !== '' &&
      detail.phoneNumber.trim() !== '' &&
      detail.address.trim() !== ''
    );
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    setError(null);

    try {
      if (bookingData.seatNumbers.length > 1 && !validatePassengerDetails()) {
        setError('Please fill in all passenger details');
        setLoading(false);
        return;
      }

      const createdBookings = [];

      // Create bookings for each selected seat
      for (let i = 0; i < bookingData.seatNumbers.length; i++) {
        const seatNumber = bookingData.seatNumbers[i];
        const bookingPayload = {
          userId: bookingData.userId,
          busId: bookingData.busId,
          bookingDate: bookingData.bookingDate,
          seatNumber: seatNumber,
          amount: bookingData.bus.price,
          status: 'CONFIRMED',
          // Include user and bus details for PDF generation
          user: {
            name: currentUser.name || currentUser.email
          },
          bus: {
            name: bookingData.bus.name,
            route: bookingData.bus.route
          }
        };

        // Add passenger details if it's not the first seat
        if (i > 0) {
          const passengerDetail = passengerDetails[i - 1];
          bookingPayload.user = {
            name: passengerDetail.name
          };
        }
        
        try {
          const response = await addBooking(bookingPayload);
          // Merge the response data with bus and user details for PDF
          const bookingWithDetails = {
            ...response.data,
            user: i > 0 ? { name: passengerDetails[i - 1].name } : { name: currentUser.name || currentUser.email },
            bus: {
              name: bookingData.bus.name,
              route: bookingData.bus.route
            }
          };
          createdBookings.push(bookingWithDetails);
        } catch (err) {
          console.error(`Error creating booking for seat ${seatNumber}:`, err);
          throw new Error(`Failed to book seat ${seatNumber}. Please try again.`);
        }
      }
      
      // Generate and download PDFs for each booking
      createdBookings.forEach(booking => {
        generateBookingPDF(booking);
      });

      // Show success popup
      setShowSuccess(true);
      
      // Navigate to bookings page after 2 seconds
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err.message || 'Failed to confirm payment. Please try again.');
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
              <span className="payment-label">Seat Numbers:</span>
              <span className="payment-value">{bookingData.seatNumbers.join(', ')}</span>
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

          {bookingData.seatNumbers.length > 1 && (
            <div className="passenger-details-section">
              <h3 className="section-title">Passenger Details</h3>
              <p className="section-subtitle">Please fill in details for additional passengers</p>
              
              {passengerDetails.map((detail, index) => (
                <div key={detail.seatNumber} className="passenger-form">
                  <h4 className="passenger-title">Passenger for Seat {detail.seatNumber}</h4>
                  <div className="passenger-form-grid">
                    <div className="form-group">
                      <label htmlFor={`name-${index}`}>Full Name</label>
                      <input
                        type="text"
                        id={`name-${index}`}
                        value={detail.name}
                        onChange={(e) => handlePassengerDetailChange(index, 'name', e.target.value)}
                        className="premium-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`age-${index}`}>Age</label>
                      <input
                        type="number"
                        id={`age-${index}`}
                        value={detail.age}
                        onChange={(e) => handlePassengerDetailChange(index, 'age', e.target.value)}
                        className="premium-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`phone-${index}`}>Phone Number</label>
                      <input
                        type="tel"
                        id={`phone-${index}`}
                        value={detail.phoneNumber}
                        onChange={(e) => handlePassengerDetailChange(index, 'phoneNumber', e.target.value)}
                        className="premium-input"
                        required
                      />
                    </div>
                    <div className="form-group full-width">
                      <label htmlFor={`address-${index}`}>Address</label>
                      <textarea
                        id={`address-${index}`}
                        value={detail.address}
                        onChange={(e) => handlePassengerDetailChange(index, 'address', e.target.value)}
                        className="premium-input"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

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