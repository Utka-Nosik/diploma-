/**
 * ArtEX Frontend API Client
 * Clean, promise-based wrapper around backend REST endpoints.
 */

const API_BASE_URL = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
  ? `${window.location.origin}/api`
  : 'http://localhost:3000/api';

const api = {
  // --- Generic Request Helper ---
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('artex_token');

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      return data;
    } catch (err) {
      console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, err);
      throw err;
    }
  },

  // --- Auth ---
  auth: {
    login: (identifier, password) => 
      api.request('/auth/login', { method: 'POST', body: JSON.stringify({ identifier, password }) }),
    register: (userData) => 
      api.request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    getMe: () => 
      api.request('/auth/me')
  },

  // --- Users & Artists ---
  users: {
    getAll: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return api.request(`/users${qs ? '?' + qs : ''}`);
    },
    getById: (id) => 
      api.request(`/users/${id}`),
    update: (id, updates) => 
      api.request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(updates) })
  },

  // --- Artworks ---
  artworks: {
    getAll: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return api.request(`/artworks${qs ? '?' + qs : ''}`);
    },
    getById: (id) => 
      api.request(`/artworks/${id}`),
    create: (artworkData) => 
      api.request('/artworks', { method: 'POST', body: JSON.stringify(artworkData) }),
    like: (id) => 
      api.request(`/artworks/${id}/like`, { method: 'POST' })
  },

  // --- Commissions & Escrow Validator ---
  commissions: {
    getAll: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return api.request(`/commissions${qs ? '?' + qs : ''}`);
    },
    getById: (id) => 
      api.request(`/commissions/${id}`),
    create: (orderData) => 
      api.request('/commissions', { method: 'POST', body: JSON.stringify(orderData) }),
    updateStatus: (id, status, note) => 
      api.request(`/commissions/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, note }) }),
    submitDelivery: (id, previewUrl, comment) => 
      api.request(`/commissions/${id}/deliver`, { method: 'POST', body: JSON.stringify({ previewUrl, comment }) })
  },

  // --- Chats ---
  chats: {
    getAll: (userId) => 
      api.request(`/chats${userId ? '?userId=' + userId : ''}`),
    getById: (chatId) => 
      api.request(`/chats/${chatId}`),
    sendMessage: (chatId, messageData) => 
      api.request(`/chats/${chatId}/messages`, { method: 'POST', body: JSON.stringify(messageData) })
  }
};

// Expose globally for vanilla JS scripts
window.ArtEX_API = api;
