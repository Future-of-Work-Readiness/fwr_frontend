import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
	CheckCircle,
	XCircle,
	Clock,
	Trophy,
	ArrowLeft,
	RotateCcw,
	Target,
	Sparkles,
	Star
} from 'lucide-react';
import { getReadinessSnapshot } from '../utils/testSystem';
import { cardStyles } from '../utils/designSystem';
import type { Test, TestResult } from '../src/types';

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
				const res = await fetch(
					`http://localhost:8000/api/results/${attemptId}`
				);
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

	// If we have backendResult, we have enough data to show results
	if (!test && !backendData) {
		console.log('Returning early - no test and no backendData');
		return (
			<div className='min-h-screen bg-white flex items-center justify-center'>
				<div className='text-center'>
					<p className='text-gray-600 mb-4'>No test results found.</p>
					<button
						onClick={() => navigate('/test-hub')}
						className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg'>
						Back to Test Hub
					</button>
				</div>
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
			if (score >= 90) return 'text-green-600';
			if (score >= 70) return 'text-blue-600';
			if (score >= 50) return 'text-yellow-600';
			return 'text-red-600';
		};

		const getScoreBgColor = (score: number): string => {
			if (score >= 90) return 'bg-green-100 border-green-200';
			if (score >= 70) return 'bg-blue-100 border-blue-200';
			if (score >= 50) return 'bg-yellow-100 border-yellow-200';
			return 'bg-red-100 border-red-200';
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
			<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
				{/* Header */}
				<div className='bg-white shadow-sm border-b'>
					<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
						<div className='flex items-center py-6'>
							<button
								onClick={() => navigate('/test-hub')}
								className='p-2 text-gray-600 hover:text-blue-600 transition-colors mr-4'>
								<ArrowLeft className='h-5 w-5' />
							</button>
							<div>
								<h1 className='text-3xl font-bold text-gray-900'>
									Test Results
								</h1>
								<p className='text-gray-600 mt-1'>{displayTitle}</p>
							</div>
						</div>
					</div>
				</div>

				<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
					{autoSubmit && (
						<div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6'>
							<div className='flex items-center'>
								<Clock className='h-5 w-5 text-yellow-600 mr-2' />
								<p className='text-yellow-800'>
									Time's up! Your test was automatically submitted.
								</p>
							</div>
						</div>
					)}

					{/* Score Overview */}
					<div
						className={`${cardStyles.default} mb-8 border-2 ${getScoreBgColor(
							score
						)} relative overflow-hidden`}>
						{/* Animated background sparkles for high scores */}
						{displayScore >= 90 && (
							<div className='absolute inset-0 pointer-events-none'>
								<Sparkles className='absolute top-4 right-4 h-6 w-6 text-yellow-400 animate-pulse' />
								<Star
									className='absolute bottom-4 left-4 h-4 w-4 text-yellow-400 animate-bounce'
									style={{ animationDelay: '0.5s' }}
								/>
								<Sparkles
									className='absolute top-1/2 left-8 h-5 w-5 text-yellow-400 animate-pulse'
									style={{ animationDelay: '1s' }}
								/>
							</div>
						)}

						<div className='text-center relative z-10'>
							<div
								className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${getScoreColor(
									score
								)} bg-opacity-10`}>
								<Icon className={`h-12 w-12 ${getScoreColor(score)}`} />
							</div>
							<h2 className='text-3xl font-bold text-gray-900 mb-2'>
								{performance.message}
							</h2>
							<div
								className={`text-6xl font-bold mb-4 ${getScoreColor(
									score
								)} transition-all duration-1000`}>
								{Math.round(displayScore)}%
							</div>
							<p className='text-gray-600 text-lg'>
								{displayPassed ? (
									<span className='flex items-center justify-center gap-2'>
										🎉 You passed the test!
										{displayScore >= 90 && (
											<Sparkles className='h-5 w-5 text-yellow-500 animate-pulse' />
										)}
									</span>
								) : (
									'You need 70% to pass. Keep practicing!'
								)}
							</p>
						</div>
					</div>

					{/* Readiness Impact (backend preferred, local fallback) */}
					<div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
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
										color: 'text-blue-700',
										bg: 'bg-blue-50'
									},
									{
										label: 'Technical',
										value: `${technical}%`,
										color: 'text-green-700',
										bg: 'bg-green-50'
									},
									{
										label: 'Soft Skills',
										value: `${soft}%`,
										color: 'text-yellow-700',
										bg: 'bg-yellow-50'
									},
									{
										label: 'Passed',
										value: displayPassed ? 'Yes' : 'No',
										color: displayPassed ? 'text-emerald-700' : 'text-red-700',
										bg: displayPassed ? 'bg-emerald-50' : 'bg-red-50'
									}
								];
								return items.map((it, idx) => (
									<div
										key={idx}
										className={`rounded-lg p-6 ${it.bg} border border-gray-200 text-center`}>
										<div className='text-sm text-gray-600 mb-1'>{it.label}</div>
										<div className={`text-2xl font-bold ${it.color}`}>
											{it.value}
										</div>
									</div>
								));
							} catch {
								return null;
							}
						})()}
					</div>

					{loading && (
						<div className='bg-white rounded-lg p-4 mb-6 border border-gray-200 text-gray-600'>
							Loading results…
						</div>
					)}
					{!loading && error && (
						<div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700'>
							{error}
						</div>
					)}

					{/* Stats */}
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
						<div className='bg-white rounded-lg shadow-lg p-6 text-center'>
							<Target className='h-8 w-8 text-blue-600 mx-auto mb-2' />
							<div className='text-2xl font-bold text-gray-900'>
								{Object.keys(answers || {}).length}/
								{test?.questions?.length || 0}
							</div>
							<div className='text-sm text-gray-600'>Questions Answered</div>
						</div>

						<div className='bg-white rounded-lg shadow-lg p-6 text-center'>
							<Clock className='h-8 w-8 text-green-600 mx-auto mb-2' />
							<div className='text-2xl font-bold text-gray-900'>
								{formatTime(timeSpent || 0)}
							</div>
							<div className='text-sm text-gray-600'>Time Taken</div>
						</div>

						<div className='bg-white rounded-lg shadow-lg p-6 text-center'>
							<Trophy className='h-8 w-8 text-yellow-600 mx-auto mb-2' />
							<div className='text-2xl font-bold text-gray-900'>
								{test?.difficulty || 'N/A'}
							</div>
							<div className='text-sm text-gray-600'>Difficulty Level</div>
						</div>
					</div>

					{/* Personalized Feedback */}
					{backendDataTyped?.feedback && (
						<div className='bg-white rounded-xl shadow-lg p-6 mb-8'>
							<h3 className='text-xl font-bold text-gray-900 mb-4'>
								Personalized Feedback
							</h3>

							{/* Overall Feedback */}
							{backendDataTyped.feedback.overall && (
								<div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4'>
									<p className='text-gray-800'>
										{backendDataTyped.feedback.overall}
									</p>
								</div>
							)}

							{/* Recommendations */}
							{backendDataTyped.feedback.recommendations &&
								Array.isArray(backendDataTyped.feedback.recommendations) &&
								backendDataTyped.feedback.recommendations.length > 0 && (
									<div className='mb-4'>
										<h4 className='font-semibold text-gray-900 mb-2'>
											Recommendations:
										</h4>
										<ul className='list-disc list-inside space-y-1 text-gray-700'>
											{backendDataTyped.feedback.recommendations.map(
												(rec, idx) => (
													<li key={idx}>{rec}</li>
												)
											)}
										</ul>
									</div>
								)}

							{/* Strengths & Weaknesses */}
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
								{backendDataTyped.feedback.strengths &&
									Array.isArray(backendDataTyped.feedback.strengths) &&
									backendDataTyped.feedback.strengths.length > 0 && (
										<div className='bg-green-50 border border-green-200 rounded-lg p-4'>
											<h4 className='font-semibold text-green-900 mb-2'>
												Strengths:
											</h4>
											<ul className='list-disc list-inside space-y-1 text-green-800'>
												{backendDataTyped.feedback.strengths.map((str, idx) => (
													<li key={idx}>{str}</li>
												))}
											</ul>
										</div>
									)}
								{backendDataTyped.feedback.weaknesses &&
									Array.isArray(backendDataTyped.feedback.weaknesses) &&
									backendDataTyped.feedback.weaknesses.length > 0 && (
										<div className='bg-red-50 border border-red-200 rounded-lg p-4'>
											<h4 className='font-semibold text-red-900 mb-2'>
												Areas for Improvement:
											</h4>
											<ul className='list-disc list-inside space-y-1 text-red-800'>
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
										<h4 className='font-semibold text-gray-900 mb-2'>
											Score Impact:
										</h4>
										<div className='space-y-2'>
											{backendDataTyped.score_impact.map((impact, idx) => (
												<div
													key={idx}
													className='flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3'>
													<span className='text-gray-700'>
														{impact.category}
													</span>
													<div className='flex items-center gap-2'>
														<span className='text-gray-600'>
															{Math.round(impact.old_score)}%
														</span>
														<span className='text-gray-400'>→</span>
														<span className='font-semibold text-gray-900'>
															{Math.round(impact.new_score)}%
														</span>
														<span className='text-green-600 font-medium'>
															+{impact.increase.toFixed(1)}%
														</span>
													</div>
												</div>
											))}
										</div>
									</div>
								)}
						</div>
					)}

					{/* Auto-Updated Goals Notification */}
					{backendDataTyped?.updated_goals &&
						backendDataTyped.updated_goals.length > 0 && (
							<div className='bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl shadow-lg p-6 mb-8'>
								<div className='flex items-start gap-3'>
									<div className='flex-shrink-0'>
										<Target className='h-8 w-8 text-green-600' />
									</div>
									<div className='flex-1'>
										<h3 className='text-xl font-bold text-green-900 mb-2 flex items-center gap-2'>
											🎯 Goals Auto-Updated!
											<Sparkles className='h-5 w-5 text-yellow-500' />
										</h3>
										<p className='text-green-800 mb-4'>
											Your progress on {backendDataTyped.updated_goals.length}{' '}
											{backendDataTyped.updated_goals.length === 1
												? 'goal has'
												: 'goals have'}{' '}
											been automatically updated based on your quiz performance!
										</p>
										<div className='space-y-3'>
											{backendDataTyped.updated_goals.map((goal, idx) => (
												<div
													key={idx}
													className='bg-white rounded-lg p-4 border border-green-200'>
													<div className='flex items-center justify-between'>
														<div className='flex-1'>
															<div className='flex items-center gap-2 mb-1'>
																<h4 className='font-semibold text-gray-900'>
																	{goal.title}
																</h4>
																{goal.completed && (
																	<span className='inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full'>
																		<CheckCircle className='h-3 w-3' />
																		Completed!
																	</span>
																)}
															</div>
															<p className='text-sm text-gray-600 capitalize'>
																{goal.category.replace('_', ' ')} Goal
															</p>
														</div>
														<div className='text-right'>
															<div className='text-2xl font-bold text-green-600'>
																{Math.round(goal.progress)}%
															</div>
															<p className='text-xs text-gray-500'>
																Current Progress
															</p>
														</div>
													</div>
												</div>
											))}
										</div>
										<div className='mt-4'>
											<button
												onClick={() => navigate('/goals')}
												className='inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors'>
												<Target className='h-4 w-4' />
												View All Goals
											</button>
										</div>
									</div>
								</div>
							</div>
						)}

					{/* Question Review */}
					{test?.questions && (
						<div className='bg-white rounded-xl shadow-lg p-6 mb-8'>
							<h3 className='text-xl font-bold text-gray-900 mb-6'>
								Question Review
							</h3>
							<div className='space-y-6'>
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
										<div
											key={question.id}
											className='border-b border-gray-200 pb-6 last:border-b-0'>
											<div className='flex items-start gap-3 mb-3'>
												{isCorrect ? (
													<CheckCircle className='h-5 w-5 text-green-600 mt-0.5 flex-shrink-0' />
												) : (
													<XCircle className='h-5 w-5 text-red-600 mt-0.5 flex-shrink-0' />
												)}
												<div className='flex-1'>
													<h4 className='font-medium text-gray-900 mb-2'>
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
																			className={`p-2 rounded border ${
																				isCorrectAnswer
																					? 'bg-green-50 border-green-200 text-green-800'
																					: isUserAnswer && !isCorrectAnswer
																					? 'bg-red-50 border-red-200 text-red-800'
																					: 'bg-gray-50 border-gray-200'
																			}`}>
																			<div className='flex items-center gap-2'>
																				{isUserAnswer && (
																					<span className='text-xs font-medium'>
																						Your answer:
																					</span>
																				)}
																				{isCorrectAnswer && (
																					<span className='text-xs font-medium'>
																						Correct:
																					</span>
																				)}
																				<span>{option}</span>
																			</div>
																		</div>
																	);
																})}
															</div>
														)}

													{question.type === 'true-false' && (
														<div className='space-y-2'>
															<div
																className={`p-2 rounded border ${
																	isCorrectTrue
																		? 'bg-green-50 border-green-200 text-green-800'
																		: userAnswer === true &&
																		  correctBoolean !== null &&
																		  !isCorrectTrue
																		? 'bg-red-50 border-red-200 text-red-800'
																		: 'bg-gray-50 border-gray-200'
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
																className={`p-2 rounded border ${
																	isCorrectFalse
																		? 'bg-green-50 border-green-200 text-green-800'
																		: userAnswer === false &&
																		  correctBoolean !== null &&
																		  !isCorrectFalse
																		? 'bg-red-50 border-red-200 text-red-800'
																		: 'bg-gray-50 border-gray-200'
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
														<div className='mt-3 p-3 bg-blue-50 border-l-4 border-blue-400'>
															<p className='text-sm text-blue-800'>
																<strong>Explanation:</strong>{' '}
																{question.explanation}
															</p>
														</div>
													)}
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					)}

					{/* Actions */}
					<div className='flex flex-col sm:flex-row gap-4 justify-center'>
						<button
							onClick={() => navigate('/test-hub')}
							className='px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors'>
							Browse More Tests
						</button>

						<button
							onClick={() => navigate('/dashboard')}
							className='px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors'>
							Back to Dashboard
						</button>

						{result && !result.passed && (
							<button
								onClick={() =>
									navigate('/test-taking', { state: { testId: test?.id } })
								}
								className='px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2'>
								<RotateCcw className='h-4 w-4' />
								Retake Test
							</button>
						)}
					</div>
				</div>
			</div>
		);
	} catch (err) {
		const error = err instanceof Error ? err : new Error('Unknown error');
		console.error('Error rendering TestResultsPage:', err);
		return (
			<div className='min-h-screen bg-white flex items-center justify-center'>
				<div className='text-center'>
					<p className='text-red-600 mb-4'>
						Error displaying results: {error.message}
					</p>
					<button
						onClick={() => navigate('/test-hub')}
						className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg'>
						Back to Test Hub
					</button>
				</div>
			</div>
		);
	}
};

export default TestResultsPage;
