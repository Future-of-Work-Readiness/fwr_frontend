// API service for connecting to FastAPI backend

const API_BASE_URL = 'http://localhost:8000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Authentication API calls
export const authAPI = {
  register: async (userData) => {
    return apiRequest('/users/register', {
      method: 'POST',
      body: userData,
    });
  },

  login: async (credentials) => {
    return apiRequest('/users/login', {
      method: 'POST',
      body: credentials,
    });
  },

  getProfile: async (userId) => {
    return apiRequest(`/${userId}/profile`);
  },

  updateIndustry: async (userId, industryData) => {
    return apiRequest(`/${userId}/industry`, {
      method: 'PUT',
      body: industryData,
    });
  },
};

// Hierarchical API calls for Sectors → Branches → Specializations
export const getSectors = async () => {
  return apiRequest('/sectors');
};

export const getBranches = async (sectorId) => {
  return apiRequest(`/sectors/${sectorId}/branches`);
};

export const getSpecializations = async (branchId) => {
  return apiRequest(`/branches/${branchId}/specializations`);
};

// Save user's selections to database
export const updateUserSpecialization = async (userId, specializationId) => {
  return apiRequest(`/users/users/${userId}/specialization`, {
    method: 'PATCH',
    body: { specialization_id: specializationId },
  });
};

// Quiz API calls
export const quizAPI = {
  getAllQuizzes: async () => {
    return apiRequest('/quizzes');
  },

  getQuiz: async (quizId) => {
    return apiRequest(`/quizzes/${quizId}`);
  },

  submitQuizResults: async (userId, quizId, results) => {
    return apiRequest(`/quizzes/${quizId}/submit`, {
      method: 'POST',
      body: results,
    });
  },

  getUserQuizHistory: async (userId) => {
    throw new Error('Quiz history endpoint not implemented yet');
  },
};

// Test if API is connected
export const testConnection = async () => {
  try {
    const response = await fetch('http://localhost:8000/');
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default {
  authAPI,
  quizAPI,
  testConnection,
  getSectors,
  getBranches,
  getSpecializations,
  updateUserSpecialization,
};
