import React from 'react';

const SeatLayout = ({ 
  availableSeats, 
  selectedSeatNumber, 
  onSeatSelect, 
  selectedSeatType,
  totalSeats = 40 // Default to 40 seats (4 rows x 10 seats)
}) => {
  // Create an array of all seats based on the seats from backend
  const allSeats = availableSeats.map(seat => ({
    number: seat.seatNumber,
    isAvailable: seat.status === 'AVAILABLE',
    isSelected: seat.seatNumber === selectedSeatNumber,
    type: seat.seatType,
    status: seat.status
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

  return (
    <div className="seat-layout">
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
          <span>Priority</span>
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
                } ${seat.isAvailable && selectedSeatType === seat.type ? 'selectable' : ''}`}
                onClick={() => seat.isAvailable && selectedSeatType === seat.type && onSeatSelect(seat.number)}
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