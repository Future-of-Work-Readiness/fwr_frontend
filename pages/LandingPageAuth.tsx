import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../utils/auth';

export default function LandingPageAuth(): JSX.Element {
	const navigate = useNavigate();
	const currentUser = getCurrentUser();

	const handleLogout = () => {
		logoutUser();
		navigate('/');
	};

	const handleStartOnboarding = () => {
		navigate('/onboarding');
	};

	const handleGoToDashboard = () => {
		navigate('/dashboard');
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
			{/* Animated Background Elements */}
			<div className='absolute inset-0 overflow-hidden pointer-events-none'>
				<div className='absolute -top-40 -right-32 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse'></div>
				<div className='absolute -bottom-32 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse'></div>
				<div className='absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse'></div>
			</div>

			{/* Header */}
			<header className='relative z-10 bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-100'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between items-center h-16'>
						<div className='flex items-center space-x-3'>
							<div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center'>
								<span className='text-white text-xl font-bold'>🚀</span>
							</div>
							<span className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
								Future Work Readiness
							</span>
						</div>

						<div className='flex items-center space-x-4'>
							<span className='text-gray-600 font-medium'>
								Welcome, {currentUser?.name || 'User'}!
							</span>
							<button
								onClick={handleLogout}
								className='flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300'>
								<span>🔓</span>
								<span className='font-medium'>Logout</span>
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				{/* Hero Section */}
				<div className='text-center mb-16'>
					<div className='inline-flex items-center space-x-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 mb-8'>
						<div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
						<span className='text-green-700 text-sm font-semibold'>
							Successfully Logged In
						</span>
					</div>

					<h1 className='text-4xl md:text-6xl font-bold mb-6'>
						<span className='bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
							Welcome to Your Future
						</span>
					</h1>

					<p className='text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed'>
						Ready to discover your career potential? Let's start your journey
						with a comprehensive assessment that will unlock personalized
						insights and recommendations.
					</p>

					<div className='flex flex-col sm:flex-row gap-6 justify-center items-center'>
						<button
							onClick={handleStartOnboarding}
							className='group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2'>
							<span>🎯 Start Your Assessment</span>
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
						</button>

						<button
							onClick={handleGoToDashboard}
							className='group bg-white text-gray-700 px-8 py-4 rounded-xl font-bold text-lg border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600 transition-all duration-300 flex items-center space-x-2'>
							<span>📊 View Dashboard</span>
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
						</button>
					</div>
				</div>

				{/* Features Section */}
				<div className='grid md:grid-cols-3 gap-8 mb-16'>
					{[
						{
							icon: '🧠',
							title: 'Assessment',
							description:
								'Complete your comprehensive career readiness assessment to understand your strengths and identify growth opportunities.',
							action: 'Begin Assessment',
							onClick: handleStartOnboarding,
							gradient: 'from-blue-500 to-cyan-500'
						},
						{
							icon: '📊',
							title: 'Analytics',
							description:
								'View detailed insights about your skills, track your progress, and monitor your career development journey.',
							action: 'View Dashboard',
							onClick: handleGoToDashboard,
							gradient: 'from-purple-500 to-pink-500'
						},
						{
							icon: '🎯',
							title: 'Personalization',
							description:
								'Get tailored recommendations and learning paths based on your unique profile and career aspirations.',
							action: 'Start Onboarding',
							onClick: handleStartOnboarding,
							gradient: 'from-green-500 to-blue-500'
						}
					].map((feature, index) => (
						<div
							key={index}
							className='group bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105 cursor-pointer'
							onClick={feature.onClick}>
							<div
								className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
								{feature.icon}
							</div>
							<h3 className='text-2xl font-bold text-gray-800 mb-4'>
								{feature.title}
							</h3>
							<p className='text-gray-600 mb-6 leading-relaxed'>
								{feature.description}
							</p>
							<button
								className={`w-full bg-gradient-to-r ${feature.gradient} text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform group-hover:scale-105 transition-all duration-300`}>
								{feature.action}
							</button>
						</div>
					))}
				</div>

				{/* Progress Section */}
				<div className='bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/20 text-center'>
					<h2 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6'>
						Your Journey Starts Here
					</h2>

					<div className='flex items-center justify-center space-x-8 mb-8'>
						<div className='flex flex-col items-center'>
							<div className='w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2'>
								✓
							</div>
							<span className='text-sm font-medium text-gray-700'>
								Account Created
							</span>
						</div>

						<div className='w-16 h-1 bg-gradient-to-r from-green-500 to-gray-300 rounded-full'></div>

						<div className='flex flex-col items-center'>
							<div className='w-12 h-12 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2'>
								1
							</div>
							<span className='text-sm font-medium text-gray-700'>
								Assessment
							</span>
						</div>

						<div className='w-16 h-1 bg-gray-300 rounded-full'></div>

						<div className='flex flex-col items-center'>
							<div className='w-12 h-12 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2'>
								2
							</div>
							<span className='text-sm font-medium text-gray-700'>
								Dashboard
							</span>
						</div>
					</div>

					<p className='text-gray-600 text-lg mb-6'>
						Complete your assessment to unlock personalized insights and start
						building your future-ready career.
					</p>

					<button
						onClick={handleStartOnboarding}
						className='bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg'>
						🚀 Continue Your Journey
					</button>
				</div>
			</main>
		</div>
	);
}
