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
export const searchBuses = (params) => api.get('/bus/search', { params });
export const addBus = (busData) => api.post('/bus', busData);
export const deleteBus = (id) => api.delete(`/bus/${id}`);

// Booking endpoints
export const getBookings = () => api.get('/booking');
export const addBooking = (bookingData) => api.post('/booking', bookingData);
export const deleteBooking = (id) => api.delete(`/booking/${id}`);

// User endpoints
export const getUsers = () => api.get('/users');
export const addUser = (userData) => api.post('/users', userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Auth endpoints
export const login = (credentials) => api.post('/users/login', credentials);

export default api; 