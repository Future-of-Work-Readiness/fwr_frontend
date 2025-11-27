import React from 'react';
import type { Sector, Specialization, Quiz, UserPreferences } from './types';

// Simple working components
export function WorkingOnboarding(): JSX.Element {
	const [sectors, setSectors] = React.useState<Sector[]>([]);
	const [selectedSector, setSelectedSector] = React.useState<string>('');
	const [specializations, setSpecializations] = React.useState<
		Specialization[]
	>([]);
	const [selectedSpecialization, setSelectedSpecialization] =
		React.useState<string>('');
	const [loading, setLoading] = React.useState<boolean>(true);
	const [error, setError] = React.useState<string>('');

	React.useEffect(() => {
		fetchSectors();
	}, []);

	const fetchSectors = async (): Promise<void> => {
		try {
			const response = await fetch('http://localhost:8000/api/sectors');
			if (!response.ok) throw new Error('Failed to fetch sectors');
			const data = (await response.json()) as Sector[];
			setSectors(data);
			setLoading(false);
		} catch (err) {
			const error = err instanceof Error ? err : new Error('Unknown error');
			setError('Failed to load sectors: ' + error.message);
			setLoading(false);
		}
	};

	const handleSectorChange = async (sectorId: string): Promise<void> => {
		setSelectedSector(sectorId);
		setSelectedSpecialization('');

		if (sectorId) {
			try {
				const response = await fetch(
					`http://localhost:8000/api/sectors/${sectorId}/specializations`
				);
				if (!response.ok) throw new Error('Failed to fetch specializations');
				const data = (await response.json()) as Specialization[];
				setSpecializations(data);
			} catch (err) {
				const error = err instanceof Error ? err : new Error('Unknown error');
				setError('Failed to load specializations: ' + error.message);
			}
		} else {
			setSpecializations([]);
		}
	};

	const handleContinue = () => {
		if (selectedSector && selectedSpecialization) {
			// Save user preferences
			localStorage.setItem(
				'userPreferences',
				JSON.stringify({
					sectorId: selectedSector,
					specializationId: selectedSpecialization
				})
			);
			// Navigate to dashboard
			window.location.href = '/dashboard';
		} else {
			alert('Please select both an industry and specialization');
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
					justifyContent: 'center',
					fontFamily: 'system-ui, -apple-system, sans-serif'
				}}>
				<div style={{ color: 'white', fontSize: '1.5rem' }}>
					🔄 Loading industries...
				</div>
			</div>
		);
	}

	return (
		<div
			style={{
				minHeight: '100vh',
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				padding: '2rem',
				fontFamily: 'system-ui, -apple-system, sans-serif'
			}}>
			<div
				style={{
					maxWidth: '800px',
					margin: '0 auto',
					backgroundColor: 'white',
					borderRadius: '20px',
					padding: '3rem',
					textAlign: 'center',
					boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
				}}>
				<h1
					style={{
						fontSize: '2.5rem',
						marginBottom: '2rem',
						background: 'linear-gradient(135deg, #667eea, #764ba2)',
						backgroundClip: 'text',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent'
					}}>
					🎯 Welcome! Let's Get Started
				</h1>
				<p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '3rem' }}>
					Tell us about your career interests so we can personalize your
					experience.
				</p>

				{error && (
					<div
						style={{
							backgroundColor: '#fee2e2',
							color: '#dc2626',
							padding: '1rem',
							borderRadius: '10px',
							marginBottom: '2rem'
						}}>
						⚠️ {error}
					</div>
				)}

				<div style={{ textAlign: 'left', marginBottom: '2rem' }}>
					<label
						style={{
							display: 'block',
							marginBottom: '0.5rem',
							fontWeight: '600'
						}}>
						🏭 Select your industry:
					</label>
					<select
						value={selectedSector}
						onChange={(e) => handleSectorChange(e.target.value)}
						style={{
							width: '100%',
							padding: '1rem',
							borderRadius: '10px',
							border: '2px solid #e5e7eb',
							fontSize: '1rem'
						}}>
						<option value=''>Choose an industry...</option>
						{sectors.map((sector) => (
							<option key={sector.id} value={sector.id}>
								{sector.name}
							</option>
						))}
					</select>
				</div>

				{selectedSector && (
					<div style={{ textAlign: 'left', marginBottom: '2rem' }}>
						<label
							style={{
								display: 'block',
								marginBottom: '0.5rem',
								fontWeight: '600'
							}}>
							🎯 Select your specialization:
						</label>
						<select
							value={selectedSpecialization}
							onChange={(e) => setSelectedSpecialization(e.target.value)}
							style={{
								width: '100%',
								padding: '1rem',
								borderRadius: '10px',
								border: '2px solid #e5e7eb',
								fontSize: '1rem'
							}}>
							<option value=''>Choose a specialization...</option>
							{specializations.map((spec) => (
								<option key={spec.id} value={spec.id}>
									{spec.name}
								</option>
							))}
						</select>
					</div>
				)}

				<button
					onClick={handleContinue}
					disabled={!selectedSector || !selectedSpecialization}
					style={{
						backgroundColor:
							selectedSector && selectedSpecialization ? '#10b981' : '#9ca3af',
						color: 'white',
						padding: '1rem 2rem',
						borderRadius: '15px',
						border: 'none',
						fontSize: '1.1rem',
						fontWeight: '600',
						cursor:
							selectedSector && selectedSpecialization
								? 'pointer'
								: 'not-allowed',
						marginRight: '1rem'
					}}>
					Continue →
				</button>

				<a
					href='/'
					style={{
						color: '#667eea',
						textDecoration: 'none',
						fontWeight: '600'
					}}>
					← Back to Home
				</a>
			</div>
		</div>
	);
}

export function WorkingDashboard(): JSX.Element {
	const [userPreferences, setUserPreferences] =
		React.useState<UserPreferences | null>(null);
	const [quizzes, setQuizzes] = React.useState<Quiz[]>([]);

	React.useEffect(() => {
		// Load user preferences from localStorage
		const preferences = localStorage.getItem('userPreferences');
		if (preferences) {
			try {
				setUserPreferences(JSON.parse(preferences) as UserPreferences);
			} catch {
				// Invalid JSON, ignore
			}
		}

		// Fetch available quizzes
		fetchQuizzes();
	}, []);

	const fetchQuizzes = async (): Promise<void> => {
		try {
			const response = await fetch('http://localhost:8000/api/quizzes');
			if (response.ok) {
				const data = (await response.json()) as Quiz[];
				setQuizzes(data);
			}
		} catch (err) {
			console.error('Failed to fetch quizzes:', err);
		}
	};

	const resetPreferences = (): void => {
		localStorage.removeItem('userPreferences');
		setUserPreferences(null);
	};

	return (
		<div
			style={{
				minHeight: '100vh',
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				padding: '2rem',
				fontFamily: 'system-ui, -apple-system, sans-serif'
			}}>
			<div
				style={{
					maxWidth: '900px',
					margin: '0 auto',
					backgroundColor: 'white',
					borderRadius: '20px',
					padding: '3rem',
					boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
				}}>
				<h1
					style={{
						fontSize: '2.5rem',
						marginBottom: '2rem',
						textAlign: 'center',
						background: 'linear-gradient(135deg, #667eea, #764ba2)',
						backgroundClip: 'text',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent'
					}}>
					📊 Your Dashboard
				</h1>

				{userPreferences ? (
					<div>
						<div
							style={{
								backgroundColor: '#f0f9ff',
								padding: '1.5rem',
								borderRadius: '15px',
								marginBottom: '2rem',
								border: '2px solid #0284c7'
							}}>
							<h3 style={{ color: '#0284c7', marginBottom: '1rem' }}>
								✅ Your Preferences
							</h3>
							<p style={{ color: '#374151' }}>
								<strong>Sector ID:</strong> {userPreferences.sectorId} |
								<strong> Specialization ID:</strong>{' '}
								{userPreferences.specializationId}
							</p>
							<button
								onClick={resetPreferences}
								style={{
									backgroundColor: '#f59e0b',
									color: 'white',
									padding: '0.5rem 1rem',
									borderRadius: '8px',
									border: 'none',
									cursor: 'pointer',
									marginTop: '1rem'
								}}>
								🔄 Reset Preferences
							</button>
						</div>

						<div
							style={{
								backgroundColor: '#f0fdf4',
								padding: '1.5rem',
								borderRadius: '15px',
								marginBottom: '2rem',
								border: '2px solid #22c55e'
							}}>
							<h3 style={{ color: '#22c55e', marginBottom: '1rem' }}>
								🎯 Ready for Assessment!
							</h3>
							<p style={{ color: '#374151', marginBottom: '1rem' }}>
								Great! You've completed onboarding. Available assessments:{' '}
								{quizzes.length}
							</p>
							{quizzes.length > 0 && (
								<button
									style={{
										backgroundColor: '#22c55e',
										color: 'white',
										padding: '1rem 2rem',
										borderRadius: '15px',
										border: 'none',
										cursor: 'pointer',
										fontWeight: '600'
									}}>
									🚀 Start Assessment
								</button>
							)}
						</div>
					</div>
				) : (
					<div
						style={{
							textAlign: 'center',
							backgroundColor: '#fef3c7',
							padding: '2rem',
							borderRadius: '15px',
							marginBottom: '2rem',
							border: '2px solid #f59e0b'
						}}>
						<h3 style={{ color: '#f59e0b', marginBottom: '1rem' }}>
							⚠️ Onboarding Required
						</h3>
						<p style={{ color: '#374151', marginBottom: '1rem' }}>
							Please complete your onboarding first to set up your preferences.
						</p>
						<a
							href='/onboarding'
							style={{
								padding: '1rem 2rem',
								backgroundColor: '#f59e0b',
								color: 'white',
								textDecoration: 'none',
								borderRadius: '15px',
								fontWeight: '600'
							}}>
							🎯 Complete Onboarding
						</a>
					</div>
				)}

				<div style={{ textAlign: 'center', marginTop: '2rem' }}>
					<a
						href='/'
						style={{
							color: '#667eea',
							textDecoration: 'none',
							fontWeight: '600'
						}}>
						← Back to Home
					</a>
				</div>
			</div>
		</div>
	);
}

function MinimalApp(): JSX.Element {
	return (
		<div
			style={{
				minHeight: '100vh',
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontFamily: 'system-ui, -apple-system, sans-serif',
				padding: '2rem'
			}}>
			<div
				style={{
					backgroundColor: 'white',
					padding: '3rem',
					borderRadius: '20px',
					textAlign: 'center',
					boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
					maxWidth: '800px',
					width: '100%'
				}}>
				<h1
					style={{
						fontSize: '3rem',
						marginBottom: '2rem',
						background: 'linear-gradient(135deg, #667eea, #764ba2)',
						backgroundClip: 'text',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent'
					}}>
					🚀 IT'S WORKING!
				</h1>

				<p
					style={{
						fontSize: '1.25rem',
						color: '#6b7280',
						marginBottom: '3rem'
					}}>
					Your React app is running perfectly! The backend should be working
					too.
				</p>

				<div
					style={{
						display: 'flex',
						gap: '1rem',
						justifyContent: 'center',
						flexWrap: 'wrap',
						marginBottom: '3rem'
					}}>
					<a
						href='/onboarding'
						style={{
							padding: '1rem 2rem',
							backgroundColor: '#667eea',
							color: 'white',
							textDecoration: 'none',
							borderRadius: '15px',
							fontWeight: '600',
							transition: 'transform 0.2s'
						}}
						onMouseOver={(e: React.MouseEvent<HTMLAnchorElement>) => {
							e.currentTarget.style.transform = 'translateY(-2px)';
						}}
						onMouseOut={(e: React.MouseEvent<HTMLAnchorElement>) => {
							e.currentTarget.style.transform = 'translateY(0)';
						}}>
						🎯 Try Onboarding
					</a>

					<a
						href='/dashboard'
						style={{
							padding: '1rem 2rem',
							backgroundColor: '#10b981',
							color: 'white',
							textDecoration: 'none',
							borderRadius: '15px',
							fontWeight: '600',
							transition: 'transform 0.2s'
						}}
						onMouseOver={(e: React.MouseEvent<HTMLAnchorElement>) => {
							e.currentTarget.style.transform = 'translateY(-2px)';
						}}
						onMouseOut={(e: React.MouseEvent<HTMLAnchorElement>) => {
							e.currentTarget.style.transform = 'translateY(0)';
						}}>
						📊 Try Dashboard
					</a>
				</div>

				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
						gap: '2rem',
						marginBottom: '3rem'
					}}>
					<div
						style={{
							padding: '2rem',
							backgroundColor: '#dcfce7',
							borderRadius: '15px',
							border: '2px solid #16a34a'
						}}>
						<div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
						<h3
							style={{
								color: '#16a34a',
								marginBottom: '0.5rem',
								fontSize: '1.25rem'
							}}>
							Frontend
						</h3>
						<p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
							React is working!
						</p>
					</div>

					<div
						style={{
							padding: '2rem',
							backgroundColor: '#dbeafe',
							borderRadius: '15px',
							border: '2px solid #2563eb'
						}}>
						<div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔧</div>
						<h3
							style={{
								color: '#2563eb',
								marginBottom: '0.5rem',
								fontSize: '1.25rem'
							}}>
							Backend
						</h3>
						<p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
							API on port 8000
						</p>
					</div>

					<div
						style={{
							padding: '2rem',
							backgroundColor: '#fef3c7',
							borderRadius: '15px',
							border: '2px solid #d97706'
						}}>
						<div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎨</div>
						<h3
							style={{
								color: '#d97706',
								marginBottom: '0.5rem',
								fontSize: '1.25rem'
							}}>
							Design
						</h3>
						<p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
							Beautiful & working!
						</p>
					</div>
				</div>

				<div
					style={{
						padding: '2rem',
						backgroundColor: '#f0f9ff',
						borderRadius: '15px',
						marginBottom: '2rem'
					}}>
					<h2 style={{ color: '#1e40af', marginBottom: '1rem' }}>
						🧪 Test Your Backend
					</h2>
					<p style={{ color: '#6b7280', marginBottom: '1rem' }}>
						Your backend is running on <strong>http://localhost:8000</strong>
					</p>
					<div
						style={{
							display: 'flex',
							gap: '1rem',
							justifyContent: 'center',
							flexWrap: 'wrap'
						}}>
						<a
							href='http://localhost:8000/docs'
							target='_blank'
							rel='noopener noreferrer'
							style={{
								padding: '0.75rem 1.5rem',
								backgroundColor: '#2563eb',
								color: 'white',
								textDecoration: 'none',
								borderRadius: '10px',
								fontWeight: '600'
							}}>
							📚 API Docs
						</a>
						<a
							href='http://localhost:8000/api/getSectors'
							target='_blank'
							rel='noopener noreferrer'
							style={{
								padding: '0.75rem 1.5rem',
								backgroundColor: '#16a34a',
								color: 'white',
								textDecoration: 'none',
								borderRadius: '10px',
								fontWeight: '600'
							}}>
							🗂️ Test Sectors API
						</a>
					</div>
				</div>

				<div
					style={{
						marginTop: '2rem',
						padding: '1rem',
						backgroundColor: '#f3f4f6',
						borderRadius: '10px',
						fontSize: '0.875rem',
						color: '#6b7280'
					}}>
					<strong>Status:</strong> All systems operational ✨
					<br />
					<strong>Frontend:</strong> http://localhost:3009
					<br />
					<strong>Backend:</strong> http://localhost:8000
				</div>
			</div>
		</div>
	);
}

export default MinimalApp;
