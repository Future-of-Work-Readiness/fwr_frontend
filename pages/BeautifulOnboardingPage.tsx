import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSectors, getSpecializations } from '../utils/api';
import type { Sector, Specialization } from '../src/types';

export default function BeautifulOnboardingPage(): JSX.Element {
	const navigate = useNavigate();
	const [currentStep, setCurrentStep] = useState<number>(1);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>('');

	// Data
	const [sectors, setSectors] = useState<Sector[]>([]);
	const [specializations, setSpecializations] = useState<Specialization[]>([]);

	// Selections
	const [selectedSector, setSelectedSector] = useState<string>('');
	const [selectedSpecialization, setSelectedSpecialization] =
		useState<string>('');

	useEffect(() => {
		loadSectors();
	}, []);

	const loadSectors = async (): Promise<void> => {
		try {
			setLoading(true);
			const sectorsData = await getSectors();
			setSectors(sectorsData);
			setError('');
		} catch (error) {
			setError('Failed to load sectors');
			console.error('Error loading sectors:', error);
		} finally {
			setLoading(false);
		}
	};

	const loadSpecializations = async (
		sectorId: string | number
	): Promise<void> => {
		try {
			const specializationsData = await getSpecializations(sectorId);
			setSpecializations(specializationsData);
		} catch (error) {
			setError('Failed to load specializations');
			console.error('Error loading specializations:', error);
		}
	};

	const handleSectorSelection = async (
		sectorId: string | number
	): Promise<void> => {
		setSelectedSector(String(sectorId));
		setSelectedSpecialization('');
		await loadSpecializations(sectorId);
	};

	const handleNext = (): void => {
		if (currentStep === 1 && selectedSector) {
			setCurrentStep(2);
		}
	};

	const handleBack = (): void => {
		if (currentStep === 2) {
			setCurrentStep(1);
			setSelectedSpecialization('');
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
			// Here you would typically save the user's selections
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
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}}>
				<div
					style={{
						textAlign: 'center',
						backgroundColor: 'rgba(255, 255, 255, 0.9)',
						padding: '3rem',
						borderRadius: '20px',
						boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
					}}>
					<div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⏳</div>
					<div style={{ fontSize: '1.25rem', color: '#4b5563' }}>
						Loading your journey...
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			style={{
				minHeight: '100vh',
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				padding: '2rem 1rem',
				fontFamily: 'system-ui, -apple-system, sans-serif'
			}}>
			<div
				style={{
					maxWidth: '800px',
					margin: '0 auto',
					backgroundColor: 'rgba(255, 255, 255, 0.95)',
					borderRadius: '25px',
					padding: '3rem',
					boxShadow: '0 25px 80px rgba(0,0,0,0.3)',
					backdropFilter: 'blur(10px)'
				}}>
				{/* Header */}
				<div style={{ textAlign: 'center', marginBottom: '3rem' }}>
					<h1
						style={{
							fontSize: 'clamp(2rem, 4vw, 3rem)',
							fontWeight: '800',
							background: 'linear-gradient(135deg, #667eea, #764ba2)',
							backgroundClip: 'text',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							marginBottom: '1rem'
						}}>
						Welcome to Your Future! 🚀
					</h1>
					<p
						style={{
							color: '#6b7280',
							fontSize: '1.125rem',
							maxWidth: '500px',
							margin: '0 auto'
						}}>
						Let's discover your perfect career path in just 2 simple steps
					</p>
				</div>

				{/* Progress Indicator */}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						marginBottom: '3rem',
						gap: '1rem'
					}}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							width: '60px',
							height: '60px',
							borderRadius: '50%',
							backgroundColor: currentStep >= 1 ? '#667eea' : '#e5e7eb',
							color: currentStep >= 1 ? 'white' : '#9ca3af',
							fontSize: '1.25rem',
							fontWeight: 'bold',
							transition: 'all 0.3s',
							boxShadow:
								currentStep >= 1
									? '0 8px 25px rgba(102, 126, 234, 0.4)'
									: 'none'
						}}>
						1️⃣
					</div>
					<div
						style={{
							width: '80px',
							height: '4px',
							backgroundColor: currentStep >= 2 ? '#667eea' : '#e5e7eb',
							borderRadius: '2px',
							transition: 'all 0.3s'
						}}
					/>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							width: '60px',
							height: '60px',
							borderRadius: '50%',
							backgroundColor: currentStep >= 2 ? '#667eea' : '#e5e7eb',
							color: currentStep >= 2 ? 'white' : '#9ca3af',
							fontSize: '1.25rem',
							fontWeight: 'bold',
							transition: 'all 0.3s',
							boxShadow:
								currentStep >= 2
									? '0 8px 25px rgba(102, 126, 234, 0.4)'
									: 'none'
						}}>
						2️⃣
					</div>
				</div>

				{/* Error Message */}
				{error && (
					<div
						style={{
							backgroundColor: '#fee2e2',
							color: '#dc2626',
							padding: '1rem',
							borderRadius: '15px',
							marginBottom: '2rem',
							textAlign: 'center',
							border: '2px solid #fecaca'
						}}>
						⚠️ {error}
					</div>
				)}

				{/* Step 1: Sector Selection */}
				{currentStep === 1 && (
					<div>
						<h2
							style={{
								fontSize: '2rem',
								fontWeight: 'bold',
								marginBottom: '1rem',
								color: '#1f2937',
								textAlign: 'center'
							}}>
							🎯 Choose Your Industry
						</h2>
						<p
							style={{
								color: '#6b7280',
								marginBottom: '2rem',
								textAlign: 'center',
								fontSize: '1.125rem'
							}}>
							Which industry excites you most? This will be the foundation of
							your career journey.
						</p>

						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
								gap: '1.5rem'
							}}>
							{sectors.map((sector) => (
								<label
									key={sector.id}
									style={{
										display: 'flex',
										alignItems: 'center',
										padding: '2rem',
										border:
											selectedSector === sector.id.toString()
												? '3px solid #667eea'
												: '2px solid #e5e7eb',
										borderRadius: '20px',
										cursor: 'pointer',
										backgroundColor:
											selectedSector === sector.id.toString()
												? 'rgba(102, 126, 234, 0.1)'
												: 'white',
										transition: 'all 0.3s',
										boxShadow:
											selectedSector === sector.id.toString()
												? '0 15px 40px rgba(102, 126, 234, 0.2)'
												: '0 5px 15px rgba(0,0,0,0.1)',
										transform:
											selectedSector === sector.id.toString()
												? 'translateY(-5px)'
												: 'translateY(0)'
									}}
									onMouseOver={(e: React.MouseEvent<HTMLLabelElement>) => {
										if (selectedSector !== sector.id.toString()) {
											e.currentTarget.style.transform = 'translateY(-3px)';
											e.currentTarget.style.boxShadow =
												'0 10px 25px rgba(0,0,0,0.15)';
										}
									}}
									onMouseOut={(e: React.MouseEvent<HTMLLabelElement>) => {
										if (selectedSector !== sector.id.toString()) {
											e.currentTarget.style.transform = 'translateY(0)';
											e.currentTarget.style.boxShadow =
												'0 5px 15px rgba(0,0,0,0.1)';
										}
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
											transform: 'scale(1.2)',
											accentColor: '#667eea'
										}}
									/>
									<div style={{ textAlign: 'center', flex: 1 }}>
										<div
											style={{
												fontSize: '3rem',
												marginBottom: '1rem'
											}}>
											{sector.name === 'Technology'
												? '💻'
												: sector.name === 'Healthcare'
												? '🏥'
												: sector.name === 'Finance'
												? '💰'
												: sector.name === 'Education'
												? '📚'
												: sector.name === 'Retail'
												? '🛍️'
												: '🏢'}
										</div>
										<div
											style={{
												fontWeight: '700',
												fontSize: '1.25rem',
												color: '#1f2937',
												marginBottom: '0.5rem'
											}}>
											{sector.name}
										</div>
										<div
											style={{
												color: '#6b7280',
												fontSize: '0.875rem'
											}}>
											Explore exciting opportunities
										</div>
									</div>
								</label>
							))}
						</div>
					</div>
				)}

				{/* Step 2: Specialization Selection */}
				{currentStep === 2 && (
					<div>
						<h2
							style={{
								fontSize: '2rem',
								fontWeight: 'bold',
								marginBottom: '1rem',
								color: '#1f2937',
								textAlign: 'center'
							}}>
							⭐ Choose Your Specialization
						</h2>
						<p
							style={{
								color: '#6b7280',
								marginBottom: '2rem',
								textAlign: 'center',
								fontSize: '1.125rem'
							}}>
							Perfect! Now pick your specific area of expertise within{' '}
							{sectors.find((s) => s.id === parseInt(selectedSector))?.name}.
						</p>

						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
								gap: '1.5rem'
							}}>
							{specializations.map((specialization) => (
								<label
									key={specialization.id}
									style={{
										display: 'flex',
										alignItems: 'flex-start',
										padding: '2rem',
										border:
											selectedSpecialization === specialization.id.toString()
												? '3px solid #10b981'
												: '2px solid #e5e7eb',
										borderRadius: '20px',
										cursor: 'pointer',
										backgroundColor:
											selectedSpecialization === specialization.id.toString()
												? 'rgba(16, 185, 129, 0.1)'
												: 'white',
										transition: 'all 0.3s',
										boxShadow:
											selectedSpecialization === specialization.id.toString()
												? '0 15px 40px rgba(16, 185, 129, 0.2)'
												: '0 5px 15px rgba(0,0,0,0.1)',
										transform:
											selectedSpecialization === specialization.id.toString()
												? 'translateY(-5px)'
												: 'translateY(0)'
									}}
									onMouseOver={(e: React.MouseEvent<HTMLLabelElement>) => {
										if (
											selectedSpecialization !== specialization.id.toString()
										) {
											e.currentTarget.style.transform = 'translateY(-3px)';
											e.currentTarget.style.boxShadow =
												'0 10px 25px rgba(0,0,0,0.15)';
										}
									}}
									onMouseOut={(e: React.MouseEvent<HTMLLabelElement>) => {
										if (
											selectedSpecialization !== specialization.id.toString()
										) {
											e.currentTarget.style.transform = 'translateY(0)';
											e.currentTarget.style.boxShadow =
												'0 5px 15px rgba(0,0,0,0.1)';
										}
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
											transform: 'scale(1.2)',
											accentColor: '#10b981'
										}}
									/>
									<div>
										<div
											style={{
												fontWeight: '700',
												fontSize: '1.25rem',
												color: '#1f2937',
												marginBottom: '0.5rem'
											}}>
											{specialization.name}
										</div>
										<div
											style={{
												color: '#6b7280',
												lineHeight: '1.6',
												fontSize: '0.9rem'
											}}>
											{specialization.description ||
												'Specialized field with great career prospects'}
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
						marginTop: '3rem',
						paddingTop: '2rem',
						borderTop: '2px solid #f3f4f6'
					}}>
					<button
						onClick={handleBack}
						style={{
							padding: '1rem 2rem',
							backgroundColor: '#6b7280',
							color: 'white',
							border: 'none',
							borderRadius: '15px',
							cursor: 'pointer',
							fontWeight: '600',
							fontSize: '1rem',
							transition: 'all 0.3s',
							boxShadow: '0 4px 15px rgba(107, 114, 128, 0.3)'
						}}
						onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
							e.currentTarget.style.backgroundColor = '#4b5563';
							e.currentTarget.style.transform = 'translateY(-2px)';
						}}
						onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
							e.currentTarget.style.backgroundColor = '#6b7280';
							e.currentTarget.style.transform = 'translateY(0)';
						}}>
						← Back
					</button>

					{currentStep < 2 ? (
						<button
							onClick={handleNext}
							disabled={!selectedSector}
							style={{
								padding: '1rem 2rem',
								backgroundColor: selectedSector ? '#667eea' : '#d1d5db',
								color: 'white',
								border: 'none',
								borderRadius: '15px',
								cursor: selectedSector ? 'pointer' : 'not-allowed',
								fontWeight: '600',
								fontSize: '1rem',
								transition: 'all 0.3s',
								boxShadow: selectedSector
									? '0 4px 15px rgba(102, 126, 234, 0.4)'
									: 'none'
							}}
							onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
								if (selectedSector) {
									e.currentTarget.style.backgroundColor = '#5a67d8';
									e.currentTarget.style.transform = 'translateY(-2px)';
								}
							}}
							onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
								if (selectedSector) {
									e.currentTarget.style.backgroundColor = '#667eea';
									e.currentTarget.style.transform = 'translateY(0)';
								}
							}}>
							Next →
						</button>
					) : (
						<button
							onClick={handleComplete}
							disabled={!selectedSpecialization}
							style={{
								padding: '1rem 2rem',
								backgroundColor: selectedSpecialization ? '#10b981' : '#d1d5db',
								color: 'white',
								border: 'none',
								borderRadius: '15px',
								cursor: selectedSpecialization ? 'pointer' : 'not-allowed',
								fontWeight: '600',
								fontSize: '1rem',
								transition: 'all 0.3s',
								boxShadow: selectedSpecialization
									? '0 4px 15px rgba(16, 185, 129, 0.4)'
									: 'none'
							}}
							onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
								if (selectedSpecialization) {
									e.currentTarget.style.backgroundColor = '#059669';
									e.currentTarget.style.transform = 'translateY(-2px)';
								}
							}}
							onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
								if (selectedSpecialization) {
									e.currentTarget.style.backgroundColor = '#10b981';
									e.currentTarget.style.transform = 'translateY(0)';
								}
							}}>
							🎉 Complete Setup
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
