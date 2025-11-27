import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/auth';
import WorkingSignUpModal from '../components/WorkingSignUpModal';

interface LoginData {
	email: string;
	password: string;
}

export default function ModernLandingPage(): JSX.Element {
	const [showLogin, setShowLogin] = useState<boolean>(false);
	const [showSignUp, setShowSignUp] = useState<boolean>(false);
	const [loginData, setLoginData] = useState<LoginData>({
		email: '',
		password: ''
	});
	const [loginError, setLoginError] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const navigate = useNavigate();

	const handleGetStarted = (): void => {
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
			const result = await loginUser(loginData.email, loginData.password);

			if (result.success) {
				navigate('/dashboard');
				setShowLogin(false);
				setLoginData({ email: '', password: '' });
			} else {
				setLoginError(result.error || 'Login failed');
			}
		} catch (error) {
			const err = error instanceof Error ? error : new Error('Unknown error');
			setLoginError('Login failed: ' + err.message);
		}

		setIsLoading(false);
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800'>
			{/* Animated Background Elements */}
			<div className='absolute inset-0 overflow-hidden pointer-events-none'>
				<div className='absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob'></div>
				<div className='absolute -bottom-32 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000'></div>
				<div className='absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000'></div>
			</div>

			{/* Navigation */}
			<nav className='relative z-10 backdrop-blur-lg bg-white/10 border-b border-white/20'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between items-center h-16'>
						<div className='flex items-center space-x-2'>
							<div className='w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center'>
								<span className='text-white text-xl font-bold'>🚀</span>
							</div>
							<span className='text-white text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent'>
								Future Ready
							</span>
						</div>
						<div className='flex items-center space-x-4'>
							<button
								onClick={() => setShowLogin(true)}
								className='text-white hover:text-cyan-300 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/10'>
								Sign In
							</button>
							<button
								onClick={handleGetStarted}
								className='bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25'>
								Get Started
							</button>
						</div>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<main className='relative z-10'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
					{/* Hero Content */}
					<div className='text-center mb-20'>
						<div className='inline-flex items-center space-x-2 bg-white/10 backdrop-blur-lg rounded-full px-4 py-2 mb-8 border border-white/20'>
							<span className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></span>
							<span className='text-white text-sm font-medium'>
								New: AI-Powered Career Analysis
							</span>
						</div>

						<h1 className='text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-6 leading-tight'>
							Shape Your
							<br />
							<span className='bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent'>
								Future Today
							</span>
						</h1>

						<p className='text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed'>
							Unlock your potential with AI-driven career assessments,
							personalized learning paths, and real-time industry insights that
							adapt to tomorrow's workforce.
						</p>

						<div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
							<button
								onClick={handleGetStarted}
								className='group relative bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/50'>
								<span className='flex items-center space-x-2'>
									<span>🎯 Start Assessment</span>
									<svg
										className='w-5 h-5 group-hover:translate-x-1 transition-transform'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M13 7l5 5m0 0l-5 5m5-5H6'
										/>
									</svg>
								</span>
							</button>

							<button className='group flex items-center space-x-2 text-white hover:text-cyan-300 px-6 py-4 rounded-xl transition-all duration-300 hover:bg-white/10'>
								<svg
									className='w-6 h-6'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
									/>
								</svg>
								<span className='font-semibold'>Watch Demo</span>
							</button>
						</div>
					</div>

					{/* Features Grid */}
					<div className='grid md:grid-cols-3 gap-8 mb-20'>
						{[
							{
								icon: '🧠',
								title: 'AI-Powered Analysis',
								description:
									'Advanced algorithms analyze your skills, preferences, and market trends to provide personalized career guidance.',
								gradient: 'from-purple-500 to-pink-500'
							},
							{
								icon: '📊',
								title: 'Real-Time Insights',
								description:
									'Stay ahead with live industry data, emerging skill demands, and market opportunities in your field.',
								gradient: 'from-cyan-500 to-blue-500'
							},
							{
								icon: '🎯',
								title: 'Personalized Roadmap',
								description:
									'Get a tailored learning path with milestone tracking and achievement recognition.',
								gradient: 'from-green-500 to-teal-500'
							}
						].map((feature, index) => (
							<div
								key={index}
								className='group relative p-8 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:transform hover:scale-105'>
								<div
									className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
									{feature.icon}
								</div>
								<h3 className='text-xl font-bold text-white mb-4'>
									{feature.title}
								</h3>
								<p className='text-white/70 leading-relaxed'>
									{feature.description}
								</p>

								{/* Hover effect overlay */}
								<div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
							</div>
						))}
					</div>

					{/* Stats Section */}
					<div className='text-center mb-20'>
						<h2 className='text-3xl md:text-4xl font-bold text-white mb-12'>
							Trusted by{' '}
							<span className='bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent'>
								Future Leaders
							</span>
						</h2>

						<div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
							{[
								{ number: '50K+', label: 'Assessments Completed', icon: '🎯' },
								{ number: '95%', label: 'Success Rate', icon: '📈' },
								{ number: '200+', label: 'Career Paths', icon: '🛤️' },
								{ number: '24/7', label: 'AI Support', icon: '🤖' }
							].map((stat, index) => (
								<div key={index} className='group text-center'>
									<div className='text-4xl mb-2 group-hover:scale-110 transition-transform duration-300'>
										{stat.icon}
									</div>
									<div className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2'>
										{stat.number}
									</div>
									<div className='text-white/70 font-medium'>{stat.label}</div>
								</div>
							))}
						</div>
					</div>

					{/* CTA Section */}
					<div className='text-center p-12 rounded-3xl backdrop-blur-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/30'>
						<h2 className='text-3xl md:text-4xl font-bold text-white mb-6'>
							Ready to{' '}
							<span className='bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent'>
								Transform
							</span>{' '}
							Your Career?
						</h2>
						<p className='text-xl text-white/80 mb-8 max-w-2xl mx-auto'>
							Join thousands of professionals who have already discovered their
							ideal career path with our cutting-edge assessment platform.
						</p>
						<button
							onClick={handleGetStarted}
							className='bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/50'>
							🚀 Begin Your Journey - It's Free!
						</button>
					</div>
				</div>
			</main>

			{/* Login Modal */}
			{showLogin && (
				<div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm'>
					<div className='bg-white/95 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl border border-white/20'>
						<div className='flex justify-between items-center mb-6'>
							<h2 className='text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
								🔐 Welcome Back!
							</h2>
							<button
								onClick={() => setShowLogin(false)}
								className='text-gray-400 hover:text-gray-600 text-2xl transition-colors'>
								×
							</button>
						</div>

						{loginError && (
							<div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm'>
								⚠️ {loginError}
							</div>
						)}

						<form onSubmit={handleLogin} className='space-y-4'>
							<div>
								<label className='block text-sm font-semibold text-gray-700 mb-2'>
									📧 Email Address
								</label>
								<input
									type='email'
									name='email'
									value={loginData.email}
									onChange={handleLoginChange}
									required
									className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all'
									placeholder='your@email.com'
								/>
							</div>

							<div>
								<label className='block text-sm font-semibold text-gray-700 mb-2'>
									🔒 Password
								</label>
								<input
									type='password'
									name='password'
									value={loginData.password}
									onChange={handleLoginChange}
									required
									className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all'
									placeholder='••••••••'
								/>
							</div>

							<button
								type='submit'
								disabled={isLoading}
								className='w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'>
								{isLoading ? '⏳ Signing In...' : '🚀 Sign In'}
							</button>
						</form>

						<div className='text-center mt-6 pt-6 border-t border-gray-200'>
							<p className='text-gray-600 text-sm'>
								Don't have an account?{' '}
								<button
									onClick={() => {
										setShowLogin(false);
										setShowSignUp(true);
									}}
									className='text-purple-600 hover:text-purple-700 font-semibold transition-colors'>
									Create one now! 📝
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

			{/* Custom Styles for animations */}
			<style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
		</div>
	);
}
