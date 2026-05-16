import React, { useState, useEffect } from 'react';
import { FaUsers, FaPlus, FaEdit, FaTrash, FaSearch, FaCheck, FaStar } from 'react-icons/fa';
import supplierService from '../services/supplierService';
import './SupplierManagement.css';

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    gstNumber: '',
    panNumber: '',
    categories: [],
    brands: [],
    paymentTerms: {
      creditDays: 30,
      advancePercentage: 0
    },
    bankDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      ifscCode: '',
      branch: ''
    },
    rating: 0,
    notes: '',
    isVerified: false
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await supplierService.getAllSuppliers({ limit: 100 });
      if (response.success) {
        setSuppliers(response.data);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'number' ? Number(value) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
      }));
    }
  };

  const handleArrayInput = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: array
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingSupplier) {
        await supplierService.updateSupplier(editingSupplier._id, formData);
        alert('Supplier updated successfully!');
      } else {
        await supplierService.createSupplier(formData);
        alert('Supplier added successfully!');
      }
      
      setShowModal(false);
      resetForm();
      fetchSuppliers();
    } catch (error) {
      alert(error.message || 'Failed to save supplier');
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      companyName: supplier.companyName,
      email: supplier.email,
      phone: supplier.phone,
      alternatePhone: supplier.alternatePhone || '',
      address: supplier.address || {
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
      },
      gstNumber: supplier.gstNumber || '',
      panNumber: supplier.panNumber || '',
      categories: supplier.categories || [],
      brands: supplier.brands || [],
      paymentTerms: supplier.paymentTerms || {
        creditDays: 30,
        advancePercentage: 0
      },
      bankDetails: supplier.bankDetails || {
        accountName: '',
        accountNumber: '',
        bankName: '',
        ifscCode: '',
        branch: ''
      },
      rating: supplier.rating || 0,
      notes: supplier.notes || '',
      isVerified: supplier.isVerified || false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await supplierService.deleteSupplier(id);
        alert('Supplier deleted successfully!');
        fetchSuppliers();
      } catch (error) {
        alert(error.message || 'Failed to delete supplier');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      companyName: '',
      email: '',
      phone: '',
      alternatePhone: '',
      address: {
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
      },
      gstNumber: '',
      panNumber: '',
      categories: [],
      brands: [],
      paymentTerms: {
        creditDays: 30,
        advancePercentage: 0
      },
      bankDetails: {
        accountName: '',
        accountNumber: '',
        bankName: '',
        ifscCode: '',
        branch: ''
      },
      rating: 0,
      notes: '',
      isVerified: false
    });
    setEditingSupplier(null);
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="supplier-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <FaUsers /> Supplier Management
            </h1>
            <p className="page-subtitle">
              Manage your supplier relationships and contacts
            </p>
          </div>
          <button 
            onClick={() => { resetForm(); setShowModal(true); }}
            className="btn btn-primary"
          >
            <FaPlus /> Add Supplier
          </button>
        </div>

        {/* Search */}
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Suppliers Grid */}
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading suppliers...</p>
          </div>
        ) : (
          <div className="suppliers-grid">
            {filteredSuppliers.map(supplier => (
              <div key={supplier._id} className="supplier-card">
                <div className="supplier-header">
                  <div>
                    <h3 className="supplier-name">{supplier.name}</h3>
                    <p className="supplier-company">{supplier.companyName}</p>
                  </div>
                  {supplier.isVerified && (
                    <span className="verified-badge">
                      <FaCheck /> Verified
                    </span>
                  )}
                </div>

                <div className="supplier-details">
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{supplier.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{supplier.phone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">
                      {supplier.address?.city}, {supplier.address?.state}
                    </span>
                  </div>
                  {supplier.categories && supplier.categories.length > 0 && (
                    <div className="detail-row">
                      <span className="detail-label">Categories:</span>
                      <div className="categories-list">
                        {supplier.categories.slice(0, 3).map((cat, idx) => (
                          <span key={idx} className="category-tag">{cat}</span>
                        ))}
                        {supplier.categories.length > 3 && (
                          <span className="category-tag">+{supplier.categories.length - 3}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="supplier-stats">
                  <div className="stat-item">
                    <span className="stat-label">Total Purchases</span>
                    <span className="stat-value">{supplier.totalPurchases || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Amount</span>
                    <span className="stat-value">{formatCurrency(supplier.totalAmount || 0)}</span>
                  </div>
                  {supplier.rating > 0 && (
                    <div className="stat-item">
                      <span className="stat-label">Rating</span>
                      <span className="stat-value">
                        <FaStar className="star-icon" /> {supplier.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="supplier-actions">
                  <button
                    onClick={() => handleEdit(supplier)}
                    className="btn btn-outline btn-sm"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(supplier._id)}
                    className="btn btn-danger btn-sm"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredSuppliers.length === 0 && !loading && (
          <div className="empty-state">
            <FaUsers className="empty-icon" />
            <h3>No suppliers found</h3>
            <p>Add suppliers to get started</p>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                {/* Basic Information */}
                <h3 className="form-section-title">Basic Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Contact Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Company Name *</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      pattern="[0-9]{10}"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Alternate Phone</label>
                    <input
                      type="tel"
                      name="alternatePhone"
                      value={formData.alternatePhone}
                      onChange={handleInputChange}
                      pattern="[0-9]{10}"
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Address */}
                <h3 className="form-section-title">Address</h3>
                <div className="form-group">
                  <label>Street</label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Pincode *</label>
                    <input
                      type="text"
                      name="address.pincode"
                      value={formData.address.pincode}
                      onChange={handleInputChange}
                      required
                      pattern="[0-9]{6}"
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Business Details */}
                <h3 className="form-section-title">Business Details</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>GST Number</label>
                    <input
                      type="text"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>PAN Number</label>
                    <input
                      type="text"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Categories (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.categories.join(', ')}
                      onChange={(e) => handleArrayInput('categories', e.target.value)}
                      placeholder="tractor, harvester, plough"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Brands (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.brands.join(', ')}
                      onChange={(e) => handleArrayInput('brands', e.target.value)}
                      placeholder="Mahindra, John Deere"
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Payment Terms */}
                <h3 className="form-section-title">Payment Terms</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Credit Days</label>
                    <input
                      type="number"
                      name="paymentTerms.creditDays"
                      value={formData.paymentTerms.creditDays}
                      onChange={handleInputChange}
                      min="0"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Advance Percentage (%)</label>
                    <input
                      type="number"
                      name="paymentTerms.advancePercentage"
                      value={formData.paymentTerms.advancePercentage}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Rating (0-5)</label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      min="0"
                      max="5"
                      step="0.1"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="form-textarea"
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isVerified"
                      checked={formData.isVerified}
                      onChange={handleInputChange}
                    />
                    <span>Verified Supplier</span>
                  </label>
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <FaCheck /> {editingSupplier ? 'Update' : 'Add'} Supplier
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierManagement;

// Made with Bob
