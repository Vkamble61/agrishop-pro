import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaSeedling, FaTractor } from 'react-icons/fa';
import './Auth.css';

const FarmerRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    village: '',
    district: '',
    state: '',
    farmSize: '',
    cropType: '',
    referredBy: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.village.trim()) {
      newErrors.village = 'Village is required';
    }

    if (!formData.district.trim()) {
      newErrors.district = 'District is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // API call will be implemented here
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock successful registration
      console.log('Registration data:', formData);
      
      // Redirect to login
      navigate('/farmer/login', { 
        state: { message: 'Registration successful! Please login.' }
      });
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <FaTractor className="auth-icon" />
              <h1 className="auth-title">Farmer Registration</h1>
              <p className="auth-subtitle">Join our trusted community of farmers</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Personal Information */}
              <div className="form-section">
                <h3 className="form-section-title">Personal Information</h3>
                
                <div className="form-group">
                  <label className="form-label">
                    <FaUser /> Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      <FaEnvelope /> Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FaPhone /> Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                      placeholder="10-digit mobile number"
                    />
                    {errors.phone && <span className="form-error">{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      <FaLock /> Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`form-input ${errors.password ? 'error' : ''}`}
                      placeholder="Minimum 6 characters"
                    />
                    {errors.password && <span className="form-error">{errors.password}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FaLock /> Confirm Password *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                      placeholder="Re-enter password"
                    />
                    {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="form-section">
                <h3 className="form-section-title">Location Information</h3>
                
                <div className="form-group">
                  <label className="form-label">
                    <FaMapMarkerAlt /> Village *
                  </label>
                  <input
                    type="text"
                    name="village"
                    value={formData.village}
                    onChange={handleChange}
                    className={`form-input ${errors.village ? 'error' : ''}`}
                    placeholder="Your village name"
                  />
                  {errors.village && <span className="form-error">{errors.village}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">District *</label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className={`form-input ${errors.district ? 'error' : ''}`}
                      placeholder="Your district"
                    />
                    {errors.district && <span className="form-error">{errors.district}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`form-input ${errors.state ? 'error' : ''}`}
                      placeholder="Your state"
                    />
                    {errors.state && <span className="form-error">{errors.state}</span>}
                  </div>
                </div>
              </div>

              {/* Farm Information */}
              <div className="form-section">
                <h3 className="form-section-title">Farm Information (Optional)</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      <FaSeedling /> Farm Size (in acres)
                    </label>
                    <input
                      type="number"
                      name="farmSize"
                      value={formData.farmSize}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g., 5"
                      min="0"
                      step="0.5"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Primary Crop Type</label>
                    <select
                      name="cropType"
                      value={formData.cropType}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select crop type</option>
                      <option value="wheat">Wheat</option>
                      <option value="rice">Rice</option>
                      <option value="cotton">Cotton</option>
                      <option value="sugarcane">Sugarcane</option>
                      <option value="vegetables">Vegetables</option>
                      <option value="fruits">Fruits</option>
                      <option value="pulses">Pulses</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Referred By (Optional)</label>
                  <input
                    type="text"
                    name="referredBy"
                    value={formData.referredBy}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Name of person who referred you"
                  />
                </div>
              </div>

              {errors.submit && (
                <div className="form-error-message">
                  {errors.submit}
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary btn-lg auth-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Registering...
                  </>
                ) : (
                  'Register'
                )}
              </button>

              <p className="auth-footer">
                Already have an account?{' '}
                <Link to="/farmer/login" className="auth-link">
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerRegister;

// Made with Bob
