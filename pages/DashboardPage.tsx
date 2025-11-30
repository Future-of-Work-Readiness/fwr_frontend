import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
	BookOpen,
	Zap,
	Target,
	Award,
	TrendingUp,
	Clock,
	LogOut,
	BarChart3,
	Users,
	CheckCircle2,
	Loader2
} from 'lucide-react';
import {
	getCurrentUser,
	logoutUser,
	refreshUserData,
	type FrontendUser
} from '../utils/auth';
import { getSpecializationDetails } from '../utils/hierarchicalApi';
import { showToast } from '../src/lib/toastConfig';

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
		showToast('success', 'Logged out successfully');
		navigate('/');
	};

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2
			}
		}
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
				ease: 'easeOut' as const
			}
		}
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
			color: 'bg-[#3A7AFE]',
			onClick: () => navigate('/test-hub')
		},
		{
			id: 'peer-benchmark',
			title: 'Peer Benchmarking',
			description: 'Compare your scores with peers in your specialization',
			icon: TrendingUp,
			color: 'bg-[#3A7AFE]',
			onClick: () => navigate('/peer-benchmark')
		},
		{
			id: 'goals',
			title: 'Set Goals',
			description: 'Track your learning objectives and progress',
			icon: Target,
			color: 'bg-[#4CAF50]',
			onClick: () => navigate('/goals')
		}
	];

	return (
		<motion.div
			className='min-h-screen bg-white'
			initial='hidden'
			animate='visible'
			variants={containerVariants}>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12'>
				{/* Header */}
				<motion.div
					className='mb-6 md:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-xl p-4 md:p-6 shadow-sm border border-[#E5E7EB]'
					variants={itemVariants}>
					<div className='flex-1'>
						<h1 className='text-2xl md:text-3xl lg:text-4xl font-bold text-[#1C1C1C] mb-2'>
							Welcome back, {currentUser?.name || 'User'}!
						</h1>
						<div className='flex items-center space-x-2 text-[#4B5563]'>
							<Target className='w-4 h-4 md:w-5 md:h-5 text-[#3A7AFE] flex-shrink-0' />
							<span className='text-xs md:text-sm font-medium'>
								Specialization:{' '}
								{loading ? (
									<span className='inline-flex items-center'>
										<Loader2 className='w-3 h-3 animate-spin mr-1' />
										Loading...
									</span>
								) : (
									specializationName || 'Not specified'
								)}
							</span>
						</div>
					</div>
					<button
						onClick={handleLogout}
						className='flex items-center space-x-2 px-4 py-2 text-[#4B5563] hover:text-[#DC2626] hover:bg-[#fef2f2] rounded-lg transition-colors duration-200 w-full sm:w-auto justify-center'>
						<LogOut className='w-4 h-4 md:w-5 md:h-5' />
						<span className='font-medium text-sm md:text-base'>Logout</span>
					</button>
				</motion.div>

				{/* Main Content Grid */}
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6'>
					{/* Left Column - Main Content */}
					<div className='lg:col-span-2 space-y-4 md:space-y-6'>
						{/* Readiness Score Card */}
						<motion.div
							className='bg-white rounded-xl shadow-sm p-6 md:p-8 border border-[#E5E7EB]'
							variants={itemVariants}>
							<div className='flex items-center space-x-3 mb-6'>
								<div className='w-10 h-10 md:w-12 md:h-12 bg-[#3A7AFE] rounded-lg flex items-center justify-center'>
									<BarChart3 className='w-5 h-5 md:w-6 md:h-6 text-white' />
								</div>
								<h2 className='text-xl md:text-2xl font-semibold text-[#1C1C1C]'>
									Future of Work Readiness Score
								</h2>
							</div>

							<div className='flex items-center justify-center mb-6 md:mb-8'>
								<motion.div
									className='relative w-40 h-40 md:w-48 md:h-48'
									initial={{ scale: 0.8, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{ duration: 0.6, ease: 'easeOut' }}>
									{/* Outer decorative circle */}
									<div className='absolute inset-0 rounded-full bg-[#F7F9FC] p-4'>
										<svg
											className='w-full h-full transform -rotate-90'
											viewBox='0 0 144 144'>
											{/* Background circle */}
											<circle
												cx='72'
												cy='72'
												r='60'
												stroke='#E5E7EB'
												strokeWidth='12'
												fill='none'
											/>
											{/* Progress circle */}
											<motion.circle
												cx='72'
												cy='72'
												r='60'
												stroke='#3A7AFE'
												strokeWidth='12'
												fill='none'
												strokeLinecap='round'
												strokeDasharray={`${2 * Math.PI * 60}`}
												initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
												animate={{
													strokeDashoffset:
														2 * Math.PI * 60 * (1 - readinessScore / 100)
												}}
												transition={{ duration: 1, ease: 'easeOut' }}
											/>
										</svg>
									</div>
									<div className='absolute inset-0 flex items-center justify-center'>
										<div className='text-center'>
											<motion.div
												className='text-3xl md:text-4xl font-bold text-[#3A7AFE]'
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												transition={{ delay: 0.3, duration: 0.4 }}>
												{readinessScore}%
											</motion.div>
											<div className='text-xs md:text-sm text-[#4B5563] font-medium mt-1'>
												Future Ready
											</div>
										</div>
									</div>
								</motion.div>
							</div>

							<div className='grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4'>
								<motion.div
									className='text-center p-4 rounded-xl bg-[#F7F9FC] border border-[#E5E7EB]'
									variants={itemVariants}
									whileHover={{ y: -2, scale: 1.02 }}>
									<div className='text-xl md:text-2xl lg:text-3xl font-bold text-[#3A7AFE] mb-1'>
										{technicalScore}%
									</div>
									<div className='text-xs md:text-sm text-[#4B5563] font-medium'>
										Technical Skills
									</div>
								</motion.div>
								<motion.div
									className='text-center p-4 rounded-xl bg-[#f0fdf4] border border-[#dcfce7]'
									variants={itemVariants}
									whileHover={{ y: -2, scale: 1.02 }}>
									<div className='text-xl md:text-2xl lg:text-3xl font-bold text-[#4CAF50] mb-1'>
										{softSkillsScore}%
									</div>
									<div className='text-xs md:text-sm text-[#16a34a] font-medium'>
										Soft Skills
									</div>
								</motion.div>
								<motion.div
									className='text-center p-4 rounded-xl bg-[#F7F9FC] border border-[#E5E7EB]'
									variants={itemVariants}
									whileHover={{ y: -2, scale: 1.02 }}>
									<div className='text-xl md:text-2xl lg:text-3xl font-bold text-[#3A7AFE] mb-1'>
										{leadershipScore}%
									</div>
									<div className='text-xs md:text-sm text-[#4B5563] font-medium'>
										Leadership
									</div>
								</motion.div>
							</div>
						</motion.div>

						{/* Recommended Next Step */}
						<motion.div
							className='bg-[#3A7AFE] rounded-xl shadow-sm p-6 text-white'
							variants={itemVariants}
							whileHover={{ scale: 1.01 }}>
							<div className='flex items-center mb-3'>
								<Target className='w-5 h-5 md:w-6 md:h-6 mr-2' />
								<h2 className='text-lg md:text-xl font-semibold'>
									Recommended Next Step
								</h2>
							</div>
							<div className='mb-4'>
								<h3 className='text-base md:text-lg font-semibold mb-2'>
									{currentRecommendation.title}
								</h3>
								<p className='mb-2 opacity-90 text-sm md:text-base'>
									{currentRecommendation.description}
								</p>
								<span className='inline-block bg-white/20 text-white text-xs md:text-sm px-3 py-1 rounded-full'>
									{currentRecommendation.category} Focus
								</span>
							</div>
							<button
								onClick={() => navigate('/test-hub')}
								className='bg-white text-[#3A7AFE] px-4 py-2 rounded-lg font-semibold hover:bg-[#F7F9FC] transition-colors duration-200 text-sm md:text-base'>
								Start Test
							</button>
						</motion.div>

						{/* Quick Access Cards */}
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
							{quickAccessCards.map((card, index) => {
								const IconComponent = card.icon;
								return (
									<motion.div
										key={card.id}
										onClick={card.onClick}
										className='bg-white rounded-xl shadow-sm p-5 md:p-6 cursor-pointer hover:shadow-md transition-shadow duration-200 border border-[#E5E7EB]'
										variants={itemVariants}
										initial='hidden'
										animate='visible'
										transition={{ delay: index * 0.1 }}
										whileHover={{ y: -4, scale: 1.02 }}
										whileTap={{ scale: 0.98 }}>
										<div
											className={`${card.color} w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mb-3 md:mb-4`}>
											<IconComponent className='w-5 h-5 md:w-6 md:h-6 text-white' />
										</div>
										<h3 className='text-base md:text-lg font-semibold text-[#1C1C1C] mb-2'>
											{card.title}
										</h3>
										<p className='text-[#4B5563] text-xs md:text-sm'>
											{card.description}
										</p>
									</motion.div>
								);
							})}
						</div>
					</div>

					{/* Right Column - Sidebar */}
					<div className='space-y-4 md:space-y-6'>
						{/* Navigation Menu */}
						<motion.div
							className='bg-white rounded-xl shadow-sm p-5 md:p-6 border border-[#E5E7EB]'
							variants={itemVariants}>
							<h2 className='text-lg md:text-xl font-semibold text-[#1C1C1C] mb-4'>
								Quick Navigation
							</h2>
							<nav className='space-y-2'>
								<motion.button
									onClick={() => navigate('/test-hub')}
									className='w-full flex items-center px-4 py-3 text-left hover:bg-[#F7F9FC] rounded-lg transition-colors duration-200 text-[#4B5563]'
									whileHover={{ x: 4 }}
									transition={{ duration: 0.2 }}>
									<BookOpen className='w-4 h-4 md:w-5 md:h-5 mr-3 text-[#3A7AFE] flex-shrink-0' />
									<span className='text-sm md:text-base'>Tests</span>
								</motion.button>
								<motion.button
									onClick={() => navigate('/peer-benchmark')}
									className='w-full flex items-center px-4 py-3 text-left hover:bg-[#F7F9FC] rounded-lg transition-colors duration-200 text-[#4B5563]'
									whileHover={{ x: 4 }}
									transition={{ duration: 0.2 }}>
									<TrendingUp className='w-4 h-4 md:w-5 md:h-5 mr-3 text-[#4CAF50] flex-shrink-0' />
									<span className='text-sm md:text-base'>Benchmarking</span>
								</motion.button>
								<motion.button
									onClick={() => navigate('/goals')}
									className='w-full flex items-center px-4 py-3 text-left hover:bg-[#F7F9FC] rounded-lg transition-colors duration-200 text-[#4B5563]'
									whileHover={{ x: 4 }}
									transition={{ duration: 0.2 }}>
									<Target className='w-4 h-4 md:w-5 md:h-5 mr-3 text-[#3A7AFE] flex-shrink-0' />
									<span className='text-sm md:text-base'>Goals</span>
								</motion.button>
								<motion.button
									onClick={() => navigate('/test-results')}
									className='w-full flex items-center px-4 py-3 text-left hover:bg-[#F7F9FC] rounded-lg transition-colors duration-200 text-[#4B5563]'
									whileHover={{ x: 4 }}
									transition={{ duration: 0.2 }}>
									<Award className='w-4 h-4 md:w-5 md:h-5 mr-3 text-[#EAB308] flex-shrink-0' />
									<span className='text-sm md:text-base'>Results</span>
								</motion.button>
							</nav>
						</motion.div>

						{/* Recent Activity */}
						<motion.div
							className='bg-white rounded-xl shadow-sm p-5 md:p-6 border border-[#E5E7EB]'
							variants={itemVariants}>
							<h2 className='text-lg md:text-xl font-semibold text-[#1C1C1C] mb-4'>
								Recent Activity
							</h2>
							<div className='space-y-3 md:space-y-4'>
								{recentActivities.length > 0 ? (
									recentActivities.map((activity, index) => (
										<motion.div
											key={activity.id}
											className='flex items-start space-x-3'
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: index * 0.05 }}>
											<div className='flex-shrink-0 mt-0.5'>
												{activity.type === 'test' && (
													<BookOpen className='w-4 h-4 md:w-5 md:h-5 text-[#3A7AFE]' />
												)}
												{activity.type === 'badge' && (
													<Award className='w-4 h-4 md:w-5 md:h-5 text-[#EAB308]' />
												)}
												{!activity.type && (
													<CheckCircle2 className='w-4 h-4 md:w-5 md:h-5 text-[#4CAF50]' />
												)}
											</div>
											<div className='flex-1 min-w-0'>
												<p className='text-xs md:text-sm font-medium text-[#1C1C1C]'>
													{activity.title}
												</p>
												<div className='flex items-center flex-wrap gap-2 mt-1'>
													<Clock className='w-3 h-3 md:w-4 md:h-4 text-[#9ca3af]' />
													<p className='text-xs text-[#6b7280]'>
														{activity.time}
													</p>
													{activity.score && (
														<span className='text-xs bg-[#f0fdf4] text-[#16a34a] px-2 py-0.5 rounded-full'>
															{activity.score}%
														</span>
													)}
												</div>
											</div>
										</motion.div>
									))
								) : (
									<motion.div
										className='text-center py-6 md:py-8'
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.3 }}>
										<Target className='w-10 h-10 md:w-12 md:h-12 text-[#d1d5db] mx-auto mb-3' />
										<p className='text-[#4B5563] mb-2 text-sm md:text-base'>
											No activity yet
										</p>
										<p className='text-xs md:text-sm text-[#9ca3af]'>
											Start taking tests to see your progress here!
										</p>
									</motion.div>
								)}
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
