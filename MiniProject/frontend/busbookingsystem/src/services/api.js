import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for CORS with credentials
});

// Bus endpoints
export const getBuses = () => api.get('/bus');
export const getBusById = (busId) => api.get(`/bus/${busId}`);
export const searchBuses = (params) => api.get('/bus/search', { params });
export const addBus = (busData) => api.post('/bus', busData);
export const updateBus = (busId, busData) => api.put(`/bus/${busId}`, busData);
export const deleteBus = (busId) => api.delete(`/bus/${busId}`);

// Booking endpoints
export const getBookings = () => api.get('/booking');
export const getUserBookings = (userId) => api.get(`/booking/user/${userId}`);
export const addBooking = (bookingData) => api.post('/booking', bookingData);
export const deleteBooking = (id) => api.delete(`/booking/${id}`);
export const cancelBooking = (id) => api.put(`/booking/${id}/cancel`);

// User endpoints
export const getUsers = () => api.get('/users');
export const addUser = (userData) => api.post('/users', userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const getUserPriorityInfo = (userId) => api.get(`/users/${userId}/priority`);

// Auth endpoints
export const login = (credentials) => api.post('/users/login', credentials);

// Seat endpoints
export const getSeats = (busId) => api.get(`/seat/bus/${busId}`);
export const getAvailableSeats = (busId) => api.get(`/seat/bus/${busId}/available`);
export const getAvailableSeatsByType = (busId, seatType) => api.get(`/seat/bus/${busId}/available/${seatType}`);
export const getSeatCounts = (busId) => api.get(`/seat/bus/${busId}/count`);
export const updateSeatStatus = (seatId, status) => api.put(`/seat/${seatId}/status?status=${status}`);

export default api; 