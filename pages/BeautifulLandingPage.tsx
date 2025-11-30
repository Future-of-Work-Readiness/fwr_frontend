import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, type AuthResult } from '../utils/auth';
import WorkingSignUpModal from '../src/components/WorkingSignUpModal';

interface LoginData {
	email: string;
	password: string;
}

export default function BeautifulLandingPage(): JSX.Element {
	const [showLogin, setShowLogin] = useState<boolean>(false);
	const [showSignUp, setShowSignUp] = useState<boolean>(false);
	const [loginData, setLoginData] = useState<LoginData>({
		email: '',
		password: ''
	});
	const [loginError, setLoginError] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const navigate = useNavigate();

	const handleGetStarted = () => {
		setShowSignUp(true);
	};

	const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setLoginData({
			...loginData,
			[e.target.name]: e.target.value
		});
		if (loginError) setLoginError('');
	};

	const handleLogin = async (
		e: React.FormEvent<HTMLFormElement>
	): Promise<void> => {
		e.preventDefault();
		setIsLoading(true);
		setLoginError('');

		try {
			const result: AuthResult = await loginUser(
				loginData.email,
				loginData.password
			);

			if (result.success) {
				navigate('/dashboard');
				setShowLogin(false);
				setLoginData({ email: '', password: '' });
			} else {
				setLoginError(result.error ?? 'Login failed');
			}
		} catch (error) {
			const err = error as Error;
			setLoginError(`Login failed: ${err.message}`);
		}

		setIsLoading(false);
	};

	return (
		<div
			style={{
				minHeight: '100vh',
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				fontFamily: 'system-ui, -apple-system, sans-serif'
			}}>
			{/* Navigation */}
			<nav
				style={{
					padding: '1rem 2rem',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					backgroundColor: 'rgba(255, 255, 255, 0.1)',
					backdropFilter: 'blur(10px)',
					borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
				}}>
				<div
					style={{
						fontSize: '1.5rem',
						fontWeight: 'bold',
						color: 'white'
					}}>
					🚀 Future Ready
				</div>
				<div style={{ display: 'flex', gap: '1rem' }}>
					<button
						onClick={() => setShowLogin(true)}
						style={{
							padding: '0.5rem 1rem',
							backgroundColor: 'transparent',
							color: 'white',
							border: '2px solid white',
							borderRadius: '25px',
							cursor: 'pointer',
							fontWeight: '500',
							transition: 'all 0.3s'
						}}
						onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
							e.currentTarget.style.backgroundColor = 'white';
							e.currentTarget.style.color = '#667eea';
						}}
						onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
							e.currentTarget.style.backgroundColor = 'transparent';
							e.currentTarget.style.color = 'white';
						}}>
						Login
					</button>
				</div>
			</nav>

			<div style={{ padding: '4rem 2rem' }}>
				<div style={{ maxWidth: '1200px', margin: '0 auto' }}>
					{/* Hero Section */}
					<div style={{ textAlign: 'center', marginBottom: '4rem' }}>
						<h1
							style={{
								fontSize: 'clamp(2.5rem, 5vw, 4rem)',
								fontWeight: '800',
								color: 'white',
								marginBottom: '1.5rem',
								textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
							}}>
							Welcome to Your <span style={{ color: '#FFD700' }}>Future</span>{' '}
							🌟
						</h1>
						<p
							style={{
								fontSize: '1.25rem',
								color: 'rgba(255, 255, 255, 0.9)',
								marginBottom: '2rem',
								maxWidth: '600px',
								margin: '0 auto 2rem auto',
								lineHeight: '1.6'
							}}>
							Discover your career potential with our comprehensive readiness
							assessment. Get personalized insights and build the skills for
							tomorrow's workplace.
						</p>
						<button
							onClick={handleGetStarted}
							style={{
								padding: '1rem 2rem',
								fontSize: '1.125rem',
								fontWeight: 'bold',
								color: '#667eea',
								backgroundColor: 'white',
								border: 'none',
								borderRadius: '50px',
								cursor: 'pointer',
								boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
								transition: 'all 0.3s',
								display: 'inline-flex',
								alignItems: 'center',
								gap: '0.5rem'
							}}
							onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
								e.currentTarget.style.transform = 'translateY(-2px)';
								e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.3)';
							}}
							onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
								e.currentTarget.style.transform = 'translateY(0)';
								e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
							}}>
							🎯 Get Started Free
						</button>
					</div>

					{/* Features Grid */}
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
							gap: '2rem',
							marginBottom: '4rem'
						}}>
						{[
							{
								icon: '🎯',
								title: 'Skills Assessment',
								description:
									'Comprehensive evaluation of your technical and soft skills to identify strengths and growth areas.'
							},
							{
								icon: '📊',
								title: 'Career Insights',
								description:
									'Get personalized recommendations based on industry trends and your unique profile.'
							},
							{
								icon: '🚀',
								title: 'Future Ready',
								description:
									"Build the skills that matter most for tomorrow's job market and stay ahead of the curve."
							},
							{
								icon: '🏆',
								title: 'Track Progress',
								description:
									'Monitor your development journey with detailed analytics and achievement milestones.'
							}
						].map((feature, index) => (
							<div
								key={index}
								style={{
									backgroundColor: 'rgba(255, 255, 255, 0.1)',
									backdropFilter: 'blur(10px)',
									border: '1px solid rgba(255, 255, 255, 0.2)',
									borderRadius: '20px',
									padding: '2rem',
									textAlign: 'center',
									transition: 'all 0.3s',
									cursor: 'pointer'
								}}
								onMouseOver={(e) => {
									e.currentTarget.style.transform = 'translateY(-5px)';
									e.currentTarget.style.backgroundColor =
										'rgba(255, 255, 255, 0.2)';
								}}
								onMouseOut={(e) => {
									e.currentTarget.style.transform = 'translateY(0)';
									e.currentTarget.style.backgroundColor =
										'rgba(255, 255, 255, 0.1)';
								}}>
								<div
									style={{
										fontSize: '3rem',
										marginBottom: '1rem',
										filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
									}}>
									{feature.icon}
								</div>
								<h3
									style={{
										fontSize: '1.5rem',
										fontWeight: 'bold',
										color: 'white',
										marginBottom: '1rem'
									}}>
									{feature.title}
								</h3>
								<p
									style={{
										color: 'rgba(255, 255, 255, 0.8)',
										lineHeight: '1.6'
									}}>
									{feature.description}
								</p>
							</div>
						))}
					</div>

					{/* Stats Section */}
					<div
						style={{
							backgroundColor: 'rgba(255, 255, 255, 0.1)',
							backdropFilter: 'blur(10px)',
							border: '1px solid rgba(255, 255, 255, 0.2)',
							borderRadius: '20px',
							padding: '3rem',
							textAlign: 'center'
						}}>
						<h2
							style={{
								fontSize: '2rem',
								fontWeight: 'bold',
								color: 'white',
								marginBottom: '2rem'
							}}>
							Join Thousands of Future-Ready Professionals 🌍
						</h2>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
								gap: '2rem'
							}}>
							{[
								{ number: '10K+', label: 'Assessments Completed' },
								{ number: '95%', label: 'Career Satisfaction' },
								{ number: '50+', label: 'Industry Sectors' },
								{ number: '24/7', label: 'Learning Support' }
							].map((stat, index) => (
								<div key={index}>
									<div
										style={{
											fontSize: '3rem',
											fontWeight: 'bold',
											color: '#FFD700',
											marginBottom: '0.5rem'
										}}>
										{stat.number}
									</div>
									<div
										style={{
											color: 'rgba(255, 255, 255, 0.8)',
											fontSize: '1.125rem'
										}}>
										{stat.label}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Login Modal */}
			{showLogin && (
				<div
					style={{
						position: 'fixed',
						inset: 0,
						backgroundColor: 'rgba(0, 0, 0, 0.7)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						zIndex: 1000,
						backdropFilter: 'blur(5px)'
					}}>
					<div
						style={{
							backgroundColor: 'white',
							borderRadius: '20px',
							padding: '2rem',
							width: '100%',
							maxWidth: '400px',
							margin: '2rem',
							boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
						}}>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								marginBottom: '2rem'
							}}>
							<h2
								style={{
									fontSize: '1.5rem',
									fontWeight: 'bold',
									color: '#1f2937',
									margin: 0
								}}>
								🔐 Welcome Back!
							</h2>
							<button
								onClick={() => setShowLogin(false)}
								style={{
									background: 'none',
									border: 'none',
									fontSize: '1.5rem',
									cursor: 'pointer',
									color: '#6b7280'
								}}>
								×
							</button>
						</div>

						{loginError && (
							<div
								style={{
									backgroundColor: '#fee2e2',
									color: '#dc2626',
									padding: '0.75rem',
									borderRadius: '10px',
									marginBottom: '1rem',
									fontSize: '0.875rem'
								}}>
								⚠️ {loginError}
							</div>
						)}

						<form onSubmit={handleLogin}>
							<div style={{ marginBottom: '1rem' }}>
								<label
									style={{
										display: 'block',
										fontSize: '0.875rem',
										fontWeight: '500',
										color: '#374151',
										marginBottom: '0.5rem'
									}}>
									📧 Email
								</label>
								<input
									type='email'
									name='email'
									value={loginData.email}
									onChange={handleLoginChange}
									required
									style={{
										width: '100%',
										padding: '0.75rem',
										border: '2px solid #e5e7eb',
										borderRadius: '10px',
										fontSize: '1rem',
										transition: 'border-color 0.2s',
										boxSizing: 'border-box'
									}}
									onFocus={(e) => (e.target.style.borderColor = '#667eea')}
									onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
								/>
							</div>

							<div style={{ marginBottom: '1.5rem' }}>
								<label
									style={{
										display: 'block',
										fontSize: '0.875rem',
										fontWeight: '500',
										color: '#374151',
										marginBottom: '0.5rem'
									}}>
									🔒 Password
								</label>
								<input
									type='password'
									name='password'
									value={loginData.password}
									onChange={handleLoginChange}
									required
									style={{
										width: '100%',
										padding: '0.75rem',
										border: '2px solid #e5e7eb',
										borderRadius: '10px',
										fontSize: '1rem',
										transition: 'border-color 0.2s',
										boxSizing: 'border-box'
									}}
									onFocus={(e) => (e.target.style.borderColor = '#667eea')}
									onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
								/>
							</div>

							<button
								type='submit'
								disabled={isLoading}
								style={{
									width: '100%',
									padding: '0.75rem',
									backgroundColor: isLoading ? '#9ca3af' : '#667eea',
									color: 'white',
									border: 'none',
									borderRadius: '10px',
									fontSize: '1rem',
									fontWeight: '600',
									cursor: isLoading ? 'not-allowed' : 'pointer',
									transition: 'background-color 0.2s'
								}}>
								{isLoading ? '⏳ Signing In...' : '🚀 Sign In'}
							</button>
						</form>

						<div
							style={{
								textAlign: 'center',
								marginTop: '1.5rem',
								paddingTop: '1.5rem',
								borderTop: '1px solid #e5e7eb'
							}}>
							<p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
								Don't have an account?{' '}
								<button
									onClick={() => {
										setShowLogin(false);
										setShowSignUp(true);
									}}
									style={{
										background: 'none',
										border: 'none',
										color: '#667eea',
										cursor: 'pointer',
										fontWeight: '600'
									}}>
									Sign up here! 📝
								</button>
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Sign Up Modal */}
			{showSignUp && (
				<WorkingSignUpModal
					onClose={() => setShowSignUp(false)}
					onSuccess={() => {
						setShowSignUp(false);
						navigate('/onboarding');
					}}
				/>
			)}
		</div>
	);
}
