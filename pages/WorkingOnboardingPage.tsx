import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	getSectors,
	getBranches,
	getSpecializations,
	updateUserSpecialization
} from '../utils/api';
import { getCurrentUser } from '../utils/auth';
import type { Sector, Branch, Specialization } from '../src/types';

export default function WorkingOnboardingPage(): JSX.Element {
	const [currentStep, setCurrentStep] = useState<number>(1);
	const [selectedSector, setSelectedSector] = useState<string>('');
	const [selectedBranch, setSelectedBranch] = useState<string>('');
	const [selectedSpecialization, setSelectedSpecialization] =
		useState<string>('');
	const [sectors, setSectors] = useState<Sector[]>([]);
	const [branches, setBranches] = useState<Branch[]>([]);
	const [specializations, setSpecializations] = useState<Specialization[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>('');
	const navigate = useNavigate();

	// Simple emoji icons instead of lucide-react
	const sectorIcons: Record<string, string> = {
		Technology: '💻',
		Healthcare: '❤️',
		Finance: '💼',
		Education: '🎓',
		Retail: '🛒'
	};

	// Load sectors on component mount
	useEffect(() => {
		const loadSectors = async () => {
			try {
				setLoading(true);
				setError('');
				const sectorsData = await getSectors();
				console.log('Loaded sectors:', sectorsData);
				setSectors(sectorsData);
				if (sectorsData.length === 0) {
					setError(
						'No sectors found. Please check if the database has been populated.'
					);
				}
			} catch (err) {
				console.error('Failed to load sectors:', err);
				setError(
					'Failed to load sectors. Please check if the backend is running.'
				);
			} finally {
				setLoading(false);
			}
		};

		loadSectors();
	}, []);

	// Load branches when sector is selected
	useEffect(() => {
		const loadBranches = async () => {
			if (selectedSector) {
				try {
					setError('');
					setLoading(true);
					const branchesData = await getBranches(selectedSector);
					setBranches(branchesData);
				} catch (err) {
					console.error('Failed to load branches:', err);
					setError('Failed to load branches.');
					setBranches([]);
				} finally {
					setLoading(false);
				}
			}
		};

		loadBranches();
	}, [selectedSector]);

	// Load specializations when branch is selected
	useEffect(() => {
		const loadSpecializations = async () => {
			if (selectedBranch) {
				try {
					setError('');
					setLoading(true);
					const specsData = await getSpecializations(selectedBranch);
					setSpecializations(specsData);
				} catch (err) {
					console.error('Failed to load specializations:', err);
					setError('Failed to load specializations.');
					setSpecializations([]);
				} finally {
					setLoading(false);
				}
			}
		};

		loadSpecializations();
	}, [selectedBranch]);

	const handleSectorSelect = (sectorId: string | number): void => {
		setSelectedSector(String(sectorId));
		setSelectedBranch('');
		setSelectedSpecialization('');
		setCurrentStep(2);
	};

	const handleBranchSelect = (branchId: string | number): void => {
		setSelectedBranch(String(branchId));
		setSelectedSpecialization('');
		setCurrentStep(3);
	};

	const handleSpecializationSelect = (
		specializationId: string | number
	): void => {
		setSelectedSpecialization(String(specializationId));
	};

	const handleComplete = async () => {
		if (!selectedSpecialization) {
			setError('Please select a specialization');
			return;
		}

		try {
			setLoading(true);
			setError('');

			// Get current user and save specialization selection
			const currentUser = getCurrentUser();
			if (currentUser && currentUser.id) {
				try {
					const result = await updateUserSpecialization(
						currentUser.id,
						parseInt(selectedSpecialization)
					);
					if (result && result.success) {
						// Backend returns updated user object
						const userData = result.user || result;
						if (userData && userData.id) {
							// Map backend response to frontend format
							const updatedUser = {
								id: userData.id,
								email: userData.email,
								name: userData.name,
								specializationId: userData.specialization_id,
								specialization_id: userData.specialization_id,
								readinessScore: userData.readiness_score || 0,
								technicalScore: userData.technical_score || 0,
								softSkillsScore: userData.soft_skills_score || 0,
								leadershipScore: userData.leadership_score || 0,
								createdAt: userData.created_at
							};
							localStorage.setItem('currentUser', JSON.stringify(updatedUser));
							console.log(
								'User data updated from backend response:',
								updatedUser
							);
						} else {
							// Fallback: update localStorage with specializationId
							const updatedUser = {
								...currentUser,
								specializationId: parseInt(selectedSpecialization),
								specialization_id: parseInt(selectedSpecialization)
							};
							localStorage.setItem('currentUser', JSON.stringify(updatedUser));
						}
						console.log('Specialization saved successfully');
					} else {
						throw new Error(result?.error || 'Failed to save specialization');
					}
				} catch (saveError) {
					console.warn('Failed to save specialization to backend:', saveError);
					// Still continue - update localStorage anyway
					const updatedUser = {
						...currentUser,
						specializationId: parseInt(selectedSpecialization),
						specialization_id: parseInt(selectedSpecialization)
					};
					localStorage.setItem('currentUser', JSON.stringify(updatedUser));
				}
			}

			// Navigate to dashboard after saving
			navigate('/dashboard');
		} catch (err) {
			const error = err instanceof Error ? err : new Error('Unknown error');
			console.error('Failed to save specialization:', error);
			setError(
				error.message ||
					'Failed to save selections. You can continue to dashboard.'
			);
			setLoading(false);
			// Still allow navigation even if save fails
			setTimeout(() => navigate('/dashboard'), 2000);
		}
	};

	const handleBack = () => {
		if (currentStep === 3) {
			setCurrentStep(2);
			setSelectedSpecialization('');
			setSelectedBranch('');
		} else if (currentStep === 2) {
			setCurrentStep(1);
			setSelectedBranch('');
			setSelectedSector('');
		} else {
			navigate('/');
		}
	};

	if (loading) {
		return (
			<div
				style={{
					minHeight: '100vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: '#f8f9fa'
				}}>
				<div style={{ textAlign: 'center' }}>
					<div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
					<div>Loading sectors...</div>
				</div>
			</div>
		);
	}

	return (
		<div
			style={{
				minHeight: '100vh',
				backgroundColor: '#f8f9fa',
				padding: '2rem 1rem'
			}}>
			<div
				style={{
					maxWidth: '800px',
					margin: '0 auto',
					backgroundColor: 'white',
					borderRadius: '8px',
					padding: '3rem',
					boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
				}}>
				{/* Header */}
				<div style={{ textAlign: 'center', marginBottom: '3rem' }}>
					<h1
						style={{
							fontSize: '2.5rem',
							fontWeight: 'bold',
							color: '#1f2937',
							marginBottom: '1rem'
						}}>
						Welcome to Your Journey
					</h1>
					<p
						style={{
							fontSize: '1.125rem',
							color: '#6b7280'
						}}>
						{currentStep === 1
							? "Let's start by selecting your industry sector"
							: currentStep === 2
							? 'Now choose a branch within this sector'
							: 'Finally, select your specialization'}
					</p>
				</div>

				{/* Progress Indicator */}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						marginBottom: '3rem'
					}}>
					<div
						style={{
							width: '32px',
							height: '32px',
							borderRadius: '50%',
							backgroundColor: '#3b82f6',
							color: 'white',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontWeight: 'bold'
						}}>
						1
					</div>
					<div
						style={{
							width: '4rem',
							height: '2px',
							backgroundColor: currentStep === 2 ? '#3b82f6' : '#d1d5db',
							margin: '0 1rem'
						}}></div>
					<div
						style={{
							width: '32px',
							height: '32px',
							borderRadius: '50%',
							backgroundColor: currentStep >= 2 ? '#3b82f6' : '#d1d5db',
							color: 'white',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontWeight: 'bold'
						}}>
						2
					</div>
					<div
						style={{
							width: '4rem',
							height: '2px',
							backgroundColor: currentStep === 3 ? '#3b82f6' : '#d1d5db',
							margin: '0 1rem'
						}}></div>
					<div
						style={{
							width: '32px',
							height: '32px',
							borderRadius: '50%',
							backgroundColor: currentStep === 3 ? '#3b82f6' : '#d1d5db',
							color: 'white',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontWeight: 'bold'
						}}>
						3
					</div>
				</div>

				{/* Error Message */}
				{error && (
					<div
						style={{
							backgroundColor: '#fee2e2',
							border: '1px solid #fecaca',
							color: '#dc2626',
							padding: '1rem',
							borderRadius: '6px',
							marginBottom: '2rem'
						}}>
						{error}
					</div>
				)}

				{/* Step 1: Sector Selection */}
				{currentStep === 1 && (
					<div>
						<h2
							style={{
								fontSize: '1.5rem',
								fontWeight: '600',
								marginBottom: '2rem',
								color: '#1f2937'
							}}>
							Choose Your Industry Sector
						</h2>
						{loading ? (
							<div style={{ textAlign: 'center', padding: '2rem' }}>
								<div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
									⏳
								</div>
								<div>Loading sectors...</div>
							</div>
						) : error ? (
							<div
								style={{
									backgroundColor: '#fee2e2',
									border: '1px solid #fecaca',
									color: '#dc2626',
									padding: '1rem',
									borderRadius: '6px',
									marginBottom: '2rem'
								}}>
								{error}
							</div>
						) : sectors.length === 0 ? (
							<div
								style={{
									backgroundColor: '#fef3c7',
									border: '1px solid #fde68a',
									color: '#92400e',
									padding: '1rem',
									borderRadius: '6px',
									marginBottom: '2rem',
									textAlign: 'center'
								}}>
								No sectors available. Please check the database.
							</div>
						) : (
							<div
								style={{
									display: 'grid',
									gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
									gap: '1rem'
								}}>
								{sectors.map((sector) => (
									<button
										key={sector.id}
										onClick={() => handleSectorSelect(sector.id)}
										style={{
											padding: '2rem 1rem',
											border: '2px solid #e5e7eb',
											borderRadius: '8px',
											backgroundColor: 'white',
											cursor: 'pointer',
											textAlign: 'center',
											transition: 'all 0.2s',
											fontSize: '1rem'
										}}
										onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
											e.currentTarget.style.borderColor = '#3b82f6';
											e.currentTarget.style.backgroundColor = '#eff6ff';
										}}
										onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
											e.currentTarget.style.borderColor = '#e5e7eb';
											e.currentTarget.style.backgroundColor = 'white';
										}}>
										<div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
											{sectorIcons[sector.name as string] || '📂'}
										</div>
										<div style={{ fontWeight: '600', color: '#1f2937' }}>
											{sector.name}
										</div>
										<div
											style={{
												fontSize: '0.875rem',
												color: '#6b7280',
												marginTop: '0.5rem'
											}}>
											{sector.description}
										</div>
									</button>
								))}
							</div>
						)}
					</div>
				)}

				{/* Step 2: Branch Selection */}
				{currentStep === 2 && (
					<div>
						<h2
							style={{
								fontSize: '1.5rem',
								fontWeight: '600',
								marginBottom: '2rem',
								color: '#1f2937'
							}}>
							Choose Your Branch
						</h2>
						{loading ? (
							<div style={{ textAlign: 'center', padding: '2rem' }}>
								<div>Loading branches...</div>
							</div>
						) : (
							<div
								style={{
									display: 'grid',
									gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
									gap: '1rem'
								}}>
								{branches.map((branch) => (
									<button
										key={branch.id}
										onClick={() => handleBranchSelect(branch.id)}
										style={{
											padding: '1.5rem',
											border: '2px solid #e5e7eb',
											borderRadius: '8px',
											backgroundColor: 'white',
											cursor: 'pointer',
											textAlign: 'left',
											transition: 'all 0.2s'
										}}
										onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
											e.currentTarget.style.borderColor = '#3b82f6';
											e.currentTarget.style.backgroundColor = '#eff6ff';
										}}
										onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
											e.currentTarget.style.borderColor = '#e5e7eb';
											e.currentTarget.style.backgroundColor = 'white';
										}}>
										<div
											style={{
												fontWeight: '600',
												color: '#1f2937',
												marginBottom: '0.5rem'
											}}>
											{branch.name}
										</div>
										<div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
											{branch.description}
										</div>
									</button>
								))}
							</div>
						)}
					</div>
				)}

				{/* Step 3: Specialization Selection */}
				{currentStep === 3 && (
					<div>
						<h2
							style={{
								fontSize: '1.5rem',
								fontWeight: '600',
								marginBottom: '2rem',
								color: '#1f2937'
							}}>
							Choose Your Specialization
						</h2>
						{loading ? (
							<div style={{ textAlign: 'center', padding: '2rem' }}>
								<div>Loading specializations...</div>
							</div>
						) : (
							<div style={{ marginBottom: '2rem' }}>
								{specializations.map((spec) => (
									<label
										key={spec.id}
										style={{
											display: 'block',
											padding: '1rem',
											margin: '0.5rem 0',
											border: `2px solid ${
												selectedSpecialization === String(spec.id)
													? '#3b82f6'
													: '#e5e7eb'
											}`,
											borderRadius: '8px',
											backgroundColor:
												selectedSpecialization === String(spec.id)
													? '#eff6ff'
													: 'white',
											cursor: 'pointer',
											transition: 'all 0.2s'
										}}>
										<input
											type='radio'
											name='specialization'
											value={spec.id}
											checked={selectedSpecialization === String(spec.id)}
											onChange={(e) =>
												handleSpecializationSelect(e.target.value)
											}
											style={{ marginRight: '0.75rem' }}
										/>
										<span style={{ fontWeight: '600', color: '#1f2937' }}>
											{spec.name}
										</span>
										<div
											style={{
												fontSize: '0.875rem',
												color: '#6b7280',
												marginTop: '0.25rem',
												marginLeft: '1.5rem'
											}}>
											{spec.description}
										</div>
									</label>
								))}
							</div>
						)}
					</div>
				)}

				{/* Navigation Buttons */}
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						marginTop: '3rem'
					}}>
					<button
						onClick={handleBack}
						style={{
							padding: '0.75rem 1.5rem',
							border: '1px solid #d1d5db',
							borderRadius: '6px',
							backgroundColor: 'white',
							color: '#374151',
							cursor: 'pointer',
							display: 'flex',
							alignItems: 'center',
							gap: '0.5rem'
						}}>
						← Back
					</button>

					{currentStep === 3 && (
						<button
							onClick={handleComplete}
							disabled={!selectedSpecialization}
							style={{
								padding: '0.75rem 1.5rem',
								border: 'none',
								borderRadius: '6px',
								backgroundColor: selectedSpecialization ? '#3b82f6' : '#9ca3af',
								color: 'white',
								cursor: selectedSpecialization ? 'pointer' : 'not-allowed',
								display: 'flex',
								alignItems: 'center',
								gap: '0.5rem'
							}}>
							Complete →
						</button>
					)}
					{currentStep === 2 && (
						<button
							onClick={() => {
								const firstBranchId = branches[0]?.id;
								if (firstBranchId !== undefined) {
									handleBranchSelect(firstBranchId);
								}
							}}
							disabled={branches.length === 0}
							style={{
								padding: '0.75rem 1.5rem',
								border: 'none',
								borderRadius: '6px',
								backgroundColor: branches.length > 0 ? '#3b82f6' : '#9ca3af',
								color: 'white',
								cursor: branches.length > 0 ? 'pointer' : 'not-allowed',
								display: 'flex',
								alignItems: 'center',
								gap: '0.5rem'
							}}>
							Next →
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
