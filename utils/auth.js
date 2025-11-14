// Authentication utilities with FastAPI backend integration
import { authAPI, testConnection } from './api.jsx';

// User data structure (for frontend use)
// Map backend snake_case to frontend camelCase
const createUser = (userData) => ({
  id: userData.id,
  email: userData.email,
  name: userData.name,
  readinessScore: userData.readiness_score || userData.readinessScore || 0,
  technicalScore: userData.technical_score || userData.technicalScore || 0,
  softSkillsScore: userData.soft_skills_score || userData.softSkillsScore || 0,
  leadershipScore: userData.leadership_score || userData.leadershipScore || 0,
  specializationId: userData.preferred_specialization_id || userData.specialization_id || userData.specializationId || null,
  createdAt: userData.created_at || userData.createdAt,
  completedTests: userData.completedTests || [],
  badges: userData.badges || [],
  recentActivity: userData.recentActivity || [],
  isActive: userData.is_active !== undefined ? userData.is_active : true
});

// Register a new user (parameters: name, email, password - matches AuthPage.jsx)
export const registerUser = async (name, email, password) => {
  try {
    // Test API connection first
    const connectionTest = await testConnection();
    if (!connectionTest.success) {
      throw new Error('Cannot connect to server. Please ensure the backend is running.');
    }

    // Register user with backend
    const userData = {
      name,
      email,
      password
    };
    
    const response = await authAPI.register(userData);
    
    if (response.success && response.user) {
      const user = createUser(response.user);
      // Set current user in localStorage for session management
      setCurrentUser(user);
      console.log('User registered successfully:', user);
      return { success: true, user };
    } else {
      throw new Error(response.detail || response.message || 'Registration failed');
    }
    
  } catch (error) {
    console.error('Registration error:', error);
    // Handle HTTP errors
    if (error.response) {
      return { success: false, error: error.response.data?.detail || error.message };
    }
    return { success: false, error: error.message || error.toString() };
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    // Test API connection first
    const connectionTest = await testConnection();
    if (!connectionTest.success) {
      throw new Error('Cannot connect to server. Please ensure the backend is running.');
    }

    // Login with backend
    const credentials = { email, password };
    const response = await authAPI.login(credentials);
    
    if (response.success && response.user) {
      const user = createUser(response.user);
      // Set current user in localStorage for session management
      setCurrentUser(user);
      console.log('User logged in successfully:', user);
      return { success: true, user };
    } else {
      throw new Error(response.detail || response.message || 'Login failed');
    }
    
  } catch (error) {
    console.error('Login error:', error);
    // Handle HTTP errors
    if (error.response) {
      return { success: false, error: error.response.data?.detail || error.message };
    }
    return { success: false, error: error.message || error.toString() };
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('currentUser');
};

// Get current user
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

// Set current user
export const setCurrentUser = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

// Check if user is logged in
export const isLoggedIn = () => {
  return getCurrentUser() !== null;
};

// Update user data (fallback to localStorage for now)
export const updateUser = (updatedUser) => {
  try {
    setCurrentUser(updatedUser);
    return { success: true, user: updatedUser };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update user's selected industry
export const updateUserIndustry = async (industry) => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, error: 'No user logged in' };
  }
  
  try {
    // Test API connection first
    const connectionTest = await testConnection();
    if (!connectionTest.success) {
      throw new Error('Cannot connect to server. Please ensure the backend is running.');
    }

    // Update industry with backend
    const industryData = { industry };
    const response = await authAPI.updateIndustry(currentUser.id, industryData);
    
    if (response.user) {
      const updatedUser = createUser(response.user);
      setCurrentUser(updatedUser);
      return { success: true, user: updatedUser };
    } else {
      throw new Error(response.message || 'Industry update failed');
    }
    
  } catch (error) {
    console.error('Industry update error:', error);
    // Fallback to local update if backend fails
    const updatedUser = { ...currentUser, industry };
    setCurrentUser(updatedUser);
    return { success: true, user: updatedUser, warning: 'Updated locally: ' + error.message };
  }
};

// Update user's scores
export const updateUserScores = (scores) => {
  const currentUser = getCurrentUser();
  if (currentUser) {
    const updatedUser = { ...currentUser, ...scores };
    return updateUser(updatedUser);
  }
  return { success: false, error: 'No user logged in' };
};

// Refresh user data from backend
export const refreshUserData = async (userId) => {
  try {
    const response = await fetch(`http://localhost:8000/api/users/${userId}`);
    if (response.ok) {
      const userData = await response.json();
      const user = createUser(userData);
      setCurrentUser(user);
      console.log('User data refreshed:', user);
      return { success: true, user };
    } else {
      throw new Error('Failed to refresh user data');
    }
  } catch (error) {
    console.error('Refresh error:', error);
    return { success: false, error: error.message };
  }
};
