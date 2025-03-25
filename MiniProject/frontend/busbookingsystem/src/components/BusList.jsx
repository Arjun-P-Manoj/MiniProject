import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
    departureDate: ''
  });
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Function to format date to dd-mm-yyyy
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      // If the date is already in dd-mm-yyyy format, return it as is
      if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
        return dateString;
      }
      // Otherwise, try to parse and format it
      const [day, month, year] = dateString.split('-');
      if (day && month && year) {
        return `${day}-${month}-${year}`;
      }
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '-');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Function to format time in 12-hour format
  const formatTime = (timeString) => {
    if (!timeString) return 'Not specified';
    try {
      // If time is in HH:mm format, convert to 12-hour format
      if (timeString.match(/^\d{2}:\d{2}$/)) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
      }
      // If time includes seconds, remove them
      if (timeString.match(/^\d{2}:\d{2}:\d{2}$/)) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
      }
      return timeString;
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeString;
    }
  };

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const response = await getBuses();
      console.log('Fetched buses:', response.data);
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
  }, [location.key]); // Refetch when navigation occurs

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      try {
        await deleteBus(id);
        await fetchBuses(); // Refetch the list after deletion
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
    if (name === 'departureDate') {
      // Convert the date to dd-mm-yyyy format for filtering
      if (!value) {
        setFilterCriteria(prev => ({
          ...prev,
          [name]: ''
        }));
        return;
      }
      const date = new Date(value);
      const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '-');
      setFilterCriteria(prev => ({
        ...prev,
        [name]: formattedDate
      }));
    } else {
      setFilterCriteria(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterCriteria({
      route: '',
      minPrice: '',
      maxPrice: '',
      departureDate: ''
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
    
    // Departure date filter
    const matchesDepartureDate = !filterCriteria.departureDate || 
      bus.departureDate === filterCriteria.departureDate;
    
    return matchesSearch && matchesRoute && matchesMinPrice && matchesMaxPrice && matchesDepartureDate;
  });

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Available Buses</h1>
        {currentUser?.role?.toLowerCase() === 'admin' && (
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
              <label className="premium-label">Departure Date</label>
              <input
                type="date"
                name="departureDate"
                value={filterCriteria.departureDate ? formatDateForInput(filterCriteria.departureDate) : ''}
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
                      <span className="bus-info-label">Departure Date:</span>
                      <span className="bus-info-value">{formatDate(bus.departureDate)}</span>
                    </div>
                    <div className="bus-info-item">
                      <span className="bus-info-label">Departure:</span>
                      <span className="bus-info-value">{formatTime(bus.departureTime)}</span>
                    </div>
                    <div className="bus-info-item">
                      <span className="bus-info-label">Arrival:</span>
                      <span className="bus-info-value">{formatTime(bus.arrivalTime)}</span>
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
                    
                    {currentUser?.role?.toLowerCase() === 'admin' && (
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

// Helper function to format date for input
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const [day, month, year] = dateString.split('-');
  return `${year}-${month}-${day}`;
};

export default BusList; 