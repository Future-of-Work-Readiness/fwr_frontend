import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	BookOpen,
	Zap,
	Target,
	Award,
	TrendingUp,
	Clock,
	LogOut
} from 'lucide-react';
import {
	getCurrentUser,
	logoutUser,
	refreshUserData,
	type FrontendUser
} from '../utils/auth';
import { getSpecializationDetails } from '../utils/hierarchicalApi';

export default function DashboardPage(): JSX.Element {
	const navigate = useNavigate();
	const [specializationName, setSpecializationName] = useState<string | null>(
		null
	);
	const [loading, setLoading] = useState<boolean>(true);
	const [userData, setUserData] = useState<FrontendUser | null>(null);

	// Get current user data
	const initialUser = getCurrentUser();
	const currentUser = userData || initialUser;
	const specializationId = currentUser?.specializationId ?? null;

	// Refresh user data from backend on mount
	useEffect(() => {
		const refreshData = async (): Promise<void> => {
			if (initialUser?.id) {
				const result = await refreshUserData(initialUser.id);
				if (result.success && result.user) {
					setUserData(result.user);
				}
			}
		};
		refreshData();
	}, []);

	// Fetch specialization details from backend
	useEffect(() => {
		const fetchSpecialization = async (): Promise<void> => {
			if (specializationId) {
				try {
					const specData = await getSpecializationDetails(specializationId);
					setSpecializationName(specData.name || 'Loading...');
				} catch (error) {
					console.error('Failed to fetch specialization:', error);
					setSpecializationName('Not specified');
				}
			} else {
				setSpecializationName('Not specified');
			}
			setLoading(false);
		};

		fetchSpecialization();
	}, [specializationId]);

	const handleLogout = (): void => {
		logoutUser();
		navigate('/');
	};

	// Get recommendations based on specialization
	interface Recommendation {
		title: string;
		description: string;
		category: string;
	}

	let currentRecommendation: Recommendation;
	if (specializationName && specializationName !== 'Not specified') {
		currentRecommendation = {
			title: `Advanced ${specializationName} Skills`,
			description: `Continue developing your expertise in ${specializationName}.`,
			category: 'Technical'
		};
	} else {
		currentRecommendation = {
			title: 'Complete Your Profile',
			description:
				'Complete your onboarding to get personalized recommendations.',
			category: 'Setup'
		};
	}
	// Get user scores or use defaults for new users
	const readinessScore = currentUser?.readinessScore || 0;
	const technicalScore = currentUser?.technicalScore || 0;
	const softSkillsScore = currentUser?.softSkillsScore || 0;
	const leadershipScore = currentUser?.leadershipScore || 0;
	const recentActivities = (currentUser?.recentActivity || []) as Array<{
		id: string | number;
		type: string;
		title: string;
		time: string;
		score?: number;
	}>;

	interface QuickAccessCard {
		id: string;
		title: string;
		description: string;
		icon: React.ComponentType<{ className?: string }>;
		color: string;
		onClick: () => void;
	}

	const quickAccessCards: QuickAccessCard[] = [
		{
			id: 'knowledge-test',
			title: 'Knowledge Tests',
			description: 'Test your understanding with comprehensive assessments',
			icon: BookOpen,
			color: 'blue',
			onClick: () => navigate('/test-hub')
		},
		{
			id: 'peer-benchmark',
			title: 'Peer Benchmarking',
			description: 'Compare your scores with peers in your specialization',
			icon: TrendingUp,
			color: 'bg-indigo-500',
			onClick: () => navigate('/peer-benchmark')
		},
		{
			id: 'skill-exercise',
			title: 'Try a Skill-Based Exercise',
			description: 'Practice hands-on skills',
			icon: Zap,
			color: 'bg-green-500',
			onClick: () => navigate('/tests') // Will be updated when skill exercises are created
		}
	];

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
			{/* Background decoration */}
			<div className='absolute inset-0 overflow-hidden pointer-events-none'>
				<div className='absolute -top-40 -right-32 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse'></div>
				<div className='absolute -bottom-32 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse'></div>
			</div>

			<div className='relative z-10 max-w-7xl mx-auto p-4'>
				{/* Header */}
				<div className='mb-8 flex justify-between items-center bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20'>
					<div>
						<h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2'>
							Welcome back, {currentUser?.name}! 👋
						</h1>
						<div className='flex items-center space-x-2 text-gray-600'>
							<Target className='w-5 h-5 text-blue-500' />
							<span className='text-sm font-medium'>
								Specialization:{' '}
								{loading ? 'Loading...' : specializationName || 'Not specified'}
							</span>
						</div>
					</div>
					<button
						onClick={handleLogout}
						className='flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300'>
						<LogOut className='w-5 h-5' />
						<span className='font-medium'>Logout</span>
					</button>
				</div>

				{/* Main Content Grid */}
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					{/* Left Column - Main Content */}
					<div className='lg:col-span-2 space-y-6'>
						{/* Readiness Score Card */}
						<div className='bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20'>
							<div className='flex items-center space-x-3 mb-6'>
								<div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center'>
									<span className='text-white text-2xl'>📊</span>
								</div>
								<h2 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
									Future of Work Readiness Score
								</h2>
							</div>

							<div className='flex items-center justify-center mb-8'>
								<div className='relative w-48 h-48'>
									{/* Outer decorative circle */}
									<div className='absolute inset-0 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 p-4'>
										<svg
											className='w-full h-full transform -rotate-90'
											viewBox='0 0 144 144'>
											{/* Background circle */}
											<circle
												cx='72'
												cy='72'
												r='60'
												stroke='#f1f5f9'
												strokeWidth='12'
												fill='none'
											/>
											{/* Progress circle */}
											<circle
												cx='72'
												cy='72'
												r='60'
												stroke='url(#gradient)'
												strokeWidth='12'
												fill='none'
												strokeLinecap='round'
												strokeDasharray={`${2 * Math.PI * 60}`}
												strokeDashoffset={`${
													2 * Math.PI * 60 * (1 - readinessScore / 100)
												}`}
												className='transition-all duration-2000 ease-out'
											/>
											<defs>
												<linearGradient
													id='gradient'
													x1='0%'
													y1='0%'
													x2='100%'
													y2='0%'>
													<stop offset='0%' stopColor='#3b82f6' />
													<stop offset='100%' stopColor='#8b5cf6' />
												</linearGradient>
											</defs>
										</svg>
									</div>
									<div className='absolute inset-0 flex items-center justify-center'>
										<div className='text-center'>
											<div className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
												{readinessScore}%
											</div>
											<div className='text-sm text-gray-600 font-medium'>
												Future Ready
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className='grid grid-cols-3 gap-6'>
								<div className='text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200'>
									<div className='text-3xl font-bold text-blue-600 mb-1'>
										{technicalScore}%
									</div>
									<div className='text-sm text-blue-700 font-medium'>
										Technical Skills
									</div>
								</div>
								<div className='text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200'>
									<div className='text-3xl font-bold text-green-600 mb-1'>
										{softSkillsScore}%
									</div>
									<div className='text-sm text-green-700 font-medium'>
										Soft Skills
									</div>
								</div>
								<div className='text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200'>
									<div className='text-3xl font-bold text-purple-600 mb-1'>
										{leadershipScore}%
									</div>
									<div className='text-sm text-purple-700 font-medium'>
										Leadership
									</div>
								</div>
							</div>
						</div>

						{/* Recommended Next Step */}
						<div className='bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white'>
							<div className='flex items-center mb-3'>
								<Target className='w-6 h-6 mr-2' />
								<h2 className='text-xl font-semibold'>Recommended Next Step</h2>
							</div>
							<div className='mb-4'>
								<h3 className='text-lg font-semibold mb-2'>
									{currentRecommendation.title}
								</h3>
								<p className='mb-2'>{currentRecommendation.description}</p>
								<span className='inline-block bg-white bg-opacity-20 text-white text-sm px-3 py-1 rounded-full'>
									{currentRecommendation.category} Focus
								</span>
							</div>
							<button
								onClick={() => navigate('/test-hub')}
								className='bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors'>
								Start Test
							</button>
						</div>

						{/* Quick Access Cards */}
						<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
							{quickAccessCards.map((card) => {
								const IconComponent = card.icon;
								return (
									<div
										key={card.id}
										onClick={card.onClick}
										className='bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow'>
										<div
											className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
											<IconComponent className='w-6 h-6 text-white' />
										</div>
										<h3 className='text-lg font-semibold text-slate-800 mb-2'>
											{card.title}
										</h3>
										<p className='text-gray-600 text-sm'>{card.description}</p>
									</div>
								);
							})}
						</div>
					</div>

					{/* Right Column - Sidebar */}
					<div className='space-y-6'>
						{/* Navigation Menu */}
						<div className='bg-white rounded-lg shadow-lg p-6'>
							<h2 className='text-xl font-semibold text-slate-800 mb-4'>
								Quick Navigation
							</h2>
							<nav className='space-y-2'>
								<button
									onClick={() => navigate('/test-hub')}
									className='w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors'>
									<BookOpen className='w-5 h-5 mr-3 text-blue-500' />
									<span>Tests</span>
								</button>
								<button
									onClick={() => navigate('/dashboard')}
									className='w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors'>
									<TrendingUp className='w-5 h-5 mr-3 text-green-500' />
									<span>Skills</span>
								</button>
								<button
									onClick={() => navigate('/goals')}
									className='w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors'>
									<Target className='w-5 h-5 mr-3 text-purple-500' />
									<span>Goals</span>
								</button>
								<button
									onClick={() => navigate('/dashboard')}
									className='w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors'>
									<Award className='w-5 h-5 mr-3 text-orange-500' />
									<span>Badges</span>
								</button>
							</nav>
						</div>

						{/* Recent Activity */}
						<div className='bg-white rounded-lg shadow-lg p-6'>
							<h2 className='text-xl font-semibold text-slate-800 mb-4'>
								Recent Activity
							</h2>
							<div className='space-y-4'>
								{recentActivities.length > 0 ? (
									recentActivities.map((activity) => (
										<div
											key={activity.id}
											className='flex items-start space-x-3'>
											<div className='flex-shrink-0'>
												{activity.type === 'test' && (
													<BookOpen className='w-5 h-5 text-blue-500' />
												)}
												{activity.type === 'badge' && (
													<Award className='w-5 h-5 text-orange-500' />
												)}
											</div>
											<div className='flex-1 min-w-0'>
												<p className='text-sm font-medium text-slate-800'>
													{activity.title}
												</p>
												<div className='flex items-center space-x-2 mt-1'>
													<Clock className='w-4 h-4 text-gray-400' />
													<p className='text-xs text-gray-500'>
														{activity.time}
													</p>
													{activity.score && (
														<span className='text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full'>
															{activity.score}%
														</span>
													)}
												</div>
											</div>
										</div>
									))
								) : (
									<div className='text-center py-8'>
										<Target className='w-12 h-12 text-gray-300 mx-auto mb-3' />
										<p className='text-gray-500 mb-2'>No activity yet</p>
										<p className='text-sm text-gray-400'>
											Start taking tests to see your progress here!
										</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
