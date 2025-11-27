// Updated API functions for hierarchical structure
import { API_BASE_URL } from './api';
import type { Branch, Sector, Specialization } from '../src/types';

type BranchWithSpecializations = Branch & {
	specializations?: Specialization[];
};

export type SectorHierarchy = Sector & {
	branches?: BranchWithSpecializations[];
};

const fetchJson = async <T>(path: string): Promise<T> => {
	const response = await fetch(`${API_BASE_URL}${path}`);
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return (await response.json()) as T;
};

/**
 * Get complete hierarchy for all sectors
 * Returns: [{ id, name, description, branches: [{ id, name, description, specializations: [...] }] }]
 */
export const getCompleteHierarchy = async (): Promise<SectorHierarchy[]> => {
	try {
		return await fetchJson<SectorHierarchy[]>('/hierarchy');
	} catch (error) {
		console.error('Error fetching complete hierarchy:', error);
		throw error;
	}
};

/**
 * Get all sectors (basic info only)
 * Returns: [{ id, name, description }]
 */
export const getSectors = async (): Promise<Sector[]> => {
	try {
		return await fetchJson<Sector[]>('/sectors');
	} catch (error) {
		console.error('Error fetching sectors:', error);
		throw error;
	}
};

/**
 * Get branches for a specific sector
 * @param sectorId
 * Returns: [{ id, name, description, specializations: [...] }]
 */
export const getBranchesBySector = async (
	sectorId: string | number
): Promise<BranchWithSpecializations[]> => {
	try {
		return await fetchJson<BranchWithSpecializations[]>(
			`/sectors/${sectorId}/branches`
		);
	} catch (error) {
		console.error('Error fetching branches:', error);
		throw error;
	}
};

/**
 * Get specializations for a specific branch
 * @param branchId
 * Returns: [{ id, name, description }]
 */
export const getSpecializationsByBranch = async (
	branchId: string | number
): Promise<Specialization[]> => {
	try {
		return await fetchJson<Specialization[]>(
			`/branches/${branchId}/specializations`
		);
	} catch (error) {
		console.error('Error fetching specializations:', error);
		throw error;
	}
};

/**
 * Get detailed information about a specific specialization
 * @param specializationId
 * Returns: { id, name, description, branch_id }
 */
export const getSpecializationDetails = async (
	specializationId: string | number
): Promise<Specialization> => {
	try {
		return await fetchJson<Specialization>(
			`/specializations/${specializationId}`
		);
	} catch (error) {
		console.error('Error fetching specialization details:', error);
		throw error;
	}
};

/**
 * Get full hierarchy for a specific sector
 * @param sectorId
 * Returns: { id, name, description, branches: [{ id, name, description, specializations: [...] }] }
 */
export const getSectorHierarchy = async (
	sectorId: string | number
): Promise<SectorHierarchy> => {
	try {
		return await fetchJson<SectorHierarchy>(`/sectors/${sectorId}/hierarchy`);
	} catch (error) {
		console.error('Error fetching sector hierarchy:', error);
		throw error;
	}
};

/**
 * Get detailed information about a specific branch
 * @param branchId
 * Returns: { id, name, description, sector_id }
 */
export const getBranchDetails = async (
	branchId: string | number
): Promise<Branch> => {
	try {
		return await fetchJson<Branch>(`/branches/${branchId}`);
	} catch (error) {
		console.error('Error fetching branch details:', error);
		throw error;
	}
};

// Maintain backward compatibility
export const getSectorsHierarchical = getCompleteHierarchy;
