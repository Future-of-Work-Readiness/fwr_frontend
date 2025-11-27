import React from 'react';
import type { User, Sector, Specialization, Quiz, FormData } from './types';

type Page = 'landing' | 'onboarding' | 'dashboard';

function FullApp(): JSX.Element {
	const [currentPage, setCurrentPage] = React.useState<Page>('landing');
	const [user, setUser] = React.useState<User | null>(null);
	const [sectors, setSectors] = React.useState<Sector[]>([]);
	const [specializations, setSpecializations] = React.useState<
		Specialization[]
	>([]);
	const [quizzes, setQuizzes] = React.useState<Quiz[]>([]);
	const [loading, setLoading] = React.useState<boolean>(false);
	const [error, setError] = React.useState<string>('');

	// Form states
	const [showLoginModal, setShowLoginModal] = React.useState<boolean>(false);
	const [isRegistering, setIsRegistering] = React.useState<boolean>(false);
	const [formData, setFormData] = React.useState<FormData>({
		name: '',
		email: '',
		password: ''
	});

	// Onboarding states
	const [selectedSector, setSelectedSector] = React.useState<string>('');
	const [selectedSpecialization, setSelectedSpecialization] =
		React.useState<string>('');

	React.useEffect(() => {
		fetchSectors();
		fetchQuizzes();
	}, []);

	const fetchSectors = async () => {
		try {
			const response = await fetch('http://localhost:8000/api/sectors');
			if (response.ok) {
				const data = await response.json();
				setSectors(data);
			}
		} catch (err) {
			console.error('Failed to fetch sectors:', err);
		}
	};

	const fetchSpecializations = async (
		sectorId: string | number
	): Promise<void> => {
		try {
			const response = await fetch(
				`http://localhost:8000/api/sectors/${sectorId}/specializations`
			);
			if (response.ok) {
				const data = (await response.json()) as Specialization[];
				setSpecializations(data);
			}
		} catch (err) {
			console.error('Failed to fetch specializations:', err);
		}
	};

	const fetchQuizzes = async () => {
		try {
			const response = await fetch('http://localhost:8000/api/quizzes');
			if (response.ok) {
				const data = await response.json();
				setQuizzes(data);
			}
		} catch (err) {
			console.error('Failed to fetch quizzes:', err);
		}
	};

	const handleRegister = async (
		e: React.FormEvent<HTMLFormElement>
	): Promise<void> => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			const response = await fetch('http://localhost:8000/api/users/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: formData.email,
					password: formData.password,
					name: formData.name
				})
			});

			if (response.ok) {
				const userData = (await response.json()) as { user: User };
				setUser(userData.user);
				setShowLoginModal(false);
				setCurrentPage('onboarding');
				setFormData({ name: '', email: '', password: '' });
			} else {
				const errorData = (await response.json()) as { detail?: string };
				setError(errorData.detail || 'Registration failed');
			}
		} catch (err) {
			const error = err instanceof Error ? err : new Error('Unknown error');
			setError('Network error: ' + error.message);
		}
		setLoading(false);
	};

	const handleLogin = async (
		e: React.FormEvent<HTMLFormElement>
	): Promise<void> => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			const response = await fetch('http://localhost:8000/api/users/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: formData.email,
					password: formData.password
				})
			});

			if (response.ok) {
				const userData = (await response.json()) as { user: User };
				setUser(userData.user);
				setShowLoginModal(false);
				setCurrentPage('onboarding');
				setFormData({ name: '', email: '', password: '' });
			} else {
				const errorData = (await response.json()) as { detail?: string };
				setError(errorData.detail || 'Login failed');
			}
		} catch (err) {
			const error = err instanceof Error ? err : new Error('Unknown error');
			setError('Network error: ' + error.message);
		}
		setLoading(false);
	};

	const handleSectorChange = (sectorId: string): void => {
		setSelectedSector(sectorId);
		setSelectedSpecialization('');
		if (sectorId) {
			fetchSpecializations(sectorId);
		} else {
			setSpecializations([]);
		}
	};

	const completeOnboarding = () => {
		if (selectedSector && selectedSpecialization) {
			setCurrentPage('dashboard');
		} else {
			setError('Please select both sector and specialization');
		}
	};

	const logout = () => {
		setUser(null);
		setCurrentPage('landing');
		setSelectedSector('');
		setSelectedSpecialization('');
		setSpecializations([]);
		setFormData({ name: '', email: '', password: '' });
	};

	// Styles
	const containerStyle = {
		minHeight: '100vh',
		background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
		fontFamily: 'system-ui, -apple-system, sans-serif'
	};

	const cardStyle = {
		maxWidth: '800px',
		margin: '0 auto',
		backgroundColor: 'white',
		borderRadius: '20px',
		padding: '3rem',
		boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
	};

	const buttonStyle = {
		backgroundColor: '#667eea',
		color: 'white',
		padding: '1rem 2rem',
		borderRadius: '15px',
		border: 'none',
		fontSize: '1.1rem',
		fontWeight: '600',
		cursor: 'pointer',
		marginRight: '1rem',
		marginBottom: '1rem'
	};

	const inputStyle = {
		width: '100%',
		padding: '1rem',
		borderRadius: '10px',
		border: '2px solid #e5e7eb',
		fontSize: '1rem',
		marginBottom: '1rem'
	};

	const modalStyle: React.CSSProperties = {
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(0,0,0,0.5)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 1000
	};

	const modalContentStyle = {
		backgroundColor: 'white',
		padding: '2rem',
		borderRadius: '20px',
		width: '90%',
		maxWidth: '500px'
	};

	// Landing Page
	if (currentPage === 'landing') {
		return (
			<div style={containerStyle}>
				<div style={{ padding: '2rem' }}>
					<div style={cardStyle}>
						<div style={{ textAlign: 'center' }}>
							<h1
								style={{
									fontSize: '3rem',
									marginBottom: '2rem',
									background: 'linear-gradient(135deg, #667eea, #764ba2)',
									backgroundClip: 'text',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent'
								}}>
								🚀 Future of Work Readiness
							</h1>

							<p
								style={{
									fontSize: '1.25rem',
									color: '#6b7280',
									marginBottom: '3rem'
								}}>
								Discover your readiness for the future workforce. Take
								assessments, get personalized insights, and advance your career.
							</p>

							<div
								style={{
									display: 'grid',
									gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
									gap: '2rem',
									marginBottom: '3rem'
								}}>
								<div
									style={{
										padding: '2rem',
										backgroundColor: '#f0f9ff',
										borderRadius: '15px',
										border: '2px solid #0284c7'
									}}>
									<div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
										🎯
									</div>
									<h3 style={{ color: '#0284c7', marginBottom: '1rem' }}>
										Personalized Assessment
									</h3>
									<p style={{ color: '#374151' }}>
										Take quizzes tailored to your sector and specialization
									</p>
								</div>

								<div
									style={{
										padding: '2rem',
										backgroundColor: '#f0fdf4',
										borderRadius: '15px',
										border: '2px solid #22c55e'
									}}>
									<div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
										📊
									</div>
									<h3 style={{ color: '#22c55e', marginBottom: '1rem' }}>
										Track Progress
									</h3>
									<p style={{ color: '#374151' }}>
										Monitor your readiness scores and improvement over time
									</p>
								</div>
							</div>

							<button
								onClick={() => setShowLoginModal(true)}
								style={{
									...buttonStyle,
									fontSize: '1.2rem',
									padding: '1.2rem 3rem'
								}}>
								🚪 Get Started
							</button>
						</div>
					</div>
				</div>

				{/* Login/Register Modal */}
				{showLoginModal && (
					<div style={modalStyle}>
						<div style={modalContentStyle}>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									marginBottom: '2rem'
								}}>
								<h2>{isRegistering ? 'Create Account' : 'Login'}</h2>
								<button
									onClick={() => {
										setShowLoginModal(false);
										setError('');
										setFormData({ name: '', email: '', password: '' });
									}}
									style={{
										background: 'none',
										border: 'none',
										fontSize: '1.5rem',
										cursor: 'pointer'
									}}>
									✕
								</button>
							</div>

							{error && (
								<div
									style={{
										backgroundColor: '#fee2e2',
										color: '#dc2626',
										padding: '1rem',
										borderRadius: '10px',
										marginBottom: '1rem'
									}}>
									{error}
								</div>
							)}

							<form onSubmit={isRegistering ? handleRegister : handleLogin}>
								{isRegistering && (
									<input
										type='text'
										placeholder='Full Name'
										value={formData.name}
										onChange={(e) =>
											setFormData({ ...formData, name: e.target.value })
										}
										style={inputStyle}
										required
									/>
								)}

								<input
									type='email'
									placeholder='Email'
									value={formData.email}
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
									style={inputStyle}
									required
								/>

								<input
									type='password'
									placeholder='Password'
									value={formData.password}
									onChange={(e) =>
										setFormData({ ...formData, password: e.target.value })
									}
									style={inputStyle}
									required
								/>

								<button
									type='submit'
									style={{ ...buttonStyle, width: '100%', marginRight: 0 }}
									disabled={loading}>
									{loading
										? '⏳ Processing...'
										: isRegistering
										? '📝 Register'
										: '🔐 Login'}
								</button>
							</form>

							<div style={{ textAlign: 'center', marginTop: '1rem' }}>
								<button
									onClick={() => {
										setIsRegistering(!isRegistering);
										setError('');
									}}
									style={{
										background: 'none',
										border: 'none',
										color: '#667eea',
										cursor: 'pointer'
									}}>
									{isRegistering
										? 'Already have an account? Login'
										: "Don't have an account? Register"}
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}

	// Onboarding Page
	if (currentPage === 'onboarding') {
		return (
			<div style={containerStyle}>
				<div style={{ padding: '2rem' }}>
					<div style={cardStyle}>
						<h1
							style={{
								textAlign: 'center',
								marginBottom: '2rem',
								color: '#333'
							}}>
							🎯 Welcome {user?.name}!
						</h1>

						<p
							style={{
								textAlign: 'center',
								fontSize: '1.2rem',
								color: '#666',
								marginBottom: '3rem'
							}}>
							Let's personalize your experience by selecting your industry and
							specialization.
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
								{error}
							</div>
						)}

						<div style={{ marginBottom: '2rem' }}>
							<label
								style={{
									display: 'block',
									marginBottom: '0.5rem',
									fontWeight: '600'
								}}>
								🏭 Select your industry sector:
							</label>
							<select
								value={selectedSector}
								onChange={(e) => handleSectorChange(e.target.value)}
								style={inputStyle}>
								<option value=''>Choose an industry sector...</option>
								{sectors.map((sector) => (
									<option key={sector.id} value={sector.id}>
										{sector.name}
									</option>
								))}
							</select>
						</div>

						{selectedSector && specializations.length > 0 && (
							<div style={{ marginBottom: '2rem' }}>
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
									style={inputStyle}>
									<option value=''>Choose a specialization...</option>
									{specializations.map((spec) => (
										<option key={spec.id} value={spec.id}>
											{spec.name}
										</option>
									))}
								</select>
							</div>
						)}

						<div style={{ textAlign: 'center' }}>
							<button
								onClick={completeOnboarding}
								disabled={!selectedSector || !selectedSpecialization}
								style={{
									...buttonStyle,
									backgroundColor:
										selectedSector && selectedSpecialization
											? '#10b981'
											: '#9ca3af',
									cursor:
										selectedSector && selectedSpecialization
											? 'pointer'
											: 'not-allowed'
								}}>
								Continue to Dashboard →
							</button>

							<button
								onClick={logout}
								style={{
									...buttonStyle,
									backgroundColor: '#ef4444'
								}}>
								🚪 Logout
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Dashboard Page
	if (currentPage === 'dashboard') {
		const selectedSectorData = sectors.find(
			(s) => String(s.id) === String(selectedSector)
		);
		const selectedSpecData = specializations.find(
			(s) => String(s.id) === String(selectedSpecialization)
		);

		return (
			<div style={containerStyle}>
				<div style={{ padding: '2rem' }}>
					<div style={cardStyle}>
						<h1
							style={{
								textAlign: 'center',
								marginBottom: '2rem',
								color: '#333'
							}}>
							📊 Dashboard - Welcome {user?.name}!
						</h1>

						{/* User Profile Section */}
						<div
							style={{
								backgroundColor: '#f0f9ff',
								padding: '2rem',
								borderRadius: '15px',
								marginBottom: '2rem',
								border: '2px solid #0284c7'
							}}>
							<h3 style={{ color: '#0284c7', marginBottom: '1rem' }}>
								👤 Your Profile
							</h3>
							<div
								style={{
									display: 'grid',
									gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
									gap: '1rem'
								}}>
								<p>
									<strong>Name:</strong> {user?.name}
								</p>
								<p>
									<strong>Email:</strong> {user?.email}
								</p>
								<p>
									<strong>Sector:</strong> {selectedSectorData?.name}
								</p>
								<p>
									<strong>Specialization:</strong> {selectedSpecData?.name}
								</p>
							</div>
						</div>

						{/* Readiness Scores */}
						<div
							style={{
								backgroundColor: '#f0fdf4',
								padding: '2rem',
								borderRadius: '15px',
								marginBottom: '2rem',
								border: '2px solid #22c55e'
							}}>
							<h3 style={{ color: '#22c55e', marginBottom: '1rem' }}>
								📈 Your Readiness Scores
							</h3>
							<div
								style={{
									display: 'grid',
									gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
									gap: '1rem'
								}}>
								<div style={{ textAlign: 'center' }}>
									<div style={{ fontSize: '2rem', color: '#22c55e' }}>
										{user?.readiness_score || 0}%
									</div>
									<p>Overall</p>
								</div>
								<div style={{ textAlign: 'center' }}>
									<div style={{ fontSize: '2rem', color: '#3b82f6' }}>
										{user?.technical_score || 0}%
									</div>
									<p>Technical</p>
								</div>
								<div style={{ textAlign: 'center' }}>
									<div style={{ fontSize: '2rem', color: '#8b5cf6' }}>
										{user?.soft_skills_score || 0}%
									</div>
									<p>Soft Skills</p>
								</div>
							</div>
						</div>

						{/* Available Quizzes */}
						<div
							style={{
								backgroundColor: '#fef3c7',
								padding: '2rem',
								borderRadius: '15px',
								marginBottom: '2rem',
								border: '2px solid #f59e0b'
							}}>
							<h3 style={{ color: '#f59e0b', marginBottom: '1rem' }}>
								🎯 Available Assessments
							</h3>
							<p style={{ marginBottom: '1rem' }}>
								We have <strong>{quizzes.length}</strong> assessments available
								to help you measure your readiness.
							</p>
							{quizzes.length > 0 && (
								<div>
									<p style={{ marginBottom: '1rem' }}>
										<strong>Next Assessment:</strong>{' '}
										{quizzes[0]?.title || 'Professional Skills Assessment'}
									</p>
									<button
										style={{
											...buttonStyle,
											backgroundColor: '#f59e0b'
										}}>
										🚀 Start Assessment
									</button>
								</div>
							)}
						</div>

						{/* Actions */}
						<div style={{ textAlign: 'center' }}>
							<button
								onClick={() => setCurrentPage('onboarding')}
								style={{
									...buttonStyle,
									backgroundColor: '#8b5cf6'
								}}>
								🔄 Change Preferences
							</button>

							<button
								onClick={logout}
								style={{
									...buttonStyle,
									backgroundColor: '#ef4444'
								}}>
								🚪 Logout
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return <></>;
}

export default FullApp;
