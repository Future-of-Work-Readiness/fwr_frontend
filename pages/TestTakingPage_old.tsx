import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
	Clock,
	CheckCircle,
	XCircle,
	ArrowLeft,
	ArrowRight
} from 'lucide-react';
import { getCurrentUser } from '../utils/auth';
import {
	getTestForSpecialization,
	calculateTestScore,
	saveTestResult
} from '../utils/testSystem';
import type { User, Test, TestResult } from '../src/types';

export default function TestTakingPage(): JSX.Element {
	const navigate = useNavigate();
	const { testType = 'knowledge' } = useParams<{ testType?: string }>(); // knowledge or skill
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [testData, setTestData] = useState<Test | null>(null);
	const [currentQuestion, setCurrentQuestion] = useState<number>(0);
	const [answers, setAnswers] = useState<
		Record<string | number, number | boolean>
	>({});
	const [timeLeft, setTimeLeft] = useState<number>(0);
	const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
	const [testResult, setTestResult] = useState<TestResult | null>(null);
	const [startTime, setStartTime] = useState<number | null>(null);

	useEffect(() => {
		const user = getCurrentUser();
		if (!user) {
			navigate('/');
			return;
		}

		setCurrentUser(user);

		// Load test based on user's specialization
		const userIndustry = (
			user as unknown as {
				industry?: {
					industry: string;
					branch: string;
					specialization: string;
				};
			}
		).industry;
		if (userIndustry && typeof userIndustry === 'object') {
			const test = getTestForSpecialization(
				userIndustry.industry,
				userIndustry.branch,
				userIndustry.specialization
			);

			if (test) {
				setTestData(test);
				setTimeLeft((test.duration || 30) * 60); // Convert minutes to seconds
				setStartTime(Date.now());
			} else {
				// No test available for this specialization
				setTestData(null);
			}
		}
	}, [navigate]);

	// Timer countdown
	useEffect(() => {
		if (timeLeft > 0 && !isSubmitted) {
			const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
			return () => clearTimeout(timer);
		} else if (timeLeft === 0 && !isSubmitted) {
			handleSubmitTest();
		}
	}, [timeLeft, isSubmitted]);

	const handleAnswerSelect = (
		questionId: string | number,
		answer: number | boolean
	): void => {
		setAnswers({
			...answers,
			[questionId]: answer
		});
	};

	const handleSubmitTest = (): void => {
		if (isSubmitted || !testData || !currentUser || !startTime) return;

		const timeSpent = Math.round((Date.now() - startTime) / 1000); // in seconds
		const totalQuestions = testData.questions?.length || 0;
		const correctAnswers = (testData.questions || []).map((q) => q.correct);
		const userAnswers = (testData.questions || []).map((q) => answers[q.id]);
		const score = calculateTestScore(userAnswers, correctAnswers);
		const correctCount = (testData.questions || []).reduce(
			(count, question) => {
				const answer = answers[question.id];
				return answer === question.correct ? count + 1 : count;
			},
			0
		);

		const userIndustry = (
			currentUser as unknown as {
				industry?: {
					industry: string;
					branch: string;
					specialization: string;
				};
			}
		).industry;
		const testId = userIndustry
			? `${userIndustry.industry}-${userIndustry.branch}-${userIndustry.specialization}`
			: testData.id.toString();

		saveTestResult(currentUser.id, testId, score, userAnswers, timeSpent);

		const normalizedResult: TestResult = {
			testId,
			score,
			correct: correctCount,
			total: totalQuestions,
			timeSpent,
			passed: score >= 70,
			answers
		};

		setTestResult(normalizedResult);
		setIsSubmitted(true);
	};

	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	const getScoreColor = (score: number): string => {
		if (score >= 90) return 'text-green-600';
		if (score >= 70) return 'text-blue-600';
		if (score >= 50) return 'text-yellow-600';
		return 'text-red-600';
	};

	const getScoreMessage = (score: number): string => {
		if (score >= 90) return 'Excellent! Outstanding performance!';
		if (score >= 70) return 'Great job! You passed the test!';
		if (score >= 50) return 'Good effort! Consider reviewing the material.';
		return 'Keep learning! Review the concepts and try again.';
	};

	if (!currentUser) {
		return <div>Loading...</div>;
	}

	if (!testData) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
				<div className='max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center'>
					<h1 className='text-2xl font-bold text-gray-800 mb-4'>
						No Test Available
					</h1>
					<p className='text-gray-600 mb-6'>
						There's no test available for your specialization yet. Check back
						later!
					</p>
					<button
						onClick={() => navigate('/dashboard')}
						className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold'>
						Back to Dashboard
					</button>
				</div>
			</div>
		);
	}

	if (isSubmitted && testResult) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
				<div className='max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center'>
					<div className='mb-6'>
						{testResult.passed ? (
							<CheckCircle className='w-16 h-16 text-green-500 mx-auto mb-4' />
						) : (
							<XCircle className='w-16 h-16 text-red-500 mx-auto mb-4' />
						)}
						<h1 className='text-3xl font-bold text-gray-800 mb-2'>
							Test Complete!
						</h1>
						<p
							className={`text-4xl font-bold mb-2 ${getScoreColor(
								testResult.score
							)}`}>
							{testResult.score}%
						</p>
						<p className='text-gray-600 mb-4'>
							{getScoreMessage(testResult.score)}
						</p>
					</div>

					<div className='grid grid-cols-2 gap-4 mb-6 text-sm'>
						<div className='bg-gray-50 p-4 rounded-lg'>
							<div className='font-semibold text-gray-800'>Questions</div>
							<div className='text-gray-600'>
								{testData.questions?.length || 0}
							</div>
						</div>
						<div className='bg-gray-50 p-4 rounded-lg'>
							<div className='font-semibold text-gray-800'>Time Spent</div>
							<div className='text-gray-600'>
								{formatTime(testResult.timeSpent)}
							</div>
						</div>
					</div>

					<div className='space-y-3'>
						<button
							onClick={() => navigate('/tests')}
							className='w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold'>
							Take Another Test
						</button>
						<button
							onClick={() => navigate('/dashboard')}
							className='w-full bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold'>
							Back to Dashboard
						</button>
					</div>
				</div>
			</div>
		);
	}

	const currentQ = testData.questions?.[currentQuestion];

	return (
		<div className='min-h-screen bg-gray-50 p-4'>
			<div className='max-w-4xl mx-auto'>
				{/* Header */}
				<div className='bg-white rounded-lg shadow-lg p-6 mb-6'>
					<div className='flex justify-between items-center'>
						<div>
							<h1 className='text-2xl font-bold text-gray-800'>
								{testData.title}
							</h1>
							<p className='text-gray-600'>{testData.description}</p>
						</div>
						<div className='flex items-center space-x-4 text-right'>
							<div>
								<div className='text-sm text-gray-600'>Time Remaining</div>
								<div
									className={`text-lg font-bold ${
										timeLeft < 300 ? 'text-red-600' : 'text-gray-800'
									}`}>
									<Clock className='inline w-4 h-4 mr-1' />
									{formatTime(timeLeft)}
								</div>
							</div>
							<div>
								<div className='text-sm text-gray-600'>Progress</div>
								<div className='text-lg font-bold text-gray-800'>
									{currentQuestion + 1} / {testData.questions?.length || 0}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Progress Bar */}
				<div className='bg-white rounded-lg shadow-lg p-6 mb-6'>
					<div className='w-full bg-gray-200 rounded-full h-2'>
						<div
							className='bg-blue-600 h-2 rounded-full transition-all duration-300'
							style={{
								width: `${
									((currentQuestion + 1) / (testData.questions?.length || 1)) *
									100
								}%`
							}}></div>
					</div>
				</div>

				{/* Question */}
				<div className='bg-white rounded-lg shadow-lg p-8 mb-6'>
					<h2 className='text-xl font-semibold text-gray-800 mb-6'>
						Question {currentQuestion + 1}: {currentQ?.question || ''}
					</h2>

					<div className='space-y-3'>
						{currentQ?.type === 'multiple-choice' &&
							currentQ.options &&
							currentQ.options.map((option, index) => (
								<label
									key={index}
									className={`block p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
										answers[currentQ.id] === index
											? 'border-blue-500 bg-blue-50'
											: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
									}`}>
									<input
										type='radio'
										name={`question-${currentQ.id}`}
										value={index}
										checked={answers[currentQ.id] === index}
										onChange={() => handleAnswerSelect(currentQ.id, index)}
										className='mr-3'
									/>
									<span className='text-gray-800'>{option}</span>
								</label>
							))}

						{currentQ?.type === 'true-false' && (
							<div className='space-y-3'>
								<label
									className={`block p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
										currentQ && answers[currentQ.id] === true
											? 'border-blue-500 bg-blue-50'
											: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
									}`}>
									<input
										type='radio'
										name={`question-${currentQ?.id}`}
										checked={currentQ ? answers[currentQ.id] === true : false}
										onChange={() =>
											currentQ && handleAnswerSelect(currentQ.id, true)
										}
										className='mr-3'
									/>
									<span className='text-gray-800'>True</span>
								</label>
								<label
									className={`block p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
										currentQ && answers[currentQ.id] === false
											? 'border-blue-500 bg-blue-50'
											: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
									}`}>
									<input
										type='radio'
										name={`question-${currentQ?.id}`}
										checked={currentQ ? answers[currentQ.id] === false : false}
										onChange={() =>
											currentQ && handleAnswerSelect(currentQ.id, false)
										}
										className='mr-3'
									/>
									<span className='text-gray-800'>False</span>
								</label>
							</div>
						)}
					</div>
				</div>

				{/* Navigation */}
				<div className='bg-white rounded-lg shadow-lg p-6'>
					<div className='flex justify-between items-center'>
						<button
							onClick={() =>
								setCurrentQuestion(Math.max(0, currentQuestion - 1))
							}
							disabled={currentQuestion === 0}
							className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
								currentQuestion === 0
									? 'bg-gray-200 text-gray-400 cursor-not-allowed'
									: 'bg-gray-300 hover:bg-gray-400 text-gray-700'
							}`}>
							<ArrowLeft size={16} />
							<span>Previous</span>
						</button>

						<div className='text-sm text-gray-600'>
							{Object.keys(answers).length} of {testData.questions?.length || 0}{' '}
							answered
						</div>

						{testData.questions &&
						currentQuestion < testData.questions.length - 1 ? (
							<button
								onClick={() => setCurrentQuestion(currentQuestion + 1)}
								className='flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200'>
								<span>Next</span>
								<ArrowRight size={16} />
							</button>
						) : (
							<button
								onClick={handleSubmitTest}
								disabled={
									Object.keys(answers).length !==
									(testData.questions?.length || 0)
								}
								className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
									Object.keys(answers).length ===
									(testData.questions?.length || 0)
										? 'bg-green-600 hover:bg-green-700 text-white'
										: 'bg-gray-300 text-gray-500 cursor-not-allowed'
								}`}>
								Submit Test
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
