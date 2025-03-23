import React, { useState } from 'react';

const SeatLayout = ({ 
  availableSeats, 
  selectedSeatNumbers, 
  onSeatSelect, 
  totalSeats = 40 // Default to 40 seats (4 rows x 10 seats)
}) => {
  const [showPriorityPopup, setShowPriorityPopup] = useState(false);
  const [prioritySeatInfo, setPrioritySeatInfo] = useState(null);

  // Create an array of all seats based on the seats from backend
  const allSeats = availableSeats.map(seat => ({
    number: seat.seatNumber,
    isAvailable: seat.status === 'AVAILABLE',
    isSelected: selectedSeatNumbers.includes(seat.seatNumber),
    status: seat.status,
    type: seat.seatType // Keep the seat type for visual distinction
  }));

  // Sort seats by seat number to ensure proper ordering
  allSeats.sort((a, b) => {
    // Extract the numeric part from seat numbers (e.g., "R01" -> 1)
    const numA = parseInt(a.number.slice(1));
    const numB = parseInt(b.number.slice(1));
    return numA - numB;
  });

  // Group seats by row (4 seats per row)
  const rows = [];
  for (let i = 0; i < allSeats.length; i += 4) {
    rows.push(allSeats.slice(i, i + 4));
  }

  const handleSeatClick = (seat) => {
    if (!seat.isAvailable) return;

    if (seat.type !== 'REGULAR') {
      setPrioritySeatInfo({
        seatNumber: seat.number,
        type: seat.type,
        message: seat.type === 'ELDERLY' 
          ? 'This is a priority seat reserved for elderly passengers. Please ensure you meet the eligibility criteria.'
          : seat.type === 'PREGNANT'
          ? 'This is a priority seat reserved for pregnant passengers. Please ensure you meet the eligibility criteria.'
          : 'This is a priority seat reserved for elderly passengers.lease ensure you meet the eligibility criteria'
      });
      setShowPriorityPopup(true);
      return;
    }

    onSeatSelect(seat.number);
  };

  const handlePrioritySeatConfirm = () => {
    onSeatSelect(prioritySeatInfo.seatNumber);
    setShowPriorityPopup(false);
  };

  return (
    <div className="seat-layout">
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
          <div className="seat-sample occupied"></div>
          <span>Occupied</span>
        </div>
        <div className="seat-legend-item">
          <div className="seat-sample priority"></div>
          <span>Priority (Elder/Pregnant)</span>
        </div>
      </div>

      <div className="driver-seat">
        <div className="driver-icon">🚌</div>
        <span>Driver</span>
      </div>

      <div className="seats-container">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="seat-row">
            {row.map((seat) => (
              <div
                key={seat.number}
                className={`seat ${
                  seat.isSelected ? 'selected' :
                  seat.status === 'BOOKED' ? 'occupied' :
                  seat.type !== 'REGULAR' ? 'priority' :
                  'available'
                } ${seat.isAvailable ? 'selectable' : ''}`}
                onClick={() => handleSeatClick(seat)}
                title={`Seat ${seat.number} - ${seat.type} - ${seat.status}`}
              >
                {seat.number}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatLayout; 