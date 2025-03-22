import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addBus } from '../services/api';

const AddBus = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    route: '',
    departureTime: '',
    arrivalTime: '',
    availableSeats: '',
    totalSeats: '',
    price: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      // Convert string values to numbers where needed
      const busData = {
        ...formData,
        availableSeats: parseInt(formData.availableSeats),
        totalSeats: parseInt(formData.totalSeats),
        price: parseFloat(formData.price)
      };
      
      console.log('Sending bus data:', busData); // Log the data being sent
      await addBus(busData);
      navigate('/buses');
    } catch (err) {
      console.error('Error adding bus:', err);
      setError('Failed to add bus');
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Add New Bus</h1>
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
            <label className="form-label" htmlFor="name">Bus Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="route">Route</label>
            <input
              type="text"
              id="route"
              name="route"
              className="form-input"
              value={formData.route}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="departureTime">Departure Time</label>
            <input
              type="datetime-local"
              id="departureTime"
              name="departureTime"
              className="form-input"
              value={formData.departureTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="arrivalTime">Arrival Time</label>
            <input
              type="datetime-local"
              id="arrivalTime"
              name="arrivalTime"
              className="form-input"
              value={formData.arrivalTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="totalSeats">Total Seats</label>
            <input
              type="number"
              id="totalSeats"
              name="totalSeats"
              className="form-input"
              value={formData.totalSeats}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="availableSeats">Available Seats</label>
            <input
              type="number"
              id="availableSeats"
              name="availableSeats"
              className="form-input"
              value={formData.availableSeats}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              className="form-input"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

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
                  Adding...
                </>
              ) : (
                'Add Bus'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBus; 