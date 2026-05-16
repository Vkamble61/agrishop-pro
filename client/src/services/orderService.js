import api from './api';

const orderService = {
  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user's orders
  getMyOrders: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await api.get(`/orders/my-orders?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all orders (Admin only)
  getAllOrders: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.sort) params.append('sort', filters.sort);

      const response = await api.get(`/orders?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single order
  getOrder: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update order status (Admin only)
  updateOrderStatus: async (id, status, note) => {
    try {
      const response = await api.put(`/orders/${id}/status`, { status, note });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cancel order
  cancelOrder: async (id, reason) => {
    try {
      const response = await api.put(`/orders/${id}/cancel`, { reason });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get order statistics (Admin only)
  getOrderStats: async () => {
    try {
      const response = await api.get('/orders/stats/overview');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default orderService;

// Made with Bob
