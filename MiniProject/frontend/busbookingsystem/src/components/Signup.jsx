import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { addUser } from '../services/api';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    role: 'USER', // Default role
    password: '',
    isPregnant: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert age to integer
      const userData = {
        ...formData,
        age: parseInt(formData.age),
        // Only include isPregnant if the user is female
        isPregnant: formData.gender === 'FEMALE' ? formData.isPregnant : false
      };
      
      await addUser(userData);
      navigate('/login');
    } catch (err) {
      console.error('Error during signup:', err);
      setError('Failed to register account. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '500px', margin: '2rem auto' }}>
        <div className="page-header" style={{ marginBottom: '2rem' }}>
          <h1 className="page-title">Create an Account</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Sign up to book bus tickets
          </p>
        </div>

        {error && (
          <div className="error-message">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              className="form-input"
              value={formData.age}
              onChange={handleChange}
              required
              placeholder="Enter your age"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              className="form-input"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {formData.gender === 'FEMALE' && (
            <div className="form-group">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPregnant"
                  name="isPregnant"
                  checked={formData.isPregnant}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="isPregnant" className="form-label">
                  I am pregnant (for priority seating)
                </label>
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                Creating Account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup; 