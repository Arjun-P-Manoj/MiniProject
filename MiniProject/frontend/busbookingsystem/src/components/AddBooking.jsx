import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { addBooking, getBuses, getUsers, getSeats, getSeatCounts } from '../services/api';
import { useAuth } from '../context/AuthContext';
import busImages from '../assets/busImages';
import SeatLayout from './SeatLayout';

const AddBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const queryParams = new URLSearchParams(location.search);
  const busIdFromUrl = queryParams.get('busId');
  
  const [formData, setFormData] = useState({
    userId: currentUser?.id || '',
    busId: busIdFromUrl || '',
    bookingDate: new Date().toISOString().slice(0, 16),
    seatNumbers: [],
    amount: '',
    status: 'PENDING'
  });
  const [buses, setBuses] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [busesResponse, usersResponse] = await Promise.all([
          getBuses(),
          getUsers()
        ]);
        setBuses(busesResponse.data);
        setUsers(usersResponse.data);
        
        // If busId was provided, find the selected bus to display info
        if (busIdFromUrl) {
          const bus = busesResponse.data.find(b => b.id === parseInt(busIdFromUrl));
          if (bus) {
            setSelectedBus(bus);
            // Pre-fill amount based on bus price
            setFormData(prev => ({
              ...prev,
              amount: bus.price
            }));
            
            // Fetch available seats and seat counts
            fetchSeatsForBus(parseInt(busIdFromUrl));
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load buses and users');
      }
    };
    fetchData();
  }, [busIdFromUrl]);

  const fetchSeatsForBus = async (busId) => {
    try {
      // Fetch all seats and seat counts for the selected bus
      const [seatsResponse, countsResponse] = await Promise.all([
        getSeats(busId),
        getSeatCounts(busId)
      ]);
      
      setAvailableSeats(seatsResponse.data);
    } catch (err) {
      console.error('Error fetching seats:', err);
      setError('Failed to load seat information');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // When bus selection changes, update seat information
    if (name === 'busId') {
      const busId = parseInt(value);
      const selectedBus = buses.find(bus => bus.id === busId);
      if (selectedBus) {
        setSelectedBus(selectedBus);
        setFormData(prev => ({
          ...prev,
          amount: selectedBus.price,
          seatNumbers: [] // Reset seat numbers when bus changes
        }));
        
        // Fetch available seats for the new bus
        fetchSeatsForBus(busId);
      }
    }
  };

  const handleSeatSelect = (seatNumber) => {
    setFormData(prev => {
      const newSeatNumbers = prev.seatNumbers.includes(seatNumber)
        ? prev.seatNumbers.filter(num => num !== seatNumber)
        : [...prev.seatNumbers, seatNumber];
      
      return {
        ...prev,
        seatNumbers: newSeatNumbers,
        amount: selectedBus ? selectedBus.price * newSeatNumbers.length : prev.amount
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (formData.seatNumbers.length === 0) {
        setError('Please select at least one seat');
        setLoading(false);
        return;
      }

      // Prepare booking data for each selected seat
      const bookingData = {
        userId: parseInt(formData.userId),
        busId: parseInt(formData.busId),
        bookingDate: formData.bookingDate,
        amount: formData.amount,
        status: 'PENDING',
        bus: selectedBus,
        seatNumbers: formData.seatNumbers
      };

      // Navigate directly to payment page
      navigate('/payment', { state: { bookingData } });

    } catch (err) {
      console.error('Error preparing booking:', err);
      setError('Failed to prepare booking');
      setLoading(false);
    }
  };

  // Get the appropriate bus image
  const busImage = selectedBus ? busImages.getBusImage(selectedBus) : busImages.default;

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Book Your Ticket</h1>
      </div>

      {error && (
        <div className="premium-alert premium-alert-error">
          <svg className="premium-alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {selectedBus && (
        <div className="bus-details-card">
          <div className="bus-details-card-header">
            <h2 className="premium-card-title">{selectedBus.name}</h2>
            <p className="text-sm text-gray-500">{selectedBus.route}</p>
          </div>
          
          <div className="bus-image-container">
            <img src={busImage} alt={selectedBus.name} className="bus-image" />
          </div>
          
          <div className="bus-details-card-body">
            <div className="bus-detail-row">
              <div className="bus-detail-label">Route:</div>
              <div className="bus-detail-value">{selectedBus.route}</div>
            </div>
            <div className="bus-detail-row">
              <div className="bus-detail-label">Departure:</div>
              <div className="bus-detail-value">{selectedBus.departureTime}</div>
            </div>
            <div className="bus-detail-row">
              <div className="bus-detail-label">Arrival:</div>
              <div className="bus-detail-value">{selectedBus.arrivalTime}</div>
            </div>
            <div className="bus-detail-row">
              <div className="bus-detail-label">Available Seats:</div>
              <div className="bus-detail-value">{selectedBus.availableSeats}</div>
            </div>
            <div className="bus-detail-row">
              <div className="bus-detail-label">Price per Seat:</div>
              <div className="bus-detail-value">₹{selectedBus.price}</div>
            </div>
          </div>
        </div>
      )}

      <div className="premium-card">
        <form onSubmit={handleSubmit}>
          {currentUser?.role === 'ADMIN' ? (
            <div className="premium-form-group">
              <label className="premium-label" htmlFor="userId">User</label>
              <select
                id="userId"
                name="userId"
                className="premium-select"
                value={formData.userId}
                onChange={handleChange}
                required
              >
                <option value="">Select User</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <input type="hidden" name="userId" value={formData.userId} />
          )}

          <div className="premium-form-group">
            <label className="premium-label" htmlFor="busId">Bus</label>
            <select
              id="busId"
              name="busId"
              className="premium-select"
              value={formData.busId}
              onChange={handleChange}
              required
              disabled={!!busIdFromUrl}
            >
              <option value="">Select Bus</option>
              {buses.map(bus => (
                <option key={bus.id} value={bus.id}>
                  {bus.name} ({bus.route})
                </option>
              ))}
            </select>
            {busIdFromUrl && (
              <p className="text-sm text-gray-500 mt-1">Bus is pre-selected from the bus list</p>
            )}
          </div>

          <div className="premium-form-group">
            <label className="premium-label" htmlFor="bookingDate">Booking Date</label>
            <input
              type="datetime-local"
              id="bookingDate"
              name="bookingDate"
              className="premium-input"
              value={formData.bookingDate}
              onChange={handleChange}
              required
            />
          </div>

          {selectedBus && (
            <div className="premium-form-group">
              <label className="premium-label">Select Seats</label>
              <SeatLayout
                availableSeats={availableSeats}
                selectedSeatNumbers={formData.seatNumbers}
                onSeatSelect={handleSeatSelect}
                totalSeats={selectedBus?.totalSeats || 40}
              />
              {formData.seatNumbers.length > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Selected {formData.seatNumbers.length} seat(s)
                </p>
              )}
            </div>
          )}

          <div className="premium-form-group">
            <label className="premium-label" htmlFor="amount">Total Amount (₹)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              className="premium-input"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              required
              readOnly={true}
            />
          </div>

          <input type="hidden" name="status" value={formData.status} />

          <div className="flex gap-4">
            <button
              type="button"
              className="premium-btn premium-btn-secondary"
              onClick={() => navigate('/buses')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="premium-btn premium-btn-primary"
              disabled={loading || formData.seatNumbers.length === 0}
            >
              {loading ? (
                <>
                  <div className="premium-spinner"></div>
                  Booking...
                </>
              ) : (
                'Book Ticket'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBooking; 