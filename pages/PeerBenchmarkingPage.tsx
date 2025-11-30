import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
				`${API_BASE_URL}/users/${currentUser.id}/peer-benchmark`
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
			<div className='min-h-screen bg-[#F7F9FC] p-4'>
				<div className='max-w-4xl mx-auto'>
					<button
						onClick={() => navigate('/dashboard')}
						className='flex items-center text-[#4B5563] hover:text-[#3A7AFE] mb-6 transition-colors duration-200'>
						<ArrowLeft className='w-5 h-5 mr-2' />
						Back to Dashboard
					</button>
					<div className='bg-[#fffbeb] border border-[#fef3c7] rounded-lg p-6'>
						<div className='flex items-start space-x-3'>
							<AlertCircle className='w-6 h-6 text-[#EAB308] flex-shrink-0 mt-1' />
							<div>
								<h3 className='font-semibold text-[#d97706] mb-2'>
									Not Enough Data
								</h3>
								<p className='text-[#d97706]'>{error}</p>
								<p className='text-[#b45309] mt-2'>
									Complete more quizzes and encourage others in your
									specialization to join!
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!benchmarkData) {
		return (
			<div className='min-h-screen bg-[#F7F9FC] flex items-center justify-center'>
				<div className='text-center'>
					<p className='text-[#4B5563]'>No benchmark data available.</p>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-[#F7F9FC] p-4'>
			<div className='max-w-7xl mx-auto'>
				{/* Header */}
				<div className='mb-8'>
					<button
						onClick={() => navigate('/dashboard')}
						className='flex items-center text-[#4B5563] hover:text-[#3A7AFE] mb-4 transition-colors duration-200'>
						<ArrowLeft className='w-5 h-5 mr-2' />
						Back to Dashboard
					</button>

					<div className='flex items-center justify-between'>
						<div>
							<h1 className='text-3xl font-bold text-[#1C1C1C] mb-2'>
								Peer Benchmarking
							</h1>
							<p className='text-[#4B5563]'>
								Compare your performance with {benchmarkData.total_peers} peers
								in{' '}
								<span className='font-semibold'>
									{benchmarkData.specialization_name}
								</span>
							</p>
						</div>
						<div className='hidden md:flex items-center space-x-2 text-[#6b7280]'>
							<Users className='w-5 h-5' />
							<span className='text-sm'>
								Last updated:{' '}
								{new Date(benchmarkData.last_updated).toLocaleDateString()}
							</span>
						</div>
					</div>
				</div>

				{/* Overall Percentile Card */}
				<div className='bg-[#3A7AFE] rounded-xl shadow-sm p-6 mb-6 text-white'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-white/80 mb-2'>Your Overall Standing</p>
							<h2 className='text-4xl font-bold mb-2'>
								Top {100 - benchmarkData.overall_percentile}%
							</h2>
							<p className='text-white/80'>
								You score higher than{' '}
								<span className='font-semibold'>
									{benchmarkData.overall_percentile}%
								</span>{' '}
								of your peers
							</p>
						</div>
						<Award className='w-16 h-16 text-white/30' />
					</div>
				</div>

				{/* Score Comparisons */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
					{benchmarkData.comparisons.map((comparison, index) => (
						<div
							key={index}
							className={`bg-white rounded-xl shadow-sm p-6 border-2 ${getStatusColor(
								comparison.status
							)}`}>
							<div className='flex items-start justify-between mb-4'>
								<div>
									<h3 className='text-lg font-semibold text-[#1C1C1C] mb-1'>
										{comparison.category}
									</h3>
									<p className='text-sm text-[#4B5563]'>
										{getStatusText(comparison.status, comparison.difference)}
									</p>
								</div>
								{getStatusIcon(comparison.status)}
							</div>

							<div className='space-y-4'>
								{/* Your Score */}
								<div>
									<div className='flex justify-between items-center mb-2'>
										<span className='text-sm font-medium text-[#4B5563]'>
											Your Score
										</span>
										<span className='text-lg font-bold text-[#3A7AFE]'>
											{comparison.your_score}%
										</span>
									</div>
									<div className='w-full bg-[#E5E7EB] rounded-full h-3'>
										<div
											className='bg-[#3A7AFE] h-3 rounded-full transition-all duration-500'
											style={{ width: `${comparison.your_score}%` }}
										/>
									</div>
								</div>

								{/* Peer Average */}
								<div>
									<div className='flex justify-between items-center mb-2'>
										<span className='text-sm font-medium text-[#4B5563]'>
											Peer Average
										</span>
										<span className='text-lg font-bold text-[#6b7280]'>
											{comparison.peer_average}%
										</span>
									</div>
									<div className='w-full bg-[#E5E7EB] rounded-full h-3'>
										<div
											className='bg-[#9ca3af] h-3 rounded-full transition-all duration-500'
											style={{ width: `${comparison.peer_average}%` }}
										/>
									</div>
								</div>

								{/* Percentile */}
								<div className='pt-2 border-t border-[#E5E7EB]'>
									<div className='flex items-center justify-between'>
										<span className='text-sm text-[#4B5563]'>
											Your Percentile
										</span>
										<span className='text-sm font-semibold text-[#1C1C1C]'>
											{comparison.percentile}th percentile
										</span>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Common Strengths and Gaps */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
					{/* Common Strengths */}
					<div className='bg-white rounded-xl shadow-sm p-6 border border-[#E5E7EB]'>
						<div className='flex items-center space-x-2 mb-4'>
							<CheckCircle className='w-6 h-6 text-[#4CAF50]' />
							<h3 className='text-xl font-semibold text-[#1C1C1C]'>
								Common Strengths
							</h3>
						</div>
						<p className='text-[#4B5563] mb-4'>
							Areas where most peers in your specialization excel
						</p>
						{benchmarkData.common_strengths.length > 0 ? (
							<div className='space-y-3'>
								{benchmarkData.common_strengths.map((strength, index) => (
									<div
										key={index}
										className='p-4 bg-[#f0fdf4] border border-[#dcfce7] rounded-lg'>
										<div className='flex items-start justify-between mb-2'>
											<h4 className='font-semibold text-[#16a34a]'>
												{strength.area}
											</h4>
											<span className='text-lg font-bold text-[#4CAF50]'>
												{strength.percentage}%
											</span>
										</div>
										<p className='text-sm text-[#15803d]'>
											{strength.description}
										</p>
									</div>
								))}
							</div>
						) : (
							<p className='text-[#6b7280] italic'>
								No common strengths identified yet.
							</p>
						)}
					</div>

					{/* Common Gaps */}
					<div className='bg-white rounded-xl shadow-sm p-6 border border-[#E5E7EB]'>
						<div className='flex items-center space-x-2 mb-4'>
							<Target className='w-6 h-6 text-[#EAB308]' />
							<h3 className='text-xl font-semibold text-[#1C1C1C]'>
								Common Gaps
							</h3>
						</div>
						<p className='text-[#4B5563] mb-4'>
							Areas where most peers need improvement
						</p>
						{benchmarkData.common_gaps.length > 0 ? (
							<div className='space-y-3'>
								{benchmarkData.common_gaps.map((gap, index) => (
									<div
										key={index}
										className='p-4 bg-[#fffbeb] border border-[#fef3c7] rounded-lg'>
										<div className='flex items-start justify-between mb-2'>
											<h4 className='font-semibold text-[#d97706]'>
												{gap.area}
											</h4>
											<span className='text-lg font-bold text-[#EAB308]'>
												{gap.percentage}%
											</span>
										</div>
										<p className='text-sm text-[#b45309]'>{gap.description}</p>
									</div>
								))}
							</div>
						) : (
							<p className='text-[#6b7280] italic'>
								No common gaps identified yet.
							</p>
						)}
					</div>
				</div>

				{/* Privacy Note */}
				<div className='mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4'>
					<div className='flex items-start space-x-3'>
						<AlertCircle className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5' />
						<div>
							<h4 className='font-semibold text-blue-900 mb-1'>
								Privacy & Data
							</h4>
							<p className='text-sm text-blue-800'>
								All peer comparison data is aggregated and anonymized. Your
								individual performance is never shared with other users.
								Benchmarks are updated regularly based on the latest quiz
								attempts from all users in your specialization.
							</p>
						</div>
					</div>
				</div>

				{/* CTA Button */}
				<div className='mt-8 text-center'>
					<button
						onClick={() => navigate('/test-hub')}
						className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all'>
						<div className='flex items-center space-x-2'>
							<BarChart3 className='w-5 h-5' />
							<span>Take More Quizzes to Improve Your Ranking</span>
						</div>
					</button>
				</div>
			</div>
		</div>
	);
}
