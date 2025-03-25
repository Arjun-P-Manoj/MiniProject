import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBusById, updateBus } from '../services/api';

const EditBus = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    route: '',
    departureDate: '',
    departureTime: '',
    arrivalTime: '',
    availableSeats: '',
    totalSeats: '',
    price: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to format date from dd-mm-yyyy to yyyy-mm-dd for input
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  };

  // Function to format date from yyyy-mm-dd to dd-mm-yyyy for backend
  const formatDateForBackend = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const response = await getBusById(id);
        setFormData({
          name: response.data.name,
          route: response.data.route,
          departureDate: response.data.departureDate,
          departureTime: response.data.departureTime,
          arrivalTime: response.data.arrivalTime,
          availableSeats: response.data.availableSeats,
          totalSeats: response.data.totalSeats,
          price: response.data.price
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bus:', err);
        setError('Failed to fetch bus details');
        setLoading(false);
      }
    };
    fetchBus();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'departureDate') {
      setFormData(prev => ({
        ...prev,
        [name]: formatDateForBackend(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const busData = {
        ...formData,
        availableSeats: parseInt(formData.availableSeats),
        totalSeats: parseInt(formData.totalSeats),
        price: parseFloat(formData.price)
      };
      
      await updateBus(id, busData);
      navigate('/buses');
    } catch (err) {
      console.error('Error updating bus:', err);
      setError('Failed to update bus');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading bus details...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Edit Bus</h1>
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
            <label className="form-label" htmlFor="departureDate">Departure Date</label>
            <input
              type="date"
              id="departureDate"
              name="departureDate"
              className="form-input"
              value={formData.departureDate ? formatDateForInput(formData.departureDate) : ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="departureTime">Departure Time</label>
            <input
              type="time"
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
              type="time"
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
                  Updating...
                </>
              ) : (
                'Update Bus'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBus; 