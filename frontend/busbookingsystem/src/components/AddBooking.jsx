import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { addBooking, getBuses, getUsers } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AddBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const queryParams = new URLSearchParams(location.search);
  const busIdFromUrl = queryParams.get('busId');
  
  const [formData, setFormData] = useState({
    userId: currentUser?.id || '',
    busId: busIdFromUrl || '',
    bookingDate: '',
    seatNumber: '',
    amount: '',
    status: 'PENDING'
  });
  const [buses, setBuses] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
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
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load buses and users');
      }
    };
    fetchData();
  }, [busIdFromUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // When bus selection changes, update amount from bus price
    if (name === 'busId') {
      const selectedBus = buses.find(bus => bus.id === parseInt(value));
      if (selectedBus) {
        setFormData(prev => ({
          ...prev,
          amount: selectedBus.price
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert numeric fields to numbers
      const bookingData = {
        ...formData,
        userId: parseInt(formData.userId),
        busId: parseInt(formData.busId),
        seatNumber: parseInt(formData.seatNumber),
        amount: parseFloat(formData.amount)
      };
      
      console.log('Sending booking data:', bookingData); // Log the data being sent
      await addBooking(bookingData);
      navigate('/bookings');
    } catch (err) {
      console.error('Error adding booking:', err);
      setError('Failed to add booking');
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Book Your Ticket</h1>
      </div>

      {error && (
        <div className="error-message">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {selectedBus && (
        <div className="card mb-4">
          <h2 className="text-lg font-semibold mb-2">{selectedBus.name}</h2>
          <p className="text-sm mb-1"><strong>Route:</strong> {selectedBus.route}</p>
          <p className="text-sm mb-1"><strong>Departure:</strong> {selectedBus.departureTime}</p>
          <p className="text-sm mb-1"><strong>Arrival:</strong> {selectedBus.arrivalTime}</p>
          <p className="text-sm mb-1"><strong>Available Seats:</strong> {selectedBus.availableSeats}</p>
          <p className="text-sm"><strong>Price:</strong> ₹{selectedBus.price}</p>
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          {currentUser?.role === 'ADMIN' ? (
            <div className="form-group">
              <label className="form-label" htmlFor="userId">User</label>
              <select
                id="userId"
                name="userId"
                className="form-input"
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

          <div className="form-group">
            <label className="form-label" htmlFor="busId">Bus</label>
            <select
              id="busId"
              name="busId"
              className="form-input"
              value={formData.busId}
              onChange={handleChange}
              required
            >
              <option value="">Select Bus</option>
              {buses.map(bus => (
                <option key={bus.id} value={bus.id}>
                  {bus.name} ({bus.route})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="bookingDate">Booking Date</label>
            <input
              type="datetime-local"
              id="bookingDate"
              name="bookingDate"
              className="form-input"
              value={formData.bookingDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="seatNumber">Seat Number</label>
            <input
              type="number"
              id="seatNumber"
              name="seatNumber"
              className="form-input"
              value={formData.seatNumber}
              onChange={handleChange}
              required
              min="1"
              max={selectedBus ? selectedBus.availableSeats : 100}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="amount">Amount (₹)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              className="form-input"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              required
              readOnly={!currentUser?.role === 'ADMIN'}
            />
          </div>

          <input type="hidden" name="status" value={formData.status} />

          <div className="flex gap-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/buses')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
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