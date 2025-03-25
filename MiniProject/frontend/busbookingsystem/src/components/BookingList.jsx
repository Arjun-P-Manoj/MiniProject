import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookings, cancelBooking, getUserBookings, getBusById } from '../services/api';
import { useAuth } from '../context/AuthContext';
import busImages from '../assets/busImages';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

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
    fetchBookings();
  }, [currentUser]);

  const fetchBusData = async (busId) => {
    try {
      const response = await getBusById(busId);
      console.log(`Fetched bus data for ID ${busId}:`, response.data);
      return response.data;
    } catch (err) {
      console.error(`Error fetching bus data for ID ${busId}:`, err);
      return null;
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // If user is not admin, only fetch their own bookings
      const response = currentUser?.role === 'ADMIN' 
        ? await getBookings() 
        : await getUserBookings(currentUser.id);
      
      console.log('Raw response from API:', response);
      console.log('Received bookings data:', response.data);
      
      // Fetch bus data for each booking
      const bookingsWithBusData = await Promise.all(response.data.map(async (booking) => {
        if (booking.busId) {
          const busData = await fetchBusData(booking.busId);
          if (busData) {
            booking.bus = busData;
            console.log(`Added bus data to booking ${booking.id}:`, busData);
          } else {
            console.warn(`No bus data found for booking ${booking.id} with busId ${booking.busId}`);
            booking.bus = {
              id: booking.busId,
              name: `Bus #${booking.busId}`,
              route: 'Route information not available',
              departureTime: 'N/A',
              arrivalTime: 'N/A'
            };
          }
        }
        return booking;
      }));
      
      setBookings(bookingsWithBusData);
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

  const statusFilterButtons = [
    { label: 'All', value: 'all' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Cancelled', value: 'CANCELLED' }
  ];

  const handleFilterChange = (value) => {
    setStatusFilter(value);
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
            {statusFilterButtons.map((button) => (
              <button
                key={button.value}
                className={`status-filter-btn ${statusFilter === button.value ? 'active' : ''} status-filter-${button.value.toLowerCase()}`}
                onClick={() => handleFilterChange(button.value)}
              >
                {button.label}
              </button>
            ))}
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
            console.log('Rendering booking card:', {
              bookingId: booking.id,
              busData: booking.bus,
              hasBus: !!booking.bus,
              busId: booking.bus?.id,
              busName: booking.bus?.name,
              route: booking.bus?.route
            });
            
            // Get bus image based on bus data
            const busImage = booking.bus ? busImages.getBusImage(booking.bus) : busImages.default;
            
            return (
              <div key={booking.id} className="booking-card">
                <div className="booking-card-header">
                  <div className="booking-info">
                    <h2 className="booking-title">
                      {booking.bus?.name || `Bus #${booking.busId || 'N/A'}`}
                    </h2>
                    <p className="booking-route">
                      {booking.bus?.route || 'Route information not available'}
                    </p>
                  </div>
                  <div className={`status-badge ${getStatusClassName(booking.status)}`}>
                    {booking.status}
                  </div>
                </div>
                
                <div className="bus-image-container">
                  <img 
                    src={busImage} 
                    alt={booking.bus?.name || 'Bus'} 
                    className="bus-image" 
                  />
                </div>
                
                <div className="booking-card-content">
                  <div className="booking-details-grid">
                    <div className="booking-detail-item">
                      <span className="booking-detail-label">Booking ID</span>
                      <span className="booking-detail-value">#{booking.id}</span>
                    </div>
                    
                    <div className="booking-detail-item">
                      <span className="booking-detail-label">Bus ID</span>
                      <span className="booking-detail-value">
                        {booking.bus?.id ? `#${booking.bus.id}` : 'N/A'}
                      </span>
                    </div>
                    
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
                      <span className="booking-detail-label">Departure Date</span>
                      <span className="booking-detail-value">
                        {formatDate(booking.bus?.departureDate)}
                      </span>
                    </div>
                    
                    <div className="booking-detail-item">
                      <span className="booking-detail-label">Amount</span>
                      <span className="booking-detail-value price">₹{booking.amount}</span>
                    </div>
                    
                    {currentUser?.role === 'ADMIN' && (
                      <div className="booking-detail-item full-width">
                        <span className="booking-detail-label">Passenger</span>
                        <span className="booking-detail-value">
                          {booking.user?.name || 'User not available'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="booking-travel-info">
                    <div className="travel-time-container">
                      <div className="departure-info">
                        <span className="time-label">Departure</span>
                        <span className="time-value">
                          {booking.bus?.departureTime || 'N/A'}
                        </span>
                      </div>
                      <div className="travel-line">
                        <div className="dot start"></div>
                        <div className="line"></div>
                        <div className="dot end"></div>
                      </div>
                      <div className="arrival-info">
                        <span className="time-label">Arrival</span>
                        <span className="time-value">
                          {booking.bus?.arrivalTime || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
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