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

return (
  <div className="container">
    <div className="page-header">
      <h1 className="page-title">Transfer Seat</h1>
      <button 
        className="premium-btn premium-btn-secondary"
        onClick={() => navigate('/bookings')}
      >
        Back to Bookings
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

    {loading ? (
      <div className="loading-container">
        <div className="loading-spinner-large"></div>
        <p>Loading available buses...</p>
      </div>
    ) : availableBuses.length > 0 ? (
      <div className="transfer-options">
        <div className="transfer-info">
          <h2>Current Booking</h2>
          <div className="current-booking-details">
            <p><strong>Bus:</strong> {currentBooking.bus?.name || 'N/A'}</p>
            <p><strong>Route:</strong> {currentBooking.bus?.route || 'N/A'}</p>
            <p><strong>Current Seat:</strong> {currentBooking.seatNumber}</p>
            <p><strong>Departure Date:</strong> {formatDate(currentBooking.bus?.departureDate)}</p>
          </div>
        </div>

        <div className="available-buses">
          <h2>Available Buses</h2>
          <div className="bus-grid">
            {availableBuses.map(bus => (
              <div key={bus.id} className="bus-card">
                <div className="bus-card-header">
                  <h3>{bus.name}</h3>
                  <span className="bus-route">{bus.route}</span>
                </div>
                
                <div className="bus-details">
                  <div className="detail-item">
                    <span className="detail-label">Departure Date</span>
                    <span className="detail-value">{formatDate(bus.departureDate)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Departure Time</span>
                    <span className="detail-value">{bus.departureTime}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Arrival Time</span>
                    <span className="detail-value">{bus.arrivalTime}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Available Seats</span>
                    <span className="detail-value">{bus.availableSeats}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Price</span>
                    <span className="detail-value price">₹{bus.price}</span>
                  </div>
                </div>

                <div className="bus-card-actions">
                  <button
                    className="premium-btn premium-btn-primary"
                    onClick={() => handleTransfer(bus.id)}
                  >
                    Transfer to this Bus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ) : (
      <div className="no-results">
        <svg className="no-results-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p>No available buses found for transfer.</p>
        <button 
          className="premium-btn premium-btn-secondary"
          onClick={() => navigate('/bookings')}
        >
          Back to Bookings
        </button>
      </div>
    )}
  </div>
); 