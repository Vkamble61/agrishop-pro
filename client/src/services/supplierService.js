import api from './api';

const supplierService = {
  // Get all suppliers
  getAllSuppliers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.sort) params.append('sort', filters.sort);

      const response = await api.get(`/suppliers?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single supplier
  getSupplier: async (id) => {
    try {
      const response = await api.get(`/suppliers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create supplier
  createSupplier: async (supplierData) => {
    try {
      const response = await api.post('/suppliers', supplierData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update supplier
  updateSupplier: async (id, supplierData) => {
    try {
      const response = await api.put(`/suppliers/${id}`, supplierData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete supplier
  deleteSupplier: async (id) => {
    try {
      const response = await api.delete(`/suppliers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get supplier statistics
  getSupplierStats: async () => {
    try {
      const response = await api.get('/suppliers/stats/overview');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default supplierService;

// Made with Bob
