import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBuses, searchBuses } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BusList = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchParams, setSearchParams] = useState({
    name: '',
    route: ''
  });

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await getBuses();
      console.log('Buses data:', response.data);
      setBuses(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching buses:', err);
      setError('Failed to fetch buses');
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Always perform search even if fields are empty
      const params = { ...searchParams };
      
      const response = await searchBuses(params);
      setBuses(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error searching buses:', err);
      setError('Failed to search buses');
      setLoading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value
    });
  };

  const clearSearch = () => {
    setSearchParams({
      name: '',
      route: ''
    });
    fetchBuses();
  };

  const handleBookNow = (busId) => {
    navigate(`/bookings/add?busId=${busId}`);
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
      <div className="page-header">
        <h1 className="page-title">Available Buses</h1>
        {currentUser && currentUser.role === 'ADMIN' && (
          <button className="btn btn-primary" onClick={() => navigate('/buses/add')}>
            Add New Bus
          </button>
        )}
      </div>
      
      <div className="card mb-4">
        <h2 className="text-lg font-semibold mb-4">Search Buses</h2>
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="name">Bus Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                placeholder="e.g. Express Volvo"
                value={searchParams.name}
                onChange={handleSearchInputChange}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="route">Route</label>
              <input
                type="text"
                id="route"
                name="route"
                className="form-input"
                placeholder="e.g. Mumbai to Delhi"
                value={searchParams.route}
                onChange={handleSearchInputChange}
              />
            </div>
          </div>
          
          <div className="form-buttons">
            <button type="submit" className="btn btn-primary">
              Search
            </button>
            <button type="button" className="btn btn-secondary" onClick={clearSearch}>
              Clear
            </button>
          </div>
        </form>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Bus Name</th>
              <th>Route</th>
              <th>Departure Time</th>
              <th>Arrival Time</th>
              <th>Available Seats</th>
              <th>Total Seats</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.length > 0 ? (
              buses.map((bus) => (
                <tr key={bus.id}>
                  <td>{bus.name}</td>
                  <td>{bus.route}</td>
                  <td>{bus.departureTime}</td>
                  <td>{bus.arrivalTime}</td>
                  <td>{bus.availableSeats}</td>
                  <td>{bus.totalSeats}</td>
                  <td>₹{bus.price}</td>
                  <td>
                    {currentUser ? (
                      <button
                        className="btn btn-success"
                        onClick={() => handleBookNow(bus.id)}
                      >
                        Book Now
                      </button>
                    ) : (
                      <button
                        className="btn btn-success"
                        onClick={() => navigate('/login')}
                      >
                        Login to Book
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">No buses found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BusList; 