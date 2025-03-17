import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addBooking, getBuses, getUsers } from '../services/api';

const AddBooking = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    busId: '',
    bookingDate: '',
    seatNumber: '',
    amount: '',
    status: 'PENDING'
  });
  const [buses, setBuses] = useState([]);
  const [users, setUsers] = useState([]);
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
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load buses and users');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
        <h1 className="page-title">Add New Booking</h1>
      </div>

      {error && (
        <div className="error-message">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
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
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              className="form-input"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              className="form-input"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/bookings')}
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
                  Adding...
                </>
              ) : (
                'Add Booking'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBooking; 