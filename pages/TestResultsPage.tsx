import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import {
	CheckCircle,
	XCircle,
	Clock,
	Trophy,
	ArrowLeft,
	RotateCcw,
	Target,
	Sparkles,
	Star,
	FileQuestion,
	BookOpen
} from 'lucide-react';
import { getReadinessSnapshot } from '../utils/testSystem';
import { cardStyles } from '../utils/designSystem';
import { API_BASE_URL } from '../utils/api';
import type { Test, TestResult } from '../src/types';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';

interface LocationState {
	test?: Test;
	answers?: Record<string | number, number | boolean>;
	score?: number;
	timeSpent?: number;
	result?: TestResult;
	autoSubmit?: boolean;
	attemptId?: number | string;
	backendResult?: unknown;
	correct?: number;
	total?: number;
	passed?: boolean;
}

const TestResultsPage = (): JSX.Element => {
	const navigate = useNavigate();
	const location = useLocation();

	const {
		test,
		answers,
		score = 0,
		timeSpent = 0,
		result,
		autoSubmit = false,
		attemptId,
		backendResult // Extract the backendResult from navigation state
	} = (location.state as LocationState) || {};

	const [backendData, setBackendData] = useState<unknown>(
		backendResult || null
	);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Log everything we received
		console.log('TestResultsPage - Full location.state:', location.state);
		console.log('TestResultsPage - test:', test);
		console.log('TestResultsPage - backendResult:', backendResult);
		console.log(
			'TestResultsPage - feedback:',
			(backendResult as { feedback?: unknown })?.feedback
		);
		console.log('TestResultsPage - answers:', answers);
		console.log('TestResultsPage - score:', score);

		const fetchResult = async (): Promise<void> => {
			// Only fetch if we don't already have backendResult with feedback
			if (!attemptId || (backendResult as { feedback?: unknown })?.feedback)
				return;
			setLoading(true);
			setError(null);
			try {
				const res = await fetch(`${API_BASE_URL}/results/${attemptId}`);
				if (!res.ok) {
					const t = await res.text();
					throw new Error(`Results error ${res.status}: ${t}`);
				}
				const data = await res.json();
				console.log('Fetched backend data:', data);
				setBackendData(data);
			} catch (e) {
				const err = e instanceof Error ? e : new Error('Unknown error');
				console.error('Error fetching results:', e);
				setError(err.message || 'Failed to load results');
			} finally {
				setLoading(false);
			}
		};
		fetchResult();
	}, [attemptId, backendResult]);

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

	// If we have backendResult, we have enough data to show results
	if (!test && !backendData) {
		console.log('Returning early - no test and no backendData');
		return (
			<div className='min-h-screen bg-[#F7F9FC] flex flex-col'>
				<Navbar showSkipToDashboard={true} />
				<motion.div
					className='flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, ease: 'easeOut' }}>
					<div className='max-w-2xl mx-auto text-center'>
						<motion.div
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ duration: 0.5, ease: 'easeOut' }}
							className='mb-8'>
							<div className='w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 bg-[#3A7AFE]/10 rounded-full flex items-center justify-center'>
								<FileQuestion className='w-12 h-12 md:w-16 md:h-16 text-[#3A7AFE]' />
							</div>
							<h1 className='text-3xl md:text-4xl font-bold text-[#1C1C1C] mb-4'>
								No Test Results Found
							</h1>
							<p className='text-base md:text-lg text-[#4B5563] mb-8 max-w-md mx-auto'>
								It looks like you haven't completed any tests yet. Start your
								journey by taking a quiz to see your results here!
							</p>
						</motion.div>
						<motion.div
							className='flex flex-col sm:flex-row gap-4 justify-center'
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3, duration: 0.5 }}>
							<motion.button
								onClick={() => navigate('/test-hub')}
								className='px-6 py-3 bg-[#3A7AFE] hover:bg-[#2E6AE8] text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}>
								<BookOpen className='w-5 h-5' />
								Browse Tests
							</motion.button>
							<motion.button
								onClick={() => navigate('/dashboard')}
								className='px-6 py-3 bg-white hover:bg-[#F7F9FC] text-[#4B5563] border border-[#E5E7EB] rounded-lg font-medium transition-colors duration-200'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}>
								Back to Dashboard
							</motion.button>
						</motion.div>
					</div>
				</motion.div>
				<Footer />
			</div>
		);
	}

	// Add a try-catch to prevent white screen
	try {
		const formatTime = (seconds: number): string => {
			const minutes = Math.floor(seconds / 60);
			const remainingSeconds = seconds % 60;
			return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
		};

		const getScoreColor = (score: number): string => {
			if (score >= 90) return 'text-[#4CAF50]';
			if (score >= 70) return 'text-[#3A7AFE]';
			if (score >= 50) return 'text-[#EAB308]';
			return 'text-[#DC2626]';
		};

		const getScoreBgColor = (score: number): string => {
			if (score >= 90) return 'bg-[#f0fdf4] border-[#dcfce7]';
			if (score >= 70) return 'bg-[#F7F9FC] border-[#E5E7EB]';
			if (score >= 50) return 'bg-[#fffbeb] border-[#fef3c7]';
			return 'bg-[#fef2f2] border-[#fee2e2]';
		};

		const getPerformanceMessage = (
			score: number
		): {
			message: string;
			icon: React.ComponentType<{ className?: string }>;
		} => {
			if (score >= 90) return { message: 'Excellent work!', icon: Trophy };
			if (score >= 70) return { message: 'Great job!', icon: CheckCircle };
			if (score >= 50) return { message: 'Good effort!', icon: Target };
			return { message: 'Keep practicing!', icon: RotateCcw };
		};

		const performance = getPerformanceMessage(score);
		const Icon = performance.icon;

		const backendDataTyped = backendData as {
			attempt?: { score?: number; passed?: boolean };
			quiz?: { title?: string };
			feedback?: {
				overall?: string;
				recommendations?: string[];
				strengths?: string[];
				weaknesses?: string[];
			};
			score_impact?: Array<{
				category: string;
				old_score: number;
				new_score: number;
				increase: number;
			}>;
			updated_goals?: Array<{
				title: string;
				category: string;
				progress: number;
				completed: boolean;
			}>;
			readiness?: {
				overall: number;
				technical: number;
				soft: number;
			};
		};

		const displayScore = backendDataTyped?.attempt?.score ?? score;
		const displayPassed =
			backendDataTyped?.attempt?.passed ?? result?.passed ?? false;
		const displayTitle =
			backendDataTyped?.quiz?.title || test?.title || 'Test Results';

		return (
			<div className='min-h-screen bg-[#F7F9FC] flex flex-col'>
				{/* Navbar */}
				<Navbar showSkipToDashboard={true} />

				{/* Main Content */}
				<motion.div
					className='flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full'
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
						<div>
							<h1 className='text-2xl md:text-3xl lg:text-4xl font-bold text-[#1C1C1C] mb-2'>
								Test Results
							</h1>
							<p className='text-sm md:text-base text-[#4B5563]'>
								{displayTitle}
							</p>
						</div>
					</motion.div>
					{autoSubmit && (
						<motion.div
							className='bg-[#fffbeb] border border-[#fef3c7] rounded-lg p-3 md:p-4 mb-6'
							variants={itemVariants}
							initial='hidden'
							animate='visible'>
							<div className='flex items-center gap-2'>
								<Clock className='h-4 w-4 md:h-5 md:w-5 text-[#EAB308] flex-shrink-0' />
								<p className='text-xs md:text-sm text-[#d97706]'>
									Time's up! Your test was automatically submitted.
								</p>
							</div>
						</motion.div>
					)}

					{/* Score Overview */}
					<motion.div
						className={`${
							cardStyles.default
						} mb-6 md:mb-8 border-2 ${getScoreBgColor(
							score
						)} relative overflow-hidden p-4 sm:p-6 md:p-8`}
						variants={itemVariants}
						whileHover={{ y: -2, transition: { duration: 0.2 } }}>
						{/* Animated background sparkles for high scores */}
						{displayScore >= 90 && (
							<div className='absolute inset-0 pointer-events-none'>
								<Sparkles className='absolute top-4 right-4 h-5 w-5 md:h-6 md:w-6 text-[#EAB308] animate-pulse' />
								<Star
									className='absolute bottom-4 left-4 h-3 w-3 md:h-4 md:w-4 text-[#EAB308] animate-bounce'
									style={{ animationDelay: '0.5s' }}
								/>
								<Sparkles
									className='absolute top-1/2 left-8 h-4 w-4 md:h-5 md:w-5 text-[#EAB308] animate-pulse'
									style={{ animationDelay: '1s' }}
								/>
							</div>
						)}

						<div className='text-center relative z-10 px-2'>
							<motion.div
								className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full mb-3 md:mb-4 ${getScoreColor(
									score
								)} bg-opacity-10`}
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}>
								<Icon
									className={`h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 ${getScoreColor(
										score
									)}`}
								/>
							</motion.div>
							<h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-[#1C1C1C] mb-2'>
								{performance.message}
							</h2>
							<motion.div
								className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-3 md:mb-4 ${getScoreColor(
									score
								)} transition-all duration-600`}
								initial={{ opacity: 0, scale: 0.5 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}>
								{Math.round(displayScore)}%
							</motion.div>
							<p className='text-xs sm:text-sm md:text-base lg:text-lg text-[#4B5563] px-2'>
								{displayPassed ? (
									<span className='flex items-center justify-center gap-2 flex-wrap'>
										🎉 You passed the test!
										{displayScore >= 90 && (
											<Sparkles className='h-4 w-4 md:h-5 md:w-5 text-[#EAB308] animate-pulse flex-shrink-0' />
										)}
									</span>
								) : (
									'You need 70% to pass. Keep practicing!'
								)}
							</p>
						</div>
					</motion.div>

					{/* Readiness Impact (backend preferred, local fallback) */}
					<div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8'>
						{(() => {
							try {
								const readiness = backendDataTyped?.readiness;
								const userRaw = localStorage.getItem('currentUser');
								const user = userRaw ? JSON.parse(userRaw) : null;
								const localSnap = user ? getReadinessSnapshot(user.id) : null;
								const overall = readiness
									? Math.round(readiness.overall)
									: localSnap
									? localSnap.overall
									: 0;
								const technical = readiness
									? Math.round(readiness.technical)
									: localSnap
									? localSnap.technical
									: 0;
								const soft = readiness
									? Math.round(readiness.soft)
									: localSnap
									? localSnap.soft
									: 0;
								const items = [
									{
										label: 'Overall Readiness',
										value: `${overall}%`,
										color: 'text-[#3A7AFE]',
										bg: 'bg-[#F7F9FC]'
									},
									{
										label: 'Technical',
										value: `${technical}%`,
										color: 'text-[#4CAF50]',
										bg: 'bg-[#f0fdf4]'
									},
									{
										label: 'Soft Skills',
										value: `${soft}%`,
										color: 'text-[#EAB308]',
										bg: 'bg-[#fffbeb]'
									},
									{
										label: 'Passed',
										value: displayPassed ? 'Yes' : 'No',
										color: displayPassed ? 'text-[#4CAF50]' : 'text-[#DC2626]',
										bg: displayPassed ? 'bg-[#f0fdf4]' : 'bg-[#fef2f2]'
									}
								];
								return items.map((it, idx) => (
									<motion.div
										key={idx}
										className={`rounded-lg p-3 md:p-6 ${it.bg} border border-[#E5E7EB] text-center`}
										variants={itemVariants}
										initial='hidden'
										animate='visible'
										transition={{ delay: idx * 0.1 }}
										whileHover={{ y: -2, transition: { duration: 0.2 } }}>
										<div className='text-xs md:text-sm text-[#4B5563] mb-1'>
											{it.label}
										</div>
										<div
											className={`text-xl md:text-2xl font-bold ${it.color}`}>
											{it.value}
										</div>
									</motion.div>
								));
							} catch {
								return null;
							}
						})()}
					</div>

					{loading && (
						<motion.div
							className='bg-white rounded-lg p-4 mb-6 border border-[#E5E7EB] text-[#4B5563]'
							variants={itemVariants}
							initial='hidden'
							animate='visible'>
							Loading results…
						</motion.div>
					)}
					{!loading && error && (
						<motion.div
							className='bg-[#fef2f2] border border-[#fee2e2] rounded-lg p-3 md:p-4 mb-6 text-sm md:text-base text-[#DC2626]'
							variants={itemVariants}
							initial='hidden'
							animate='visible'>
							{error}
						</motion.div>
					)}

					{/* Stats */}
					<div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8'>
						<motion.div
							className='bg-white rounded-lg shadow-sm p-4 md:p-6 text-center border border-[#E5E7EB]'
							variants={itemVariants}
							whileHover={{ y: -2, transition: { duration: 0.2 } }}>
							<Target className='h-6 w-6 md:h-8 md:w-8 text-[#3A7AFE] mx-auto mb-2' />
							<div className='text-xl md:text-2xl font-bold text-[#1C1C1C]'>
								{Object.keys(answers || {}).length}/
								{test?.questions?.length || 0}
							</div>
							<div className='text-xs md:text-sm text-[#4B5563]'>
								Questions Answered
							</div>
						</motion.div>

						<motion.div
							className='bg-white rounded-lg shadow-sm p-4 md:p-6 text-center border border-[#E5E7EB]'
							variants={itemVariants}
							whileHover={{ y: -2, transition: { duration: 0.2 } }}>
							<Clock className='h-6 w-6 md:h-8 md:w-8 text-[#4CAF50] mx-auto mb-2' />
							<div className='text-xl md:text-2xl font-bold text-[#1C1C1C]'>
								{formatTime(timeSpent || 0)}
							</div>
							<div className='text-xs md:text-sm text-[#4B5563]'>
								Time Taken
							</div>
						</motion.div>

						<motion.div
							className='bg-white rounded-lg shadow-sm p-4 md:p-6 text-center border border-[#E5E7EB]'
							variants={itemVariants}
							whileHover={{ y: -2, transition: { duration: 0.2 } }}>
							<Trophy className='h-6 w-6 md:h-8 md:w-8 text-[#EAB308] mx-auto mb-2' />
							<div className='text-xl md:text-2xl font-bold text-[#1C1C1C]'>
								{test?.difficulty || 'N/A'}
							</div>
							<div className='text-xs md:text-sm text-[#4B5563]'>
								Difficulty Level
							</div>
						</motion.div>
					</div>

					{/* Personalized Feedback */}
					{backendDataTyped?.feedback && (
						<motion.div
							className='bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6 md:mb-8 border border-[#E5E7EB]'
							variants={itemVariants}
							whileHover={{ y: -2, transition: { duration: 0.2 } }}>
							<h3 className='text-lg md:text-xl font-bold text-[#1C1C1C] mb-4'>
								Personalized Feedback
							</h3>

							{/* Overall Feedback */}
							{backendDataTyped.feedback.overall && (
								<div className='bg-[#F7F9FC] border border-[#E5E7EB] rounded-lg p-3 md:p-4 mb-4'>
									<p className='text-sm md:text-base text-[#4B5563]'>
										{backendDataTyped.feedback.overall}
									</p>
								</div>
							)}

							{/* Recommendations */}
							{backendDataTyped.feedback.recommendations &&
								Array.isArray(backendDataTyped.feedback.recommendations) &&
								backendDataTyped.feedback.recommendations.length > 0 && (
									<div className='mb-4'>
										<h4 className='font-semibold text-[#1C1C1C] mb-2 text-sm md:text-base'>
											Recommendations:
										</h4>
										<ul className='list-disc list-inside space-y-1 text-xs md:text-sm text-[#4B5563]'>
											{backendDataTyped.feedback.recommendations.map(
												(rec, idx) => (
													<li key={idx}>{rec}</li>
												)
											)}
										</ul>
									</div>
								)}

							{/* Strengths & Weaknesses */}
							<div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4'>
								{backendDataTyped.feedback.strengths &&
									Array.isArray(backendDataTyped.feedback.strengths) &&
									backendDataTyped.feedback.strengths.length > 0 && (
										<div className='bg-[#f0fdf4] border border-[#dcfce7] rounded-lg p-3 md:p-4'>
											<h4 className='font-semibold text-[#16a34a] mb-2 text-sm md:text-base'>
												Strengths:
											</h4>
											<ul className='list-disc list-inside space-y-1 text-xs md:text-sm text-[#15803d]'>
												{backendDataTyped.feedback.strengths.map((str, idx) => (
													<li key={idx}>{str}</li>
												))}
											</ul>
										</div>
									)}
								{backendDataTyped.feedback.weaknesses &&
									Array.isArray(backendDataTyped.feedback.weaknesses) &&
									backendDataTyped.feedback.weaknesses.length > 0 && (
										<div className='bg-[#fef2f2] border border-[#fee2e2] rounded-lg p-3 md:p-4'>
											<h4 className='font-semibold text-[#DC2626] mb-2 text-sm md:text-base'>
												Areas for Improvement:
											</h4>
											<ul className='list-disc list-inside space-y-1 text-xs md:text-sm text-[#b91c1c]'>
												{backendDataTyped.feedback.weaknesses.map(
													(weak, idx) => (
														<li key={idx}>{weak}</li>
													)
												)}
											</ul>
										</div>
									)}
							</div>

							{/* Score Impact */}
							{backendDataTyped.score_impact &&
								backendDataTyped.score_impact.length > 0 && (
									<div>
										<h4 className='font-semibold text-[#1C1C1C] mb-2 text-sm md:text-base'>
											Score Impact:
										</h4>
										<div className='space-y-2'>
											{backendDataTyped.score_impact.map((impact, idx) => (
												<div
													key={idx}
													className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-[#F7F9FC] border border-[#E5E7EB] rounded-lg p-3'>
													<span className='text-xs md:text-sm text-[#4B5563]'>
														{impact.category}
													</span>
													<div className='flex items-center gap-2 flex-wrap'>
														<span className='text-xs md:text-sm text-[#4B5563]'>
															{Math.round(impact.old_score)}%
														</span>
														<span className='text-[#4B5563]'>→</span>
														<span className='font-semibold text-xs md:text-sm text-[#1C1C1C]'>
															{Math.round(impact.new_score)}%
														</span>
														<span className='text-[#4CAF50] font-medium text-xs md:text-sm'>
															+{impact.increase.toFixed(1)}%
														</span>
													</div>
												</div>
											))}
										</div>
									</div>
								)}
						</motion.div>
					)}

					{/* Auto-Updated Goals Notification */}
					{backendDataTyped?.updated_goals &&
						backendDataTyped.updated_goals.length > 0 && (
							<motion.div
								className='bg-[#f0fdf4] border-2 border-[#dcfce7] rounded-xl shadow-sm p-4 md:p-6 mb-6 md:mb-8'
								variants={itemVariants}
								whileHover={{ y: -2, transition: { duration: 0.2 } }}>
								<div className='flex flex-col sm:flex-row items-start gap-3'>
									<div className='flex-shrink-0'>
										<Target className='h-6 w-6 md:h-8 md:w-8 text-[#4CAF50]' />
									</div>
									<div className='flex-1 min-w-0'>
										<h3 className='text-base md:text-lg lg:text-xl font-bold text-[#16a34a] mb-2 flex items-center gap-2 flex-wrap'>
											🎯 Goals Auto-Updated!
											<Sparkles className='h-4 w-4 md:h-5 md:w-5 text-[#EAB308] flex-shrink-0' />
										</h3>
										<p className='text-xs md:text-sm lg:text-base text-[#15803d] mb-4'>
											Your progress on {backendDataTyped.updated_goals.length}{' '}
											{backendDataTyped.updated_goals.length === 1
												? 'goal has'
												: 'goals have'}{' '}
											been automatically updated based on your quiz performance!
										</p>
										<div className='space-y-2 md:space-y-3'>
											{backendDataTyped.updated_goals.map((goal, idx) => (
												<div
													key={idx}
													className='bg-white rounded-lg p-3 md:p-4 border border-[#dcfce7]'>
													<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
														<div className='flex-1 min-w-0'>
															<div className='flex flex-wrap items-center gap-2 mb-1'>
																<h4 className='font-semibold text-sm md:text-base text-[#1C1C1C]'>
																	{goal.title}
																</h4>
																{goal.completed && (
																	<span className='inline-flex items-center gap-1 bg-[#f0fdf4] text-[#15803d] text-xs font-medium px-2 py-1 rounded-full flex-shrink-0'>
																		<CheckCircle className='h-3 w-3' />
																		Completed!
																	</span>
																)}
															</div>
															<p className='text-xs md:text-sm text-[#4B5563] capitalize'>
																{goal.category.replace('_', ' ')} Goal
															</p>
														</div>
														<div className='text-left sm:text-right flex-shrink-0'>
															<div className='text-xl md:text-2xl font-bold text-[#4CAF50]'>
																{Math.round(goal.progress)}%
															</div>
															<p className='text-xs text-[#4B5563]'>
																Current Progress
															</p>
														</div>
													</div>
												</div>
											))}
										</div>
										<div className='mt-4'>
											<motion.button
												onClick={() => navigate('/goals')}
												className='inline-flex items-center gap-2 bg-[#4CAF50] hover:bg-[#45a049] text-white px-4 py-2 rounded-lg transition-colors text-sm md:text-base'
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}>
												<Target className='h-4 w-4' />
												View All Goals
											</motion.button>
										</div>
									</div>
								</div>
							</motion.div>
						)}

					{/* Question Review */}
					{test?.questions && (
						<motion.div
							className='bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6 md:mb-8 border border-[#E5E7EB]'
							variants={itemVariants}
							whileHover={{ y: -2, transition: { duration: 0.2 } }}>
							<h3 className='text-lg md:text-xl font-bold text-[#1C1C1C] mb-4 md:mb-6'>
								Question Review
							</h3>
							<div className='space-y-4 md:space-y-6'>
								{test.questions.map((question, index) => {
									const userAnswer = answers?.[question.id];
									const isCorrect = userAnswer === question.correct;
									const correctBoolean =
										typeof question.correct === 'boolean'
											? question.correct
											: null;
									const isCorrectTrue = correctBoolean === true;
									const isCorrectFalse = correctBoolean === false;

									return (
										<motion.div
											key={question.id}
											className='border-b border-[#E5E7EB] pb-4 md:pb-6 last:border-b-0'
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: index * 0.05, duration: 0.4 }}>
											<div className='flex items-start gap-3 mb-3'>
												{isCorrect ? (
													<CheckCircle className='h-4 w-4 md:h-5 md:w-5 text-[#4CAF50] mt-0.5 flex-shrink-0' />
												) : (
													<XCircle className='h-4 w-4 md:h-5 md:w-5 text-[#DC2626] mt-0.5 flex-shrink-0' />
												)}
												<div className='flex-1 min-w-0'>
													<h4 className='font-medium text-sm md:text-base text-[#1C1C1C] mb-2 break-words'>
														Question {index + 1}: {question.question}
													</h4>

													{question.type === 'multiple-choice' &&
														question.options && (
															<div className='space-y-2'>
																{question.options.map((option, optionIndex) => {
																	const isUserAnswer =
																		userAnswer === optionIndex;
																	const isCorrectAnswer =
																		question.correct === optionIndex;

																	return (
																		<div
																			key={optionIndex}
																			className={`p-2 md:p-3 rounded border text-xs md:text-sm ${
																				isCorrectAnswer
																					? 'bg-[#f0fdf4] border-[#dcfce7] text-[#15803d]'
																					: isUserAnswer && !isCorrectAnswer
																					? 'bg-[#fef2f2] border-[#fee2e2] text-[#b91c1c]'
																					: 'bg-[#F7F9FC] border-[#E5E7EB] text-[#4B5563]'
																			}`}>
																			<div className='flex items-center gap-2 flex-wrap'>
																				{isUserAnswer && (
																					<span className='text-xs font-medium flex-shrink-0'>
																						Your answer:
																					</span>
																				)}
																				{isCorrectAnswer && (
																					<span className='text-xs font-medium flex-shrink-0'>
																						Correct:
																					</span>
																				)}
																				<span className='break-words'>
																					{option}
																				</span>
																			</div>
																		</div>
																	);
																})}
															</div>
														)}

													{question.type === 'true-false' && (
														<div className='space-y-2'>
															<div
																className={`p-2 md:p-3 rounded border text-xs md:text-sm ${
																	isCorrectTrue
																		? 'bg-[#f0fdf4] border-[#dcfce7] text-[#15803d]'
																		: userAnswer === true &&
																		  correctBoolean !== null &&
																		  !isCorrectTrue
																		? 'bg-[#fef2f2] border-[#fee2e2] text-[#b91c1c]'
																		: 'bg-[#F7F9FC] border-[#E5E7EB] text-[#4B5563]'
																}`}>
																<div className='flex items-center gap-2'>
																	{userAnswer === true && (
																		<span className='text-xs font-medium'>
																			Your answer:
																		</span>
																	)}
																	{isCorrectTrue && (
																		<span className='text-xs font-medium'>
																			Correct:
																		</span>
																	)}
																	<span>True</span>
																</div>
															</div>
															<div
																className={`p-2 md:p-3 rounded border text-xs md:text-sm ${
																	isCorrectFalse
																		? 'bg-[#f0fdf4] border-[#dcfce7] text-[#15803d]'
																		: userAnswer === false &&
																		  correctBoolean !== null &&
																		  !isCorrectFalse
																		? 'bg-[#fef2f2] border-[#fee2e2] text-[#b91c1c]'
																		: 'bg-[#F7F9FC] border-[#E5E7EB] text-[#4B5563]'
																}`}>
																<div className='flex items-center gap-2'>
																	{userAnswer === false && (
																		<span className='text-xs font-medium'>
																			Your answer:
																		</span>
																	)}
																	{isCorrectFalse && (
																		<span className='text-xs font-medium'>
																			Correct:
																		</span>
																	)}
																	<span>False</span>
																</div>
															</div>
														</div>
													)}

													{question.explanation && (
														<div className='mt-3 p-2 md:p-3 bg-[#F7F9FC] border-l-4 border-[#3A7AFE]'>
															<p className='text-xs md:text-sm text-[#4B5563] break-words'>
																<strong>Explanation:</strong>{' '}
																{question.explanation}
															</p>
														</div>
													)}
												</div>
											</div>
										</motion.div>
									);
								})}
							</div>
						</motion.div>
					)}

					{/* Actions */}
					<motion.div
						className='flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-6 md:mb-8'
						variants={itemVariants}>
						<motion.button
							onClick={() => navigate('/test-hub')}
							className='px-4 md:px-6 py-2.5 md:py-3 bg-[#3A7AFE] hover:bg-[#2E6AE8] text-white rounded-lg font-medium transition-colors text-sm md:text-base w-full sm:w-auto'
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}>
							Browse More Tests
						</motion.button>

						<motion.button
							onClick={() => navigate('/dashboard')}
							className='px-4 md:px-6 py-2.5 md:py-3 border border-[#E5E7EB] text-[#4B5563] hover:bg-[#F7F9FC] rounded-lg font-medium transition-colors text-sm md:text-base w-full sm:w-auto'
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}>
							Back to Dashboard
						</motion.button>

						{result && !result.passed && (
							<motion.button
								onClick={() =>
									navigate('/test-taking', { state: { testId: test?.id } })
								}
								className='px-4 md:px-6 py-2.5 md:py-3 bg-[#4CAF50] hover:bg-[#45a049] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm md:text-base w-full sm:w-auto'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}>
								<RotateCcw className='h-4 w-4' />
								Retake Test
							</motion.button>
						)}
					</motion.div>
				</motion.div>

				{/* Footer */}
				<Footer />
			</div>
		);
	} catch (err) {
		const error = err instanceof Error ? err : new Error('Unknown error');
		console.error('Error rendering TestResultsPage:', err);
		return (
			<div className='min-h-screen bg-[#F7F9FC] flex flex-col'>
				<Navbar showSkipToDashboard={true} />
				<div className='flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8'>
					<motion.div
						className='text-center max-w-md'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, ease: 'easeOut' }}>
						<div className='w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 bg-[#fef2f2] rounded-full flex items-center justify-center'>
							<XCircle className='w-8 h-8 md:w-10 md:h-10 text-[#DC2626]' />
						</div>
						<h2 className='text-2xl md:text-3xl font-bold text-[#1C1C1C] mb-4'>
							Error Displaying Results
						</h2>
						<p className='text-sm md:text-base text-[#DC2626] mb-6'>
							{error.message}
						</p>
						<div className='flex flex-col sm:flex-row gap-3 justify-center'>
							<motion.button
								onClick={() => navigate('/test-hub')}
								className='px-6 py-3 bg-[#3A7AFE] hover:bg-[#2E6AE8] text-white rounded-lg font-medium transition-colors text-sm md:text-base'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}>
								Back to Test Hub
							</motion.button>
							<motion.button
								onClick={() => navigate('/dashboard')}
								className='px-6 py-3 bg-white hover:bg-[#F7F9FC] text-[#4B5563] border border-[#E5E7EB] rounded-lg font-medium transition-colors text-sm md:text-base'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}>
								Dashboard
							</motion.button>
						</div>
					</motion.div>
				</div>
				<Footer />
			</div>
		);
	}
};

export default TestResultsPage;
