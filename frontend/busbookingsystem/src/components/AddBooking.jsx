import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { addBooking, getBuses, getUsers, getAvailableSeats, getSeatCounts, getUserPriorityInfo } from '../services/api';
import { useAuth } from '../context/AuthContext';
import busImages from '../assets/busImages';

const AddBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const queryParams = new URLSearchParams(location.search);
  const busIdFromUrl = queryParams.get('busId');
  
  const [formData, setFormData] = useState({
    userId: currentUser?.id || '',
    busId: busIdFromUrl || '',
    bookingDate: new Date().toISOString().slice(0, 16), // Default to current date/time
    seatNumber: '',
    amount: '',
    status: 'PENDING'
  });
  const [buses, setBuses] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [seatCounts, setSeatCounts] = useState({ REGULAR: 0, ELDER: 0, PREGNANT: 0 });
  const [selectedSeatType, setSelectedSeatType] = useState('REGULAR');
  const [userPriority, setUserPriority] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [priorityMessage, setPriorityMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [busesResponse, usersResponse] = await Promise.all([
          getBuses(),
          getUsers()
        ]);
        setBuses(busesResponse.data);
        setUsers(usersResponse.data);
        
        // If the current user exists, fetch their priority information
        if (currentUser?.id) {
          fetchUserPriorityInfo(currentUser.id);
        }
        
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
  }, [busIdFromUrl, currentUser]);

  const fetchUserPriorityInfo = async (userId) => {
    try {
      const response = await getUserPriorityInfo(userId);
      const priorityInfo = response.data;
      setUserPriority(priorityInfo);
      
      // Automatically select the recommended seat type
      if (priorityInfo.recommendedSeatType) {
        setSelectedSeatType(priorityInfo.recommendedSeatType);
        
        // Set priority message based on eligibility
        if (priorityInfo.pregnantPriorityEligible) {
          setPriorityMessage('You are eligible for pregnant priority seating.');
        } else if (priorityInfo.elderlyPriorityEligible) {
          setPriorityMessage('You are eligible for elderly priority seating.');
        }
      }
    } catch (err) {
      console.error('Error fetching user priority info:', err);
    }
  };

  const fetchSeatsForBus = async (busId) => {
    try {
      // Fetch available seats and seat counts for the selected bus
      const [seatsResponse, countsResponse] = await Promise.all([
        getAvailableSeats(busId),
        getSeatCounts(busId)
      ]);
      
      setAvailableSeats(seatsResponse.data);
      setSeatCounts(countsResponse.data);
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
          seatNumber: '' // Reset seat number when bus changes
        }));
        
        // Fetch available seats for the new bus
        fetchSeatsForBus(busId);
      }
    }
    
    // When user selection changes (for admin)
    if (name === 'userId' && currentUser?.role === 'ADMIN') {
      const userId = parseInt(value);
      if (userId) {
        fetchUserPriorityInfo(userId);
      }
    }
  };

  const handleSeatTypeChange = (e) => {
    setSelectedSeatType(e.target.value);
    setFormData(prev => ({
      ...prev,
      seatNumber: '' // Reset seat number when seat type changes
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check if the user is eligible for the selected seat type
      if (selectedSeatType === 'PREGNANT' && userPriority && !userPriority.pregnantPriorityEligible) {
        setError('You are not eligible for pregnant priority seating. Please select a different seat type.');
        setLoading(false);
        return;
      }
      
      if (selectedSeatType === 'ELDER' && userPriority && !userPriority.elderlyPriorityEligible) {
        setError('You are not eligible for elderly priority seating. Please select a different seat type.');
        setLoading(false);
        return;
      }
      
      // Convert numeric fields to numbers
      const bookingData = {
        ...formData,
        userId: parseInt(formData.userId),
        busId: parseInt(formData.busId)
        // Keep seatNumber as a string since that's what the backend expects
        // amount is already a number since it's set from bus.price
      };
      
      console.log('Sending booking data:', bookingData);
      await addBooking(bookingData);
      navigate('/bookings');
    } catch (err) {
      console.error('Error adding booking:', err.response?.data || err.message);
      setError(err.response?.data || 'Failed to add booking');
      setLoading(false);
    }
  };

  // Filter seats based on selected seat type
  const filteredSeats = availableSeats.filter(seat => 
    seat.seatType === selectedSeatType && seat.status === 'AVAILABLE'
  );

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
      
      {priorityMessage && (
        <div className="premium-alert premium-alert-success">
          <svg className="premium-alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {priorityMessage}
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
              <div className="bus-detail-label">Price:</div>
              <div className="bus-detail-value">₹{selectedBus.price}</div>
            </div>
            
            {Object.keys(seatCounts).length > 0 && (
              <div className="seat-distribution">
                <div className="seat-distribution-title">Seat Distribution:</div>
                <div className="seat-list">
                  <div className="seat-type-item seat-type-regular">
                    Regular: {seatCounts.REGULAR || 0}
                  </div>
                  <div className="seat-type-item seat-type-elder">
                    Elder-Priority: {seatCounts.ELDER || 0}
                  </div>
                  <div className="seat-type-item seat-type-pregnant">
                    Pregnant-Priority: {seatCounts.PREGNANT || 0}
                  </div>
                </div>
              </div>
            )}
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
            >
              <option value="">Select Bus</option>
              {buses.map(bus => (
                <option key={bus.id} value={bus.id}>
                  {bus.name} ({bus.route})
                </option>
              ))}
            </select>
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

          {formData.busId && (
            <>
              <div className="premium-form-group">
                <label className="premium-label">Seat Type</label>
                <div className="premium-radio-group">
                  <label className={`premium-radio-label ${selectedSeatType === 'REGULAR' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="seatType"
                      value="REGULAR"
                      checked={selectedSeatType === 'REGULAR'}
                      onChange={handleSeatTypeChange}
                      className="mr-2"
                    />
                    Regular
                  </label>
                  <label className={`premium-radio-label ${selectedSeatType === 'ELDER' ? 'selected' : ''} ${userPriority && !userPriority.elderlyPriorityEligible ? 'disabled' : ''}`}>
                    <input
                      type="radio"
                      name="seatType"
                      value="ELDER"
                      checked={selectedSeatType === 'ELDER'}
                      onChange={handleSeatTypeChange}
                      className="mr-2"
                      disabled={userPriority && !userPriority.elderlyPriorityEligible && currentUser.role !== 'ADMIN'}
                    />
                    Elder Priority
                    {userPriority && !userPriority.elderlyPriorityEligible && (
                      <span className="text-xs text-red-500 ml-1">(Not eligible)</span>
                    )}
                  </label>
                  <label className={`premium-radio-label ${selectedSeatType === 'PREGNANT' ? 'selected' : ''} ${userPriority && !userPriority.pregnantPriorityEligible ? 'disabled' : ''}`}>
                    <input
                      type="radio"
                      name="seatType"
                      value="PREGNANT"
                      checked={selectedSeatType === 'PREGNANT'}
                      onChange={handleSeatTypeChange}
                      className="mr-2"
                      disabled={userPriority && !userPriority.pregnantPriorityEligible && currentUser.role !== 'ADMIN'}
                    />
                    Pregnant Priority
                    {userPriority && !userPriority.pregnantPriorityEligible && (
                      <span className="text-xs text-red-500 ml-1">(Not eligible)</span>
                    )}
                  </label>
                </div>
              </div>

              <div className="premium-form-group">
                <label className="premium-label" htmlFor="seatNumber">Select Seat</label>
                {filteredSeats.length > 0 ? (
                  <select
                    id="seatNumber"
                    name="seatNumber"
                    className="premium-select"
                    value={formData.seatNumber}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a seat</option>
                    {filteredSeats.map(seat => (
                      <option key={seat.id} value={seat.seatNumber}>
                        {seat.seatNumber}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-red-500">No {selectedSeatType.toLowerCase()} seats available</p>
                )}
              </div>
            </>
          )}

          <div className="premium-form-group">
            <label className="premium-label" htmlFor="amount">Amount (₹)</label>
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
              disabled={loading || !formData.seatNumber}
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