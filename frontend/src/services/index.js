import api from './api';

export const authService = {
  // Register new merchant
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      localStorage.setItem('shop', JSON.stringify(response.data.data.shop));
    }
    return response.data;
  },

  // Login
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      localStorage.setItem('shop', JSON.stringify(response.data.data.shop));
    }
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('shop');
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update password
  updatePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/update-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  }
};

export const productService = {
  // Get all products
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/products?${params}`);
    return response.data;
  },

  // Get single product
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Create product
  create: async (data) => {
    const response = await api.post('/products', data);
    return response.data;
  },

  // Update product
  update: async (id, data) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  // Delete product
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get('/products/categories/list');
    return response.data;
  }
};

export const orderService = {
  // Get all orders
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/orders?${params}`);
    return response.data;
  },

  // Get single order
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Create order
  create: async (data) => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  // Update order status
  updateStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },

  // Delete order
  delete: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  }
};

export const customerService = {
  // Get all customers
  getAll: async (search = '') => {
    const response = await api.get(`/customers?search=${search}`);
    return response.data;
  },

  // Get single customer
  getById: async (id) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  // Create customer
  create: async (data) => {
    const response = await api.post('/customers', data);
    return response.data;
  },

  // Update customer
  update: async (id, data) => {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
  },

  // Delete customer
  delete: async (id) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  }
};

export const dashboardService = {
  // Get dashboard statistics
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  // Get recent orders
  getRecentOrders: async (limit = 5) => {
    const response = await api.get(`/dashboard/recent-orders?limit=${limit}`);
    return response.data;
  },

  // Get sales chart data
  getSalesChart: async (period = 'week') => {
    const response = await api.get(`/dashboard/sales-chart?period=${period}`);
    return response.data;
  },

  // Get top products
  getTopProducts: async (limit = 5) => {
    const response = await api.get(`/dashboard/top-products?limit=${limit}`);
    return response.data;
  }
};

export const shopService = {
  // Get shop info
  getInfo: async () => {
    const response = await api.get('/shop');
    return response.data;
  },

  // Update shop info
  updateInfo: async (data) => {
    const response = await api.put('/shop', data);
    return response.data;
  },

  // Update profile
  updateProfile: async (data) => {
    const response = await api.put('/shop/profile', data);
    return response.data;
  }
};

// AI Service
export const aiService = {
  // MunshiJi - Unified AI Business Advisor
  munshiJi: async (message, conversationHistory = []) => {
    const response = await api.post('/ai/munshiji', {
      message,
      conversationHistory
    });
    return response.data;
  },

  // Generate product description
  generateDescription: async (productName, category, price, features = []) => {
    const response = await api.post('/ai/generate-description', {
      productName,
      category,
      price,
      features
    });
    return response.data;
  },

  // Get business insights
  getBusinessInsights: async () => {
    const response = await api.get('/ai/business-insights');
    return response.data;
  },

  // Generate customer message
  generateMessage: async (customerName, messageType, context = {}) => {
    const response = await api.post('/ai/generate-message', {
      customerName,
      messageType,
      context
    });
    return response.data;
  },

  // Get sales analysis
  getSalesAnalysis: async () => {
    const response = await api.get('/ai/sales-analysis');
    return response.data;
  },

  // Get inventory advice
  getInventoryAdvice: async () => {
    const response = await api.get('/ai/inventory-advice');
    return response.data;
  },

  // Chat with AI
  chat: async (message, conversationHistory = []) => {
    const response = await api.post('/ai/chat', {
      message,
      conversationHistory
    });
    return response.data;
  },

  // Generate order report
  generateOrderReport: async (period = 'week') => {
    const response = await api.get(`/ai/order-report?period=${period}`);
    return response.data;
  }
};
