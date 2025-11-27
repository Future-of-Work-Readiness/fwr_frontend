import React, { useState, useEffect } from 'react';
import type { User, Sector, Specialization, Quiz, FormData } from './types';

type Page = 'landing' | 'register' | 'login' | 'onboarding' | 'dashboard';

function SimpleWorkingApp(): JSX.Element {
	const [currentPage, setCurrentPage] = useState<Page>('landing');
	const [user, setUser] = useState<User | null>(null);
	const [sectors, setSectors] = useState<Sector[]>([]);
	const [specializations, setSpecializations] = useState<Specialization[]>([]);
	const [quizzes, setQuizzes] = useState<Quiz[]>([]);
	const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
	const [error, setError] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);

	// API Base URL
	const API_BASE = import.meta.env.VITE_API_URL;

	useEffect(() => {
		fetchSectors();
		fetchQuizzes();
	}, []);

	const fetchSectors = async (): Promise<void> => {
		try {
			console.log('Fetching sectors...');
			const response = await fetch(`${API_BASE}/sectors`);
			if (response.ok) {
				const data = (await response.json()) as Sector[];
				console.log('Sectors received:', data);
				setSectors(data);
			} else {
				console.error('Failed to fetch sectors:', response.status);
				setError('Failed to fetch sectors');
			}
		} catch (err) {
			console.error('Error fetching sectors:', err);
			setError('Connection error');
		}
	};

	const fetchSpecializations = async (
		sectorId: string | number
	): Promise<void> => {
		try {
			console.log('Fetching specializations for sector:', sectorId);
			const response = await fetch(
				`${API_BASE}/sectors/${sectorId}/specializations`
			);
			if (response.ok) {
				const data = (await response.json()) as Specialization[];
				console.log('Specializations received:', data);
				setSpecializations(data);
			} else {
				console.error('Failed to fetch specializations:', response.status);
			}
		} catch (err) {
			console.error('Error fetching specializations:', err);
		}
	};

	const fetchQuizzes = async (): Promise<void> => {
		try {
			console.log('Fetching quizzes...');
			const response = await fetch(`${API_BASE}/quizzes`);
			if (response.ok) {
				const data = (await response.json()) as Quiz[];
				console.log('Quizzes received:', data);
				setQuizzes(data);
			} else {
				console.error('Failed to fetch quizzes:', response.status);
			}
		} catch (err) {
			console.error('Error fetching quizzes:', err);
		}
	};

	const handleRegister = async (formData: FormData): Promise<void> => {
		setLoading(true);
		setError('');
		try {
			console.log('Registering user:', formData);
			const response = await fetch(`${API_BASE}/users/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (response.ok) {
				const data = (await response.json()) as { user: User };
				console.log('Registration successful:', data);
				setUser(data.user);
				setCurrentPage('onboarding');
			} else {
				const errorData = (await response.json()) as { detail?: string };
				setError(errorData.detail || 'Registration failed');
			}
		} catch (err) {
			console.error('Registration error:', err);
			setError('Connection error');
		}
		setLoading(false);
	};

	const handleLogin = async (
		formData: Pick<FormData, 'email' | 'password'>
	): Promise<void> => {
		setLoading(true);
		setError('');
		try {
			console.log('Logging in user:', formData.email);
			const response = await fetch(`${API_BASE}/users/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (response.ok) {
				const data = (await response.json()) as { user: User };
				console.log('Login successful:', data);
				setUser(data.user);
				setCurrentPage('dashboard');
			} else {
				const errorData = (await response.json()) as { detail?: string };
				setError(errorData.detail || 'Login failed');
			}
		} catch (err) {
			console.error('Login error:', err);
			setError('Connection error');
		}
		setLoading(false);
	};

	const handleSectorSelect = (sector: Sector): void => {
		console.log('Sector selected:', sector);
		setSelectedSector(sector);
		fetchSpecializations(sector.id);
	};

	// Landing Page
	if (currentPage === 'landing') {
		return (
			<div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
				<h1>🚀 Future of Work Readiness Platform</h1>
				<p>Welcome! Please register or login to continue.</p>

				{error && (
					<div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
				)}

				<div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
					<button
						onClick={() => setCurrentPage('register')}
						style={{ padding: '10px 20px', fontSize: '16px' }}>
						Register
					</button>
					<button
						onClick={() => setCurrentPage('login')}
						style={{ padding: '10px 20px', fontSize: '16px' }}>
						Login
					</button>
				</div>

				<div
					style={{
						marginTop: '30px',
						padding: '20px',
						backgroundColor: '#f5f5f5',
						borderRadius: '8px'
					}}>
					<h3>🔧 System Status</h3>
					<p>Sectors loaded: {sectors.length}</p>
					<p>Quizzes loaded: {quizzes.length}</p>
					{sectors.length > 0 && (
						<div>
							<h4>Available Sectors:</h4>
							<ul>
								{sectors.map((sector) => (
									<li key={sector.id}>{sector.name}</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</div>
		);
	}

	// Registration Page
	if (currentPage === 'register') {
		return (
			<div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
				<h2>Register</h2>
				<form
					onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
						e.preventDefault();
						const formData = new FormData(e.currentTarget);
						handleRegister({
							name: formData.get('name') as string,
							email: formData.get('email') as string,
							password: formData.get('password') as string
						});
					}}>
					<div style={{ marginBottom: '10px' }}>
						<input
							name='name'
							placeholder='Full Name'
							required
							style={{ width: '100%', padding: '8px' }}
						/>
					</div>
					<div style={{ marginBottom: '10px' }}>
						<input
							name='email'
							type='email'
							placeholder='Email'
							required
							style={{ width: '100%', padding: '8px' }}
						/>
					</div>
					<div style={{ marginBottom: '10px' }}>
						<input
							name='password'
							type='password'
							placeholder='Password'
							required
							style={{ width: '100%', padding: '8px' }}
						/>
					</div>
					<button
						type='submit'
						disabled={loading}
						style={{ width: '100%', padding: '10px' }}>
						{loading ? 'Registering...' : 'Register'}
					</button>
				</form>
				{error && (
					<div style={{ color: 'red', marginTop: '10px' }}>{error}</div>
				)}
				<button
					onClick={() => setCurrentPage('landing')}
					style={{ marginTop: '10px' }}>
					Back
				</button>
			</div>
		);
	}

	// Login Page
	if (currentPage === 'login') {
		return (
			<div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
				<h2>Login</h2>
				<form
					onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
						e.preventDefault();
						const formData = new FormData(e.currentTarget);
						handleLogin({
							email: formData.get('email') as string,
							password: formData.get('password') as string
						});
					}}>
					<div style={{ marginBottom: '10px' }}>
						<input
							name='email'
							type='email'
							placeholder='Email'
							required
							style={{ width: '100%', padding: '8px' }}
						/>
					</div>
					<div style={{ marginBottom: '10px' }}>
						<input
							name='password'
							type='password'
							placeholder='Password'
							required
							style={{ width: '100%', padding: '8px' }}
						/>
					</div>
					<button
						type='submit'
						disabled={loading}
						style={{ width: '100%', padding: '10px' }}>
						{loading ? 'Logging in...' : 'Login'}
					</button>
				</form>
				{error && (
					<div style={{ color: 'red', marginTop: '10px' }}>{error}</div>
				)}
				<button
					onClick={() => setCurrentPage('landing')}
					style={{ marginTop: '10px' }}>
					Back
				</button>
			</div>
		);
	}

	// Onboarding Page
	if (currentPage === 'onboarding') {
		return (
			<div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
				<h2>Welcome {user?.name}! Choose your path:</h2>

				<h3>Step 1: Select a Sector</h3>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
						gap: '10px',
						marginBottom: '20px'
					}}>
					{sectors.map((sector) => (
						<button
							key={sector.id}
							onClick={() => handleSectorSelect(sector)}
							style={{
								padding: '15px',
								border:
									selectedSector?.id === sector.id
										? '2px solid blue'
										: '1px solid #ccc',
								borderRadius: '8px',
								backgroundColor:
									selectedSector?.id === sector.id ? '#e6f3ff' : 'white'
							}}>
							<strong>{sector.name}</strong>
							<br />
							<small>{sector.description}</small>
						</button>
					))}
				</div>

				{selectedSector && (
					<div>
						<h3>Step 2: Select a Specialization in {selectedSector.name}</h3>
						{specializations.length > 0 ? (
							<div
								style={{
									display: 'grid',
									gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
									gap: '10px',
									marginBottom: '20px'
								}}>
								{specializations.map((spec) => (
									<button
										key={spec.id}
										onClick={() => {
											console.log('Specialization selected:', spec);
											setCurrentPage('dashboard');
										}}
										style={{
											padding: '15px',
											border: '1px solid #ccc',
											borderRadius: '8px',
											backgroundColor: 'white'
										}}>
										<strong>{spec.name}</strong>
										<br />
										<small>{spec.description}</small>
									</button>
								))}
							</div>
						) : (
							<p>Loading specializations...</p>
						)}
					</div>
				)}
			</div>
		);
	}

	// Dashboard Page
	if (currentPage === 'dashboard') {
		return (
			<div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
				<h2>Dashboard - Welcome {user?.name}!</h2>

				<div
					style={{
						marginBottom: '20px',
						padding: '15px',
						backgroundColor: '#f0f8ff',
						borderRadius: '8px'
					}}>
					<h3>Your Profile</h3>
					<p>Email: {user?.email}</p>
					<p>Readiness Score: {user?.readiness_score || 0}</p>
					<p>Technical Score: {user?.technical_score || 0}</p>
					<p>Soft Skills Score: {user?.soft_skills_score || 0}</p>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h3>Available Quizzes ({quizzes.length})</h3>
					{quizzes.length > 0 ? (
						<div style={{ display: 'grid', gap: '10px' }}>
							{quizzes.map((quiz) => (
								<div
									key={quiz.id}
									style={{
										padding: '15px',
										border: '1px solid #ddd',
										borderRadius: '8px'
									}}>
									<h4>{quiz.title}</h4>
									<p>{quiz.description}</p>
									<button
										style={{
											padding: '8px 16px',
											backgroundColor: '#4CAF50',
											color: 'white',
											border: 'none',
											borderRadius: '4px'
										}}>
										Take Quiz
									</button>
								</div>
							))}
						</div>
					) : (
						<p>No quizzes available at the moment.</p>
					)}
				</div>

				<button
					onClick={() => setCurrentPage('landing')}
					style={{ padding: '10px 20px' }}>
					Logout
				</button>
			</div>
		);
	}

	return <div>Loading...</div>;
}

export default SimpleWorkingApp;
