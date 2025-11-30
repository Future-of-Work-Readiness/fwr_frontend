import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
	ArrowLeft,
	TrendingUp,
	TrendingDown,
	Minus,
	Users,
	Award,
	AlertCircle,
	CheckCircle,
	Target,
	BarChart3
} from 'lucide-react';
import type { PeerBenchmarkData } from '../src/types';
import { API_BASE_URL } from '../utils/api';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';

export default function PeerBenchmarkingPage(): JSX.Element {
	const [benchmarkData, setBenchmarkData] = useState<PeerBenchmarkData | null>(
		null
	);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>('');
	const navigate = useNavigate();

	useEffect(() => {
		loadBenchmarkData();
	}, []);

	const loadBenchmarkData = async (): Promise<void> => {
		const userStr = localStorage.getItem('currentUser');
		if (!userStr) {
			navigate('/');
			return;
		}

		const currentUser = JSON.parse(userStr) as { id: number | string };
		setLoading(true);

		try {
			const response = await fetch(
				`${API_BASE_URL}/users/users/${currentUser.id}/peer-benchmark`
			);
			const result = await response.json();

			if (response.ok && result.success) {
				setBenchmarkData(result.data as PeerBenchmarkData);
			} else {
				setError(result.detail || 'Failed to load peer benchmarking data');
			}
		} catch (err) {
			setError('Failed to connect to server');
		}
		setLoading(false);
	};

	const getStatusIcon = (
		status: 'above' | 'below' | 'average'
	): JSX.Element => {
		if (status === 'above')
			return <TrendingUp className='w-5 h-5 text-[#4CAF50]' />;
		if (status === 'below')
			return <TrendingDown className='w-5 h-5 text-[#DC2626]' />;
		return <Minus className='w-5 h-5 text-[#6b7280]' />;
	};

	const getStatusColor = (status: 'above' | 'below' | 'average'): string => {
		if (status === 'above') return 'bg-[#f0fdf4] border-[#dcfce7]';
		if (status === 'below') return 'bg-[#fef2f2] border-[#fee2e2]';
		return 'bg-[#F7F9FC] border-[#E5E7EB]';
	};

	const getStatusText = (
		status: 'above' | 'below' | 'average',
		difference: number
	): string => {
		if (status === 'above')
			return `${Math.abs(difference).toFixed(1)} points above average`;
		if (status === 'below')
			return `${Math.abs(difference).toFixed(1)} points below average`;
		return 'At average level';
	};

	// Animation variants - gentle and not too fast
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.12,
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
				duration: 0.6,
				ease: 'easeOut' as const
			}
		}
	};

	if (loading) {
		return (
			<div className='min-h-screen bg-[#F7F9FC] flex items-center justify-center'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A7AFE] mx-auto mb-4'></div>
					<p className='text-[#4B5563]'>Loading peer comparison...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='min-h-screen bg-[#F7F9FC] flex flex-col'>
				<Navbar showSkipToDashboard={true} />
				<div className='flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full'>
					<div className='flex items-center gap-3 mb-6'>
						<button
							onClick={() => navigate(-1)}
							className='flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#F7F9FC] text-[#4B5563] border border-[#E5E7EB] rounded-lg transition-colors duration-200'>
							<ArrowLeft className='w-4 h-4' />
							<span className='hidden sm:inline'>Back</span>
						</button>
					</div>
					<motion.div
						className='bg-[#fffbeb] border border-[#fef3c7] rounded-lg p-4 md:p-6'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, ease: 'easeOut' }}>
						<div className='flex items-start space-x-3'>
							<AlertCircle className='w-5 h-5 md:w-6 md:h-6 text-[#EAB308] flex-shrink-0 mt-1' />
							<div>
								<h3 className='font-semibold text-[#d97706] mb-2 text-base md:text-lg'>
									Not Enough Data
								</h3>
								<p className='text-sm md:text-base text-[#d97706]'>{error}</p>
								<p className='text-xs md:text-sm text-[#b45309] mt-2'>
									Complete more quizzes and encourage others in your
									specialization to join!
								</p>
							</div>
						</div>
					</motion.div>
				</div>
				<Footer />
			</div>
		);
	}

	if (!benchmarkData) {
		return (
			<div className='min-h-screen bg-[#F7F9FC] flex flex-col'>
				<Navbar showSkipToDashboard={true} />
				<div className='flex-1 flex items-center justify-center'>
					<div className='text-center'>
						<p className='text-[#4B5563]'>No benchmark data available.</p>
					</div>
				</div>
				<Footer />
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-[#F7F9FC] flex flex-col'>
			{/* Navbar */}
			<Navbar showSkipToDashboard={true} />

			{/* Main Content */}
			<motion.div
				className='flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full'
				initial='hidden'
				animate='visible'
				variants={containerVariants}>
				{/* Header */}
				<motion.div className='mb-6 md:mb-8' variants={itemVariants}>
					<div className='flex items-center gap-3 mb-4 md:mb-6'>
						<button
							onClick={() => navigate(-1)}
							className='flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#F7F9FC] text-[#4B5563] border border-[#E5E7EB] rounded-lg transition-colors duration-200'>
							<ArrowLeft className='w-4 h-4' />
							<span className='hidden sm:inline'>Back</span>
						</button>
						<button
							onClick={() => navigate('/dashboard')}
							className='px-4 py-2 bg-[#3A7AFE] hover:bg-[#2E6AE8] text-white rounded-lg transition-colors duration-200 text-sm md:text-base'>
							Dashboard
						</button>
					</div>

					<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
						<div>
							<h1 className='text-2xl md:text-3xl lg:text-4xl font-bold text-[#1C1C1C] mb-2'>
								Peer Benchmarking
							</h1>
							<p className='text-sm md:text-base text-[#4B5563]'>
								Compare your performance with{' '}
								<span className='font-semibold'>
									{benchmarkData.total_peers}
								</span>{' '}
								peers in{' '}
								<span className='font-semibold'>
									{benchmarkData.specialization_name}
								</span>
							</p>
						</div>
						<div className='flex items-center space-x-2 text-[#4B5563] text-xs md:text-sm'>
							<Users className='w-4 h-4 md:w-5 md:h-5 flex-shrink-0' />
							<span>
								Last updated:{' '}
								{new Date(benchmarkData.last_updated).toLocaleDateString()}
							</span>
						</div>
					</div>
				</motion.div>

				{/* Overall Percentile Card */}
				<motion.div
					className='bg-[#3A7AFE] rounded-xl shadow-sm p-4 md:p-6 mb-6 text-white'
					variants={itemVariants}
					whileHover={{ y: -2, transition: { duration: 0.2 } }}>
					<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
						<div>
							<p className='text-white/80 mb-2 text-sm md:text-base'>
								Your Overall Standing
							</p>
							<h2 className='text-3xl md:text-4xl font-bold mb-2'>
								Top {100 - benchmarkData.overall_percentile}%
							</h2>
							<p className='text-white/80 text-sm md:text-base'>
								You score higher than{' '}
								<span className='font-semibold'>
									{benchmarkData.overall_percentile}%
								</span>{' '}
								of your peers
							</p>
						</div>
						<Award className='w-12 h-12 md:w-16 md:h-16 text-white/30 flex-shrink-0' />
					</div>
				</motion.div>

				{/* Score Comparisons */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8'>
					{benchmarkData.comparisons.map((comparison, index) => (
						<motion.div
							key={index}
							className={`bg-white rounded-xl shadow-sm p-4 md:p-6 border-2 ${getStatusColor(
								comparison.status
							)}`}
							variants={itemVariants}
							initial='hidden'
							animate='visible'
							transition={{ delay: index * 0.1 }}
							whileHover={{ y: -2, transition: { duration: 0.2 } }}>
							<div className='flex items-start justify-between mb-4 gap-2'>
								<div className='flex-1 min-w-0'>
									<h3 className='text-base md:text-lg font-semibold text-[#1C1C1C] mb-1'>
										{comparison.category}
									</h3>
									<p className='text-xs md:text-sm text-[#4B5563]'>
										{getStatusText(comparison.status, comparison.difference)}
									</p>
								</div>
								<div className='flex-shrink-0'>
									{getStatusIcon(comparison.status)}
								</div>
							</div>

							<div className='space-y-3 md:space-y-4'>
								{/* Your Score */}
								<div>
									<div className='flex justify-between items-center mb-2 gap-2'>
										<span className='text-xs md:text-sm font-medium text-[#4B5563]'>
											Your Score
										</span>
										<span className='text-base md:text-lg font-bold text-[#3A7AFE]'>
											{comparison.your_score}%
										</span>
									</div>
									<div className='w-full bg-[#E5E7EB] rounded-full h-2 md:h-3'>
										<div
											className='bg-[#3A7AFE] h-2 md:h-3 rounded-full transition-all duration-500'
											style={{ width: `${comparison.your_score}%` }}
										/>
									</div>
								</div>

								{/* Peer Average */}
								<div>
									<div className='flex justify-between items-center mb-2 gap-2'>
										<span className='text-xs md:text-sm font-medium text-[#4B5563]'>
											Peer Average
										</span>
										<span className='text-base md:text-lg font-bold text-[#4B5563]'>
											{comparison.peer_average}%
										</span>
									</div>
									<div className='w-full bg-[#E5E7EB] rounded-full h-2 md:h-3'>
										<div
											className='bg-[#9ca3af] h-2 md:h-3 rounded-full transition-all duration-500'
											style={{ width: `${comparison.peer_average}%` }}
										/>
									</div>
								</div>

								{/* Percentile */}
								<div className='pt-2 border-t border-[#E5E7EB]'>
									<div className='flex items-center justify-between gap-2'>
										<span className='text-xs md:text-sm text-[#4B5563]'>
											Your Percentile
										</span>
										<span className='text-xs md:text-sm font-semibold text-[#1C1C1C]'>
											{comparison.percentile}th percentile
										</span>
									</div>
								</div>
							</div>
						</motion.div>
					))}
				</div>

				{/* Common Strengths and Gaps */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8'>
					{/* Common Strengths */}
					<motion.div
						className='bg-white rounded-xl shadow-sm p-4 md:p-6 border border-[#E5E7EB]'
						variants={itemVariants}
						whileHover={{ y: -2, transition: { duration: 0.2 } }}>
						<div className='flex items-center space-x-2 mb-3 md:mb-4'>
							<CheckCircle className='w-5 h-5 md:w-6 md:h-6 text-[#4CAF50] flex-shrink-0' />
							<h3 className='text-lg md:text-xl font-semibold text-[#1C1C1C]'>
								Common Strengths
							</h3>
						</div>
						<p className='text-xs md:text-sm text-[#4B5563] mb-3 md:mb-4'>
							Areas where most peers in your specialization excel
						</p>
						{benchmarkData.common_strengths.length > 0 ? (
							<div className='space-y-2 md:space-y-3'>
								{benchmarkData.common_strengths.map((strength, index) => (
									<motion.div
										key={index}
										className='p-3 md:p-4 bg-[#f0fdf4] border border-[#dcfce7] rounded-lg'
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: index * 0.1, duration: 0.4 }}>
										<div className='flex items-start justify-between mb-2 gap-2'>
											<h4 className='font-semibold text-[#16a34a] text-sm md:text-base flex-1'>
												{strength.area}
											</h4>
											<span className='text-base md:text-lg font-bold text-[#4CAF50] flex-shrink-0'>
												{strength.percentage}%
											</span>
										</div>
										<p className='text-xs md:text-sm text-[#15803d]'>
											{strength.description}
										</p>
									</motion.div>
								))}
							</div>
						) : (
							<p className='text-xs md:text-sm text-[#4B5563] italic'>
								No common strengths identified yet.
							</p>
						)}
					</motion.div>

					{/* Common Gaps */}
					<motion.div
						className='bg-white rounded-xl shadow-sm p-4 md:p-6 border border-[#E5E7EB]'
						variants={itemVariants}
						whileHover={{ y: -2, transition: { duration: 0.2 } }}>
						<div className='flex items-center space-x-2 mb-3 md:mb-4'>
							<Target className='w-5 h-5 md:w-6 md:h-6 text-[#EAB308] flex-shrink-0' />
							<h3 className='text-lg md:text-xl font-semibold text-[#1C1C1C]'>
								Common Gaps
							</h3>
						</div>
						<p className='text-xs md:text-sm text-[#4B5563] mb-3 md:mb-4'>
							Areas where most peers need improvement
						</p>
						{benchmarkData.common_gaps.length > 0 ? (
							<div className='space-y-2 md:space-y-3'>
								{benchmarkData.common_gaps.map((gap, index) => (
									<motion.div
										key={index}
										className='p-3 md:p-4 bg-[#fffbeb] border border-[#fef3c7] rounded-lg'
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: index * 0.1, duration: 0.4 }}>
										<div className='flex items-start justify-between mb-2 gap-2'>
											<h4 className='font-semibold text-[#d97706] text-sm md:text-base flex-1'>
												{gap.area}
											</h4>
											<span className='text-base md:text-lg font-bold text-[#EAB308] flex-shrink-0'>
												{gap.percentage}%
											</span>
										</div>
										<p className='text-xs md:text-sm text-[#b45309]'>
											{gap.description}
										</p>
									</motion.div>
								))}
							</div>
						) : (
							<p className='text-xs md:text-sm text-[#4B5563] italic'>
								No common gaps identified yet.
							</p>
						)}
					</motion.div>
				</div>

				{/* Privacy Note */}
				<motion.div
					className='mt-6 md:mt-8 bg-[#F7F9FC] border border-[#E5E7EB] rounded-lg p-4 md:p-6'
					variants={itemVariants}>
					<div className='flex items-start space-x-3'>
						<AlertCircle className='w-4 h-4 md:w-5 md:h-5 text-[#3A7AFE] flex-shrink-0 mt-0.5' />
						<div>
							<h4 className='font-semibold text-[#1C1C1C] mb-1 text-sm md:text-base'>
								Privacy & Data
							</h4>
							<p className='text-xs md:text-sm text-[#4B5563]'>
								All peer comparison data is aggregated and anonymized. Your
								individual performance is never shared with other users.
								Benchmarks are updated regularly based on the latest quiz
								attempts from all users in your specialization.
							</p>
						</div>
					</div>
				</motion.div>

				{/* CTA Button */}
				<motion.div
					className='mt-6 md:mt-8 text-center'
					variants={itemVariants}>
					<motion.button
						onClick={() => navigate('/test-hub')}
						className='bg-[#3A7AFE] hover:bg-[#2E6AE8] text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold transition-colors duration-200 w-full sm:w-auto'
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}>
						<div className='flex items-center justify-center space-x-2'>
							<BarChart3 className='w-4 h-4 md:w-5 md:h-5' />
							<span className='text-sm md:text-base'>
								Take More Quizzes to Improve Your Ranking
							</span>
						</div>
					</motion.button>
				</motion.div>
			</motion.div>

			{/* Footer */}
			<Footer />
		</div>
	);
}
