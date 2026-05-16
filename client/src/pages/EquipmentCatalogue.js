import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTractor, FaSearch, FaFilter, FaStar, FaShoppingCart, FaRupeeSign } from 'react-icons/fa';
import equipmentService from '../services/equipmentService';
import './EquipmentCatalogue.css';

const EquipmentCatalogue = () => {
  const [equipment, setEquipment] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    sort: 'newest',
    page: 1,
    limit: 12
  });

  // Pagination
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    currentPage: 1
  });

  const [showFilters, setShowFilters] = useState(false);

  // Fetch equipment data
  useEffect(() => {
    fetchEquipment();
  }, [filters]);

  // Fetch categories and brands on mount
  useEffect(() => {
    fetchCategoriesAndBrands();
  }, []);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await equipmentService.getAllEquipment(filters);
      
      if (response.success) {
        setEquipment(response.data);
        setPagination({
          total: response.total,
          pages: response.pages,
          currentPage: response.page
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to load equipment');
      console.error('Error fetching equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesAndBrands = async () => {
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        equipmentService.getCategories(),
        equipmentService.getBrands()
      ]);
      
      if (categoriesRes.success) setCategories(categoriesRes.data);
      if (brandsRes.success) setBrands(brandsRes.data);
    } catch (err) {
      console.error('Error fetching filters:', err);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEquipment();
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      sort: 'newest',
      page: 1,
      limit: 12
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading && equipment.length === 0) {
    return (
      <div className="equipment-page">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading equipment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="equipment-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <FaTractor /> Equipment Catalogue
            </h1>
            <p className="page-subtitle">
              Browse our wide range of quality agriculture equipment
            </p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="search-filter-bar">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-input-group">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search equipment..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="search-input"
              />
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </div>
          </form>

          <button 
            className="btn btn-outline filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Filters
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filters-grid">
              <div className="filter-group">
                <label>Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
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

              <div className="filter-group">
                <label>Brand</label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Brands</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Min Price</label>
                <input
                  type="number"
                  placeholder="₹ Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label>Max Price</label>
                <input
                  type="number"
                  placeholder="₹ Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label>Sort By</label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="filter-select"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              <div className="filter-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            <div className="filter-actions">
              <button onClick={clearFilters} className="btn btn-outline">
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Results Info */}
        <div className="results-info">
          <p>
            Showing {equipment.length} of {pagination.total} equipment
            {filters.category && ` in ${filters.category}`}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Equipment Grid */}
        {equipment.length > 0 ? (
          <>
            <div className="equipment-grid">
              {equipment.map((item) => (
                <div key={item._id} className="equipment-card">
                  <div className="equipment-image">
                    {item.images && item.images.length > 0 ? (
                      <img src={item.images[0]} alt={item.name} />
                    ) : (
                      <div className="equipment-placeholder">
                        <FaTractor />
                      </div>
                    )}
                    {!item.inStock && (
                      <div className="out-of-stock-badge">Out of Stock</div>
                    )}
                  </div>

                  <div className="equipment-content">
                    <div className="equipment-category">{item.category}</div>
                    <h3 className="equipment-name">{item.name}</h3>
                    <p className="equipment-brand">{item.brand}</p>
                    
                    {item.averageRating > 0 && (
                      <div className="equipment-rating">
                        <FaStar className="star-icon" />
                        <span>{item.averageRating.toFixed(1)}</span>
                        <span className="rating-count">({item.totalReviews})</span>
                      </div>
                    )}

                    <div className="equipment-footer">
                      <div className="equipment-price">
                        <FaRupeeSign />
                        <span>{formatPrice(item.price)}</span>
                      </div>
                      
                      <Link 
                        to={`/equipment/${item._id}`} 
                        className="btn btn-primary btn-sm"
                      >
                        <FaShoppingCart /> View Details
                      </Link>
                    </div>

                    {item.emiAvailable && (
                      <div className="emi-badge">EMI Available</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="btn btn-outline"
                >
                  Previous
                </button>

                <div className="pagination-pages">
                  {[...Array(pagination.pages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`pagination-page ${
                        pagination.currentPage === index + 1 ? 'active' : ''
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.pages}
                  className="btn btn-outline"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <FaTractor className="empty-icon" />
            <h3>No equipment found</h3>
            <p>Try adjusting your filters or search terms</p>
            <button onClick={clearFilters} className="btn btn-primary">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentCatalogue;

// Made with Bob
