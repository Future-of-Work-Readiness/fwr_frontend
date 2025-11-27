import React from 'react';
import type { User, Sector, Specialization, Quiz } from './types';

type Page = 'login' | 'onboarding' | 'dashboard';

function TestApp(): JSX.Element {
	const [currentPage, setCurrentPage] = React.useState<Page>('login');
	const [user, setUser] = React.useState<User | null>(null);
	const [sectors, setSectors] = React.useState<Sector[]>([]);
	const [quizzes, setQuizzes] = React.useState<Quiz[]>([]);
	const [loading, setLoading] = React.useState<boolean>(false);
	const [error, setError] = React.useState<string>('');

	// Login/Register
	const [email, setEmail] = React.useState<string>('');
	const [password, setPassword] = React.useState<string>('');
	const [name, setName] = React.useState<string>('');

	// Onboarding
	const [selectedSector, setSelectedSector] = React.useState<string>('');
	const [specializations, setSpecializations] = React.useState<
		Specialization[]
	>([]);
	const [selectedSpecialization, setSelectedSpecialization] =
		React.useState<string>('');

	React.useEffect(() => {
		fetchSectors();
		fetchQuizzes();
	}, []);

	const fetchSectors = async (): Promise<void> => {
		try {
			const response = await fetch('http://localhost:8000/api/sectors');
			if (response.ok) {
				const data = (await response.json()) as Sector[];
				setSectors(data);
			}
		} catch (err) {
			console.error('Failed to fetch sectors:', err);
		}
	};

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
					email,
					password,
					full_name: name
				})
			});

			if (response.ok) {
				const userData = (await response.json()) as User;
				setUser(userData);
				setCurrentPage('onboarding');
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
			const formData = new FormData();
			formData.append('username', email);
			formData.append('password', password);

			const response = await fetch('http://localhost:8000/api/users/login', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				const userData = (await response.json()) as User;
				setUser(userData);
				setCurrentPage('onboarding');
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

	const handleSectorChange = async (sectorId: string): Promise<void> => {
		setSelectedSector(sectorId);
		setSelectedSpecialization('');

		if (sectorId) {
			try {
				const response = await fetch(
					`http://localhost:8000/api/sectors/${sectorId}/specializations`
				);
				if (response.ok) {
					const data = (await response.json()) as Specialization[];
					setSpecializations(data);
				}
			} catch (err) {
				const error = err instanceof Error ? err : new Error('Unknown error');
				setError('Failed to load specializations: ' + error.message);
			}
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

	const containerStyle = {
		minHeight: '100vh',
		background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
		padding: '2rem',
		fontFamily: 'system-ui, -apple-system, sans-serif'
	};

	const cardStyle = {
		maxWidth: '600px',
		margin: '0 auto',
		backgroundColor: 'white',
		borderRadius: '20px',
		padding: '3rem',
		boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
	};

	const inputStyle = {
		width: '100%',
		padding: '1rem',
		borderRadius: '10px',
		border: '2px solid #e5e7eb',
		fontSize: '1rem',
		marginBottom: '1rem'
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
		width: '100%',
		marginBottom: '1rem'
	};

	// Login/Register Page
	if (currentPage === 'login') {
		return (
			<div style={containerStyle}>
				<div style={cardStyle}>
					<h1
						style={{
							textAlign: 'center',
							marginBottom: '2rem',
							color: '#333'
						}}>
						🚀 Future of Work Platform
					</h1>

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

					<div style={{ marginBottom: '2rem' }}>
						<h2>Register</h2>
						<form onSubmit={handleRegister}>
							<input
								type='text'
								placeholder='Full Name'
								value={name}
								onChange={(e) => setName(e.target.value)}
								style={inputStyle}
								required
							/>
							<input
								type='email'
								placeholder='Email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								style={inputStyle}
								required
							/>
							<input
								type='password'
								placeholder='Password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								style={inputStyle}
								required
							/>
							<button type='submit' style={buttonStyle} disabled={loading}>
								{loading ? '⏳ Registering...' : '📝 Register'}
							</button>
						</form>
					</div>

					<div>
						<h2>Or Login</h2>
						<form onSubmit={handleLogin}>
							<button type='submit' style={buttonStyle} disabled={loading}>
								{loading
									? '⏳ Logging in...'
									: '🔐 Login with same credentials'}
							</button>
						</form>
					</div>
				</div>
			</div>
		);
	}

	// Onboarding Page
	if (currentPage === 'onboarding') {
		return (
			<div style={containerStyle}>
				<div style={cardStyle}>
					<h1
						style={{
							textAlign: 'center',
							marginBottom: '2rem',
							color: '#333'
						}}>
						🎯 Welcome, {user?.full_name || user?.email}!
					</h1>

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

					<div style={{ marginBottom: '2rem' }}>
						<label
							style={{
								display: 'block',
								marginBottom: '0.5rem',
								fontWeight: '600'
							}}>
							🏭 Select your sector:
						</label>
						<select
							value={selectedSector}
							onChange={(e) => handleSectorChange(e.target.value)}
							style={inputStyle}>
							<option value=''>Choose a sector...</option>
							{sectors.map((sector) => (
								<option key={sector.id} value={sector.id}>
									{sector.name}
								</option>
							))}
						</select>
					</div>

					{selectedSector && (
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
				</div>
			</div>
		);
	}

	// Dashboard Page
	if (currentPage === 'dashboard') {
		return (
			<div style={containerStyle}>
				<div style={cardStyle}>
					<h1
						style={{
							textAlign: 'center',
							marginBottom: '2rem',
							color: '#333'
						}}>
						📊 Dashboard - {user?.full_name || user?.email}
					</h1>

					<div
						style={{
							backgroundColor: '#f0f9ff',
							padding: '1.5rem',
							borderRadius: '15px',
							marginBottom: '2rem',
							border: '2px solid #0284c7'
						}}>
						<h3 style={{ color: '#0284c7', marginBottom: '1rem' }}>
							✅ Your Profile
						</h3>
						<p>
							<strong>Email:</strong> {user?.email}
						</p>
						<p>
							<strong>Name:</strong> {user?.full_name}
						</p>
						<p>
							<strong>Selected Sector:</strong>{' '}
							{
								sectors.find((s) => String(s.id) === String(selectedSector))
									?.name
							}
						</p>
						<p>
							<strong>Selected Specialization:</strong>{' '}
							{
								specializations.find(
									(s) => String(s.id) === String(selectedSpecialization)
								)?.name
							}
						</p>
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
							🎯 Available Quizzes
						</h3>
						<p>
							Total quizzes in database: <strong>{quizzes.length}</strong>
						</p>
						{quizzes.length > 0 && (
							<div>
								<p>
									Sample quiz:{' '}
									<strong>{quizzes[0]?.title || 'Quiz Available'}</strong>
								</p>
								<button
									style={{
										...buttonStyle,
										backgroundColor: '#22c55e',
										width: 'auto',
										marginTop: '1rem'
									}}>
									🚀 Take Quiz
								</button>
							</div>
						)}
					</div>

					<div style={{ textAlign: 'center' }}>
						<button
							onClick={() => {
								setCurrentPage('login');
								setUser(null);
								setEmail('');
								setPassword('');
								setName('');
								setSelectedSector('');
								setSelectedSpecialization('');
								setError('');
							}}
							style={{
								...buttonStyle,
								backgroundColor: '#ef4444',
								width: 'auto'
							}}>
							🚪 Logout
						</button>
					</div>
				</div>
			</div>
		);
	}

	return <></>;
}

export default TestApp;
