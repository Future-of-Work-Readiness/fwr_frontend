import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSectorsHierarchical } from '../utils/hierarchicalApi';
import {
	colors,
	buttonStyles,
	cardStyles,
	SkeletonLoader
} from '../utils/designSystem';
import type { Sector, Branch, Specialization } from '../src/types';

interface HierarchicalSector extends Sector {
	branches?: HierarchicalBranch[];
}

interface HierarchicalBranch extends Branch {
	specializations?: Specialization[];
}

export default function HierarchicalOnboardingPage(): JSX.Element {
	const navigate = useNavigate();
	const [currentStep, setCurrentStep] = useState<number>(1); // 1: Sector, 2: Branch, 3: Specialization
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>('');

	// Data
	const [sectors, setSectors] = useState<HierarchicalSector[]>([]);

	// Selections
	const [selectedSector, setSelectedSector] = useState<string>('');
	const [selectedBranch, setSelectedBranch] = useState<string>('');
	const [selectedSpecialization, setSelectedSpecialization] =
		useState<string>('');

	// Derived data
	const [availableBranches, setAvailableBranches] = useState<
		HierarchicalBranch[]
	>([]);
	const [availableSpecializations, setAvailableSpecializations] = useState<
		Specialization[]
	>([]);

	useEffect(() => {
		loadSectors();
	}, []);

	const loadSectors = async (): Promise<void> => {
		try {
			setLoading(true);
			const sectorsData = await getSectorsHierarchical();
			setSectors(sectorsData as HierarchicalSector[]);
			setError('');
		} catch (error) {
			setError('Failed to load sectors');
			console.error('Error loading sectors:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleSectorSelection = (sectorId: string | number): void => {
		setSelectedSector(String(sectorId));

		// Find the selected sector and get its branches
		const sector = sectors.find((s) => s.id === parseInt(String(sectorId)));
		if (sector && sector.branches) {
			setAvailableBranches(sector.branches);
			setAvailableSpecializations([]);
			setSelectedBranch('');
			setSelectedSpecialization('');
		}
	};

	const handleBranchSelection = (branchId: string | number): void => {
		setSelectedBranch(String(branchId));

		// Find the selected branch and get its specializations
		const branch = availableBranches.find(
			(b) => b.id === parseInt(String(branchId))
		);
		if (branch && branch.specializations) {
			setAvailableSpecializations(branch.specializations);
			setSelectedSpecialization('');
		}
	};

	const handleNext = (): void => {
		if (currentStep === 1 && selectedSector) {
			setCurrentStep(2);
		} else if (currentStep === 2 && selectedBranch) {
			setCurrentStep(3);
		}
	};

	const handleBack = (): void => {
		if (currentStep === 3) {
			setCurrentStep(2);
			setSelectedSpecialization('');
		} else if (currentStep === 2) {
			setCurrentStep(1);
			setSelectedBranch('');
			setAvailableSpecializations([]);
		} else {
			navigate('/');
		}
	};

	const handleComplete = async (): Promise<void> => {
		if (!selectedSpecialization) {
			setError('Please select a specialization');
			return;
		}

		try {
			// Here you would typically save the user's selections to the database
			// For now, we'll just navigate to dashboard

			// Get the full details for display
			const selectedSectorData = sectors.find(
				(s) => s.id === parseInt(selectedSector)
			);
			const selectedBranchData = availableBranches.find(
				(b) => b.id === parseInt(selectedBranch)
			);
			const selectedSpecializationData = availableSpecializations.find(
				(s) => s.id === parseInt(selectedSpecialization)
			);

			console.log('User selections:', {
				sector: selectedSectorData,
				branch: selectedBranchData,
				specialization: selectedSpecializationData
			});

			navigate('/dashboard');
		} catch (error) {
			setError('Failed to save selections');
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
					padding: '2rem',
					boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
				}}>
				{/* Header */}
				<div style={{ textAlign: 'center', marginBottom: '2rem' }}>
					<h1
						style={{
							fontSize: '2rem',
							fontWeight: 'bold',
							color: '#1f2937',
							marginBottom: '0.5rem'
						}}>
						Welcome to Your Future! 🚀
					</h1>
					<p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
						Let's find your perfect career path in 3 simple steps
					</p>
				</div>

				{/* Progress Indicator */}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						marginBottom: '2rem',
						gap: '1rem'
					}}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							padding: '0.5rem 1rem',
							backgroundColor: currentStep >= 1 ? '#3b82f6' : '#e5e7eb',
							color: currentStep >= 1 ? 'white' : '#6b7280',
							borderRadius: '20px',
							fontSize: '0.875rem',
							fontWeight: '500'
						}}>
						1️⃣ Sector
					</div>
					<div
						style={{
							width: '2rem',
							height: '2px',
							backgroundColor: currentStep >= 2 ? '#3b82f6' : '#e5e7eb'
						}}
					/>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							padding: '0.5rem 1rem',
							backgroundColor: currentStep >= 2 ? '#3b82f6' : '#e5e7eb',
							color: currentStep >= 2 ? 'white' : '#6b7280',
							borderRadius: '20px',
							fontSize: '0.875rem',
							fontWeight: '500'
						}}>
						2️⃣ Branch
					</div>
					<div
						style={{
							width: '2rem',
							height: '2px',
							backgroundColor: currentStep >= 3 ? '#3b82f6' : '#e5e7eb'
						}}
					/>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							padding: '0.5rem 1rem',
							backgroundColor: currentStep >= 3 ? '#3b82f6' : '#e5e7eb',
							color: currentStep >= 3 ? 'white' : '#6b7280',
							borderRadius: '20px',
							fontSize: '0.875rem',
							fontWeight: '500'
						}}>
						3️⃣ Specialization
					</div>
				</div>

				{/* Error Message */}
				{error && (
					<div
						style={{
							backgroundColor: '#fee2e2',
							color: '#dc2626',
							padding: '1rem',
							borderRadius: '6px',
							marginBottom: '1.5rem',
							textAlign: 'center'
						}}>
						⚠️ {error}
					</div>
				)}

				{/* Step 1: Sector Selection */}
				{currentStep === 1 && (
					<div>
						<h2
							style={{
								fontSize: '1.5rem',
								fontWeight: 'bold',
								marginBottom: '1rem',
								color: '#1f2937'
							}}>
							🎯 Choose Your Sector
						</h2>
						<p
							style={{
								color: '#6b7280',
								marginBottom: '1.5rem'
							}}>
							Which industry excites you most? This will be the foundation of
							your career journey.
						</p>

						<div
							style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
							{sectors.map((sector) => (
								<label
									key={sector.id}
									style={{
										display: 'flex',
										alignItems: 'flex-start',
										padding: '1.5rem',
										border:
											selectedSector === sector.id.toString()
												? '2px solid #3b82f6'
												: '2px solid #e5e7eb',
										borderRadius: '8px',
										cursor: 'pointer',
										backgroundColor:
											selectedSector === sector.id.toString()
												? '#eff6ff'
												: 'white',
										transition: 'all 0.2s'
									}}>
									<input
										type='radio'
										name='sector'
										value={sector.id}
										checked={selectedSector === sector.id.toString()}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											handleSectorSelection(e.target.value)
										}
										style={{
											marginRight: '1rem',
											marginTop: '0.25rem',
											accentColor: '#3b82f6'
										}}
									/>
									<div>
										<div
											style={{
												fontWeight: '600',
												fontSize: '1.125rem',
												color: '#1f2937',
												marginBottom: '0.5rem'
											}}>
											{sector.name}
										</div>
										<div
											style={{
												color: '#6b7280',
												lineHeight: '1.5'
											}}>
											{sector.description}
										</div>
										<div
											style={{
												fontSize: '0.875rem',
												color: '#9ca3af',
												marginTop: '0.5rem'
											}}>
											{sector.branches?.length || 0} branches available
										</div>
									</div>
								</label>
							))}
						</div>
					</div>
				)}

				{/* Step 2: Branch Selection */}
				{currentStep === 2 && (
					<div>
						<h2
							style={{
								fontSize: '1.5rem',
								fontWeight: 'bold',
								marginBottom: '1rem',
								color: '#1f2937'
							}}>
							🌿 Choose Your Branch
						</h2>
						<p
							style={{
								color: '#6b7280',
								marginBottom: '1.5rem'
							}}>
							Which area within{' '}
							{sectors.find((s) => s.id === parseInt(selectedSector))?.name}{' '}
							interests you most?
						</p>

						<div
							style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
							{availableBranches.map((branch) => (
								<label
									key={branch.id}
									style={{
										display: 'flex',
										alignItems: 'flex-start',
										padding: '1.5rem',
										border:
											selectedBranch === branch.id.toString()
												? '2px solid #10b981'
												: '2px solid #e5e7eb',
										borderRadius: '8px',
										cursor: 'pointer',
										backgroundColor:
											selectedBranch === branch.id.toString()
												? '#f0fdf4'
												: 'white',
										transition: 'all 0.2s'
									}}>
									<input
										type='radio'
										name='branch'
										value={branch.id}
										checked={selectedBranch === branch.id.toString()}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											handleBranchSelection(e.target.value)
										}
										style={{
											marginRight: '1rem',
											marginTop: '0.25rem',
											accentColor: '#10b981'
										}}
									/>
									<div>
										<div
											style={{
												fontWeight: '600',
												fontSize: '1.125rem',
												color: '#1f2937',
												marginBottom: '0.5rem'
											}}>
											{branch.name}
										</div>
										<div
											style={{
												color: '#6b7280',
												lineHeight: '1.5'
											}}>
											{branch.description}
										</div>
										<div
											style={{
												fontSize: '0.875rem',
												color: '#9ca3af',
												marginTop: '0.5rem'
											}}>
											{branch.specializations?.length || 0} specializations
											available
										</div>
									</div>
								</label>
							))}
						</div>
					</div>
				)}

				{/* Step 3: Specialization Selection */}
				{currentStep === 3 && (
					<div>
						<h2
							style={{
								fontSize: '1.5rem',
								fontWeight: 'bold',
								marginBottom: '1rem',
								color: '#1f2937'
							}}>
							⭐ Choose Your Specialization
						</h2>
						<p
							style={{
								color: '#6b7280',
								marginBottom: '1.5rem'
							}}>
							Final step! Pick your specific specialization within{' '}
							{
								availableBranches.find((b) => b.id === parseInt(selectedBranch))
									?.name
							}
							.
						</p>

						<div
							style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
							{availableSpecializations.map((specialization) => (
								<label
									key={specialization.id}
									style={{
										display: 'flex',
										alignItems: 'flex-start',
										padding: '1.5rem',
										border:
											selectedSpecialization === specialization.id.toString()
												? '2px solid #f59e0b'
												: '2px solid #e5e7eb',
										borderRadius: '8px',
										cursor: 'pointer',
										backgroundColor:
											selectedSpecialization === specialization.id.toString()
												? '#fefbf2'
												: 'white',
										transition: 'all 0.2s'
									}}>
									<input
										type='radio'
										name='specialization'
										value={specialization.id}
										checked={
											selectedSpecialization === specialization.id.toString()
										}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											setSelectedSpecialization(e.target.value)
										}
										style={{
											marginRight: '1rem',
											marginTop: '0.25rem',
											accentColor: '#f59e0b'
										}}
									/>
									<div>
										<div
											style={{
												fontWeight: '600',
												fontSize: '1.125rem',
												color: '#1f2937',
												marginBottom: '0.5rem'
											}}>
											{specialization.name}
										</div>
										<div
											style={{
												color: '#6b7280',
												lineHeight: '1.5'
											}}>
											{specialization.description}
										</div>
									</div>
								</label>
							))}
						</div>
					</div>
				)}

				{/* Navigation Buttons */}
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginTop: '2rem',
						paddingTop: '2rem',
						borderTop: '1px solid #e5e7eb'
					}}>
					<button
						onClick={handleBack}
						className={`${buttonStyles.secondary} px-6 py-3`}>
						← Back
					</button>

					{currentStep < 3 ? (
						<button
							onClick={handleNext}
							disabled={
								(currentStep === 1 && !selectedSector) ||
								(currentStep === 2 && !selectedBranch)
							}
							className={`${buttonStyles.primary} px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed`}>
							Next →
						</button>
					) : (
						<button
							onClick={handleComplete}
							disabled={!selectedSpecialization}
							className={`${buttonStyles.success} px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed`}>
							🎉 Complete Setup
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
