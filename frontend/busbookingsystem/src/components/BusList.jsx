import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getBuses, deleteBus } from '../services/api';
import { useAuth } from '../context/AuthContext';
import busImages from '../assets/busImages';

const BusList = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCriteria, setFilterCriteria] = useState({
    route: '',
    minPrice: '',
    maxPrice: '',
  });
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const response = await getBuses();
      setBuses(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch buses. Please try again.');
      console.error('Error fetching buses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      try {
        await deleteBus(id);
        setBuses(buses.filter(bus => bus.id !== id));
      } catch (err) {
        setError('Failed to delete bus. Please try again.');
        console.error('Error deleting bus:', err);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterCriteria({
      ...filterCriteria,
      [name]: value,
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterCriteria({
      route: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  // Filter buses based on search and filter criteria
  const filteredBuses = buses.filter(bus => {
    // Search filter (case insensitive)
    const matchesSearch = 
      bus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.route.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Route filter
    const matchesRoute = !filterCriteria.route || 
      bus.route.toLowerCase().includes(filterCriteria.route.toLowerCase());
    
    // Price range filter
    const matchesMinPrice = !filterCriteria.minPrice || 
      bus.price >= Number(filterCriteria.minPrice);
    
    const matchesMaxPrice = !filterCriteria.maxPrice || 
      bus.price <= Number(filterCriteria.maxPrice);
    
    return matchesSearch && matchesRoute && matchesMinPrice && matchesMaxPrice;
  });

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Available Buses</h1>
        {currentUser?.role === 'ADMIN' && (
          <Link to="/buses/add" className="premium-btn premium-btn-primary">
            Add New Bus
          </Link>
        )}
      </div>

      {error && (
        <div className="premium-alert premium-alert-error">
          <svg className="premium-alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <div className="premium-card search-filter-container">
        <div className="premium-form-group">
          <label className="premium-label">Search Buses</label>
          <input
            type="text"
            placeholder="Search by bus name or route"
            value={searchTerm}
            onChange={handleSearchChange}
            className="premium-input"
          />
        </div>
        
        <div className="filters-section">
          <h3 className="filter-title">Filters</h3>
          <div className="filters-grid">
            <div className="premium-form-group">
              <label className="premium-label">Route</label>
              <input
                type="text"
                name="route"
                placeholder="Filter by route"
                value={filterCriteria.route}
                onChange={handleFilterChange}
                className="premium-input"
              />
            </div>
            <div className="premium-form-group">
              <label className="premium-label">Min Price (₹)</label>
              <input
                type="number"
                name="minPrice"
                placeholder="Min price"
                value={filterCriteria.minPrice}
                onChange={handleFilterChange}
                className="premium-input"
              />
            </div>
            <div className="premium-form-group">
              <label className="premium-label">Max Price (₹)</label>
              <input
                type="number"
                name="maxPrice"
                placeholder="Max price"
                value={filterCriteria.maxPrice}
                onChange={handleFilterChange}
                className="premium-input"
              />
            </div>
          </div>
          
          <button 
            onClick={resetFilters} 
            className="premium-btn premium-btn-secondary"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner-large"></div>
          <p>Loading buses...</p>
        </div>
      ) : filteredBuses.length > 0 ? (
        <div className="bus-grid">
          {filteredBuses.map(bus => {
            const busImage = busImages.getBusImage(bus);
            return (
              <div key={bus.id} className="bus-card">
                <div className="bus-image-container">
                  <img src={busImage} alt={bus.name} className="bus-image" />
                </div>
                <div className="bus-card-content">
                  <h2 className="bus-card-title">{bus.name}</h2>
                  <p className="bus-route">{bus.route}</p>
                  
                  <div className="bus-info-grid">
                    <div className="bus-info-item">
                      <span className="bus-info-label">Departure:</span>
                      <span className="bus-info-value">{bus.departureTime}</span>
                    </div>
                    <div className="bus-info-item">
                      <span className="bus-info-label">Arrival:</span>
                      <span className="bus-info-value">{bus.arrivalTime}</span>
                    </div>
                    <div className="bus-info-item">
                      <span className="bus-info-label">Seats:</span>
                      <span className="bus-info-value">{bus.availableSeats} available</span>
                    </div>
                    <div className="bus-info-item">
                      <span className="bus-info-label">Price:</span>
                      <span className="bus-info-value price">₹{bus.price}</span>
                    </div>
                  </div>
                  
                  <div className="bus-card-actions">
                    <button 
                      className="premium-btn premium-btn-primary"
                      onClick={() => navigate(`/bookings/add?busId=${bus.id}`)}
                    >
                      Book Now
                    </button>
                    
                    {currentUser?.role === 'ADMIN' && (
                      <div className="admin-actions">
                        <Link to={`/buses/edit/${bus.id}`} className="premium-btn premium-btn-secondary">
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(bus.id)} 
                          className="premium-btn premium-btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-results">
          <svg className="no-results-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="no-results-text">No buses found matching your criteria.</p>
          <button onClick={resetFilters} className="premium-btn premium-btn-primary">
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default BusList; 