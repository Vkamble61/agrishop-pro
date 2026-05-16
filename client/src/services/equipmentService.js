import api from './api';

const equipmentService = {
  // Get all equipment with filters
  getAllEquipment: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.inStock) params.append('inStock', filters.inStock);
      if (filters.search) params.append('search', filters.search);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await api.get(`/equipment?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single equipment by ID
  getEquipment: async (id) => {
    try {
      const response = await api.get(`/equipment/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get equipment categories
  getCategories: async () => {
    try {
      const response = await api.get('/equipment/categories/list');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get equipment brands
  getBrands: async () => {
    try {
      const response = await api.get('/equipment/brands/list');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get featured equipment
  getFeaturedEquipment: async () => {
    try {
      const response = await api.get('/equipment/featured/list');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create equipment (Admin only)
  createEquipment: async (equipmentData) => {
    try {
      const response = await api.post('/equipment', equipmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update equipment (Admin only)
  updateEquipment: async (id, equipmentData) => {
    try {
      const response = await api.put(`/equipment/${id}`, equipmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete equipment (Admin only)
  deleteEquipment: async (id) => {
    try {
      const response = await api.delete(`/equipment/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default equipmentService;

// Made with Bob
