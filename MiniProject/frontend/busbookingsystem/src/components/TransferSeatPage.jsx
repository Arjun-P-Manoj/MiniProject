import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserBookings, getAvailableBuses, getAvailableSeats, transferSeat } from '../services/api';
import { useAuth } from '../context/AuthContext';
import generateBookingPDF from './BookingPDF';
import '../styles/forms.css';

const TransferSeatPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [availableBuses, setAvailableBuses] = useState([]);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPriorityPopup, setShowPriorityPopup] = useState(false);
  const [prioritySeatInfo, setPrioritySeatInfo] = useState(null);
  const [transferConfirmed, setTransferConfirmed] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (!currentUser) {
        navigate('/login');
        return;
      }
      const response = await getUserBookings(currentUser.id);
      setConfirmedBookings(response.data.filter(booking => booking.status === 'CONFIRMED'));
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSelect = async (booking) => {
    setSelectedBooking(booking);
    setSelectedBus(null);
    setSelectedSeat(null);
    setAvailableSeats([]);
    try {
      if (!booking.id) {
        setError('Invalid booking data: Booking ID is missing');
        return;
      }
      const response = await getAvailableBuses();
      console.log('All Buses:', response.data);
      console.log('Selected Booking:', booking);
      const filteredBuses = response.data.filter(bus => {
        console.log('Checking bus:', bus);
        console.log('Bus route ID:', bus.route?.id);
        console.log('Booking route ID:', booking.bus?.route?.id);
        return bus.route?.id === booking.bus?.route?.id && 
               bus.id !== booking.bus?.id;
      });
      console.log('Filtered Buses:', filteredBuses);
      setAvailableBuses(filteredBuses);
    } catch (err) {
      console.error('Error fetching available buses:', err);
      setError('Failed to fetch available buses');
    }
  };

  const handleBusSelect = async (bus) => {
    setSelectedBus(bus);
    setSelectedSeat(null);
    try {
      if (!bus.id) {
        setError('Invalid bus data');
        return;
      }
      const response = await getAvailableSeats(bus.id);
      setAvailableSeats(response.data);
    } catch (err) {
      console.error('Error fetching available seats:', err);
      setError('Failed to fetch available seats');
    }
  };

  const handleSeatSelect = (seat) => {
    if (seat.status === 'BOOKED') return;

    if (seat.seatType !== 'REGULAR') {
      setPrioritySeatInfo({
        ...seat,
        message: seat.seatType === 'ELDERLY' 
          ? 'This is a priority seat reserved for elderly passengers. Please ensure you meet the eligibility criteria.'
          : seat.seatType === 'PREGNANT'
          ? 'This is a priority seat reserved for pregnant passengers. Please ensure you meet the eligibility criteria.'
          : 'This is a priority seat reserved for elderly passengers.Please ensure you meet the eligibility criteria.'
      });
      setShowPriorityPopup(true);
      return;
    }

    setSelectedSeat(seat);
  };

  const handlePrioritySeatConfirm = () => {
    // Find the complete seat object from availableSeats
    const completeSeat = availableSeats.find(seat => seat.id === prioritySeatInfo.id);
    if (completeSeat) {
      setSelectedSeat(completeSeat);
    }
    setShowPriorityPopup(false);
  };

  const handleTransfer = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!transferConfirmed) {
        setError('Please confirm the transfer by checking the checkbox');
        return;
      }

      // Validate that a new seat is selected
      if (!selectedSeat) {
        setError('Please select a new seat');
        return;
      }

      // Get the seat ID from the selected seat
      const newSeatId = selectedSeat.id;

      // Validate that we have all required data
      if (!selectedBooking || !selectedBus || !newSeatId) {
        setError('Please select a booking, bus, and new seat');
        return;
      }

      // Call the transfer API
      const response = await transferSeat(selectedBooking.id, selectedBus.id, newSeatId);

      // Create booking details object for PDF
      const bookingDetails = {
        id: response.data.id || selectedBooking.id,
        user: {
          name: currentUser.name || currentUser.email
        },
        bus: {
          name: selectedBus.name,
          route: selectedBus.route
        },
        seatNumber: selectedSeat.seatNumber,
        bookingDate: new Date().toISOString(),
        amount: selectedBus.price,
        status: 'CONFIRMED'
      };

      // Generate and download PDF
      generateBookingPDF(bookingDetails);

      // Show success message
      setShowSuccess(true);

      // Reset selections
      setSelectedBooking(null);
      setSelectedBus(null);
      setSelectedSeat(null);
      setTransferConfirmed(false);

      // Hide success message after 3 seconds and redirect
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/bookings');
      }, 3000);

    } catch (err) {
      console.error('Transfer error details:', err);
      setError(err.response?.data || 'Failed to transfer seat. Please try again.');
    } finally {
      setLoading(false);
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
      {showSuccess && (
        <div className="success-popup">
          <div className="success-icon">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="success-message">
            <h3>Success!</h3>
            <p>Seat transferred successfully</p>
          </div>
        </div>
      )}

      {showPriorityPopup && (
        <>
          <div className="priority-seat-popup-overlay" onClick={() => setShowPriorityPopup(false)} />
          <div className="priority-seat-popup">
            <div className="priority-icon">
              {prioritySeatInfo?.type === 'ELDERLY' ? (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <h3>Priority Seat Selected</h3>
            <p>{prioritySeatInfo?.message}</p>
            <button onClick={handlePrioritySeatConfirm}>Confirm Selection</button>
          </div>
        </>
      )}
      
      <div className="page-header">
        <h1 className="page-title">Transfer Seat</h1>
      </div>

      <div className="transfer-container">
        {/* Left side - Confirmed Bookings */}
        <div className="transfer-section">
          <h2>Your Confirmed Bookings</h2>
          <div className="booking-list">
            {confirmedBookings.map((booking) => (
              <div
                key={booking.id}
                className={`booking-card ${selectedBooking?.id === booking.id ? 'selected' : ''}`}
                onClick={() => handleBookingSelect(booking)}
              >
                <div className="booking-info">
                  <h3>Booking #{booking.id}</h3>
                  <p>Bus: {booking.bus?.name || 'N/A'}</p>
                  <p>Route: {booking.bus?.route || 'N/A'}</p>
                  <p>Date: {formatDate(booking.bookingDate)}</p>
                  <p>Seat: {booking.seatNumber}</p>
                  <p className="price">Current Price: ₹{booking.bus?.price || 0}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Available Buses and Seats */}
        <div className="transfer-section">
          <h2>Transfer Options</h2>
          {selectedBooking ? (
            <>
              {!selectedBus ? (
                <div className="bus-list">
                  {availableBuses.map((bus) => (
                    <div
                      key={bus.id}
                      className={`bus-card ${selectedBus?.id === bus.id ? 'selected' : ''}`}
                      onClick={() => handleBusSelect(bus)}
                    >
                      <div className="bus-info">
                        <h3>{bus.name}</h3>
                        <p>Route: {bus.route}</p>
                        <p>Departure: {formatDate(bus.departureDate)} {bus.departureTime}</p>
                        <p>Arrival: {bus.arrivalTime}</p>
                        <p className="price">Price: ₹{bus.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="seat-selection">
                    <h3>Select New Seat</h3>
                    {selectedBus && selectedBooking && (
                      <div className="price-comparison">
                        <div className="price-details">
                          <div className="price-item">
                            <span className="label">Current Bus Price:</span>
                            <span className="value">₹{selectedBooking.bus?.price || 0}</span>
                          </div>
                          <div className="price-item">
                            <span className="label">New Bus Price:</span>
                            <span className="value">₹{selectedBus.price}</span>
                          </div>
                          <div className="price-item difference">
                            <span className="label">Price Difference:</span>
                            <span className={`value ${selectedBus.price - selectedBooking.bus?.price >= 0 ? 'positive' : 'negative'}`}>
                              ₹{selectedBus.price - (selectedBooking.bus?.price || 0)}
                            </span>
                          </div>
                          {selectedBus.price - (selectedBooking.bus?.price || 0) > 0 && (
                            <div className="payment-info">
                              <p className="payment-message">
                                You need to pay ₹{selectedBus.price - (selectedBooking.bus?.price || 0)} to book and confirm seats
                              </p>
                              <div className="transfer-confirmation">
                                <label className="checkbox-label">
                                  <input
                                    type="checkbox"
                                    checked={transferConfirmed}
                                    onChange={(e) => setTransferConfirmed(e.target.checked)}
                                  />
                                  <span>I confirm that I will pay the additional amount</span>
                                </label>
                              </div>
                            </div>
                          )}
                          {selectedBus.price - (selectedBooking.bus?.price || 0) < 0 && (
                            <div className="refund-info">
                              <p className="refund-message">
                                The difference amount of ₹{Math.abs(selectedBus.price - (selectedBooking.bus?.price || 0))} will be added to your account within 5 working days
                              </p>
                              <div className="transfer-confirmation">
                                <label className="checkbox-label">
                                  <input
                                    type="checkbox"
                                    checked={transferConfirmed}
                                    onChange={(e) => setTransferConfirmed(e.target.checked)}
                                  />
                                  <span>I confirm the transfer and understand the refund process</span>
                                </label>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="seat-legend">
                      <div className="seat-legend-item">
                        <div className="seat-sample available"></div>
                        <span>Available</span>
                      </div>
                      <div className="seat-legend-item">
                        <div className="seat-sample selected"></div>
                        <span>Selected</span>
                      </div>
                      <div className="seat-legend-item">
                        <div className="seat-sample booked"></div>
                        <span>Booked</span>
                      </div>
                      <div className="seat-legend-item">
                        <div className="seat-sample priority"></div>
                        <span>Priority</span>
                      </div>
                    </div>
                  </div>
                  <div className="seat-grid">
                    {availableSeats.map((seat) => (
                      <div
                        key={seat.id}
                        className={`seat-card ${
                          selectedSeat?.id === seat.id ? 'selected' : 
                          seat.status === 'BOOKED' ? 'booked' :
                          seat.seatType !== 'REGULAR' ? 'priority' :
                          'available'
                        }`}
                        onClick={() => seat.status !== 'BOOKED' && handleSeatSelect(seat)}
                      >
                        {seat.seatNumber}
                      </div>
                    ))}
                  </div>
                  <div className="transfer-actions">
                    <button
                      className="premium-btn premium-btn-secondary"
                      onClick={() => {
                        setSelectedBus(null);
                        setSelectedSeat(null);
                        setAvailableSeats([]);
                      }}
                    >
                      Back to Buses
                    </button>
                    <button
                      className="premium-btn premium-btn-primary"
                      onClick={handleTransfer}
                      disabled={!selectedSeat || loading}
                    >
                      {loading ? (
                        <>
                          <div className="premium-spinner"></div>
                          Transferring...
                        </>
                      ) : (
                        'Transfer Seat'
                      )}
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="no-selection">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>Select a booking to view transfer options</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransferSeatPage; 