import React, { useState, useEffect } from 'react';
import { FaBox, FaPlus, FaEdit, FaTrash, FaSearch, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import equipmentService from '../services/equipmentService';
import './InventoryManagement.css';

const InventoryManagement = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    model: '',
    price: '',
    quantity: '',
    reorderLevel: '5',
    description: '',
    emiAvailable: true
  });

  useEffect(() => {
    fetchEquipment();
    fetchCategories();
  }, [filterCategory]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const filters = { limit: 100 };
      if (filterCategory) filters.category = filterCategory;
      
      const response = await equipmentService.getAllEquipment(filters);
      if (response.success) {
        setEquipment(response.data);
      }
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await equipmentService.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        await equipmentService.updateEquipment(editingItem._id, formData);
        alert('Equipment updated successfully!');
      } else {
        await equipmentService.createEquipment(formData);
        alert('Equipment added successfully!');
      }
      
      setShowModal(false);
      resetForm();
      fetchEquipment();
    } catch (error) {
      alert(error.message || 'Failed to save equipment');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      brand: item.brand,
      model: item.model || '',
      price: item.price,
      quantity: item.quantity,
      reorderLevel: item.reorderLevel,
      description: item.description,
      emiAvailable: item.emiAvailable
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        await equipmentService.deleteEquipment(id);
        alert('Equipment deleted successfully!');
        fetchEquipment();
      } catch (error) {
        alert(error.message || 'Failed to delete equipment');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      brand: '',
      model: '',
      price: '',
      quantity: '',
      reorderLevel: '5',
      description: '',
      emiAvailable: true
    });
    setEditingItem(null);
  };

  const filteredEquipment = equipment.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStockStatus = (item) => {
    if (item.quantity === 0) return { class: 'out-of-stock', text: 'Out of Stock' };
    if (item.quantity <= item.reorderLevel) return { class: 'low-stock', text: 'Low Stock' };
    return { class: 'in-stock', text: 'In Stock' };
  };

  return (
    <div className="inventory-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <FaBox /> Inventory Management
            </h1>
            <p className="page-subtitle">
              Manage your equipment inventory and stock levels
            </p>
          </div>
          <button 
            onClick={() => { resetForm(); setShowModal(true); }}
            className="btn btn-primary"
          >
            <FaPlus /> Add Equipment
          </button>
        </div>

        {/* Filters */}
        <div className="inventory-filters">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Inventory Table */}
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading inventory...</p>
          </div>
        ) : (
          <div className="inventory-table-container">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipment.map(item => {
                  const stockStatus = getStockStatus(item);
                  return (
                    <tr key={item._id}>
                      <td>
                        <div className="equipment-cell">
                          <strong>{item.name}</strong>
                          {item.model && <span className="model-text">{item.model}</span>}
                        </div>
                      </td>
                      <td>
                        <span className="category-badge">
                          {item.category}
                        </span>
                      </td>
                      <td>{item.brand}</td>
                      <td className="price-cell">{formatCurrency(item.price)}</td>
                      <td>
                        <div className="quantity-cell">
                          <span className="quantity-number">{item.quantity}</span>
                          {item.quantity <= item.reorderLevel && (
                            <FaExclamationTriangle className="warning-icon" />
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${stockStatus.class}`}>
                          {stockStatus.text}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleEdit(item)}
                            className="btn-icon btn-edit"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="btn-icon btn-delete"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredEquipment.length === 0 && (
              <div className="empty-state">
                <FaBox className="empty-icon" />
                <h3>No equipment found</h3>
                <p>Add equipment to get started</p>
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingItem ? 'Edit Equipment' : 'Add New Equipment'}</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Equipment Name *</label>
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
                    <label>Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="form-select"
                    >
                      <option value="">Select Category</option>
                      <option value="tractor">Tractor</option>
                      <option value="harvester">Harvester</option>
                      <option value="plough">Plough</option>
                      <option value="seeder">Seeder</option>
                      <option value="sprayer">Sprayer</option>
                      <option value="rotavator">Rotavator</option>
                      <option value="cultivator">Cultivator</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Brand *</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Model</label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Quantity *</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Reorder Level *</label>
                    <input
                      type="number"
                      name="reorderLevel"
                      value={formData.reorderLevel}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="form-textarea"
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="emiAvailable"
                      checked={formData.emiAvailable}
                      onChange={handleInputChange}
                    />
                    <span>EMI Available</span>
                  </label>
                </div>

                <div className="modal-actions">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <FaCheck /> {editingItem ? 'Update' : 'Add'} Equipment
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

export default InventoryManagement;

// Made with Bob
