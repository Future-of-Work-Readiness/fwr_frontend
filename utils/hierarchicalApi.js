// Updated API functions for hierarchical structure
import { API_BASE_URL } from './api.jsx';

/**
 * Get complete hierarchy for all sectors
 * Returns: [{ id, name, description, branches: [{ id, name, description, specializations: [...] }] }]
 */
export const getCompleteHierarchy = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/hierarchy`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching complete hierarchy:', error);
    throw error;
  }
};

/**
 * Get all sectors (basic info only)
 * Returns: [{ id, name, description }]
 */
export const getSectors = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/sectors`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching sectors:', error);
    throw error;
  }
};

/**
 * Get branches for a specific sector
 * @param {number} sectorId 
 * Returns: [{ id, name, description, specializations: [...] }]
 */
export const getBranchesBySector = async (sectorId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sectors/${sectorId}/branches`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching branches:', error);
    throw error;
  }
};

/**
 * Get specializations for a specific branch
 * @param {number} branchId 
 * Returns: [{ id, name, description }]
 */
export const getSpecializationsByBranch = async (branchId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/branches/${branchId}/specializations`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching specializations:', error);
    throw error;
  }
};

/**
 * Get detailed information about a specific specialization
 * @param {number} specializationId 
 * Returns: { id, name, description, branch_id }
 */
export const getSpecializationDetails = async (specializationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/specializations/${specializationId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching specialization details:', error);
    throw error;
  }
};

/**
 * Get full hierarchy for a specific sector
 * @param {number} sectorId 
 * Returns: { id, name, description, branches: [{ id, name, description, specializations: [...] }] }
 */
export const getSectorHierarchy = async (sectorId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sectors/${sectorId}/hierarchy`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching sector hierarchy:', error);
    throw error;
  }
};

/**
 * Get detailed information about a specific branch
 * @param {number} branchId 
 * Returns: { id, name, description, sector_id }
 */
export const getBranchDetails = async (branchId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/branches/${branchId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching branch details:', error);
    throw error;
  }
};

// Maintain backward compatibility
export const getSectorsHierarchical = getCompleteHierarchy;
