import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	BookOpen,
	Clock,
	User as UserIcon,
	ChevronRight,
	ArrowLeft
} from 'lucide-react';
import { getCurrentUser } from '../utils/auth';
import {
	buttonStyles,
	cardStyles,
	getDifficultyColor
} from '../utils/designSystem';
import type { Test, Quiz } from '../src/types';

const TestHubPage = (): JSX.Element => {
	const navigate = useNavigate();
	const [tests, setTests] = useState<Test[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const currentUser = getCurrentUser();
		if (!currentUser) {
			navigate('/');
			return;
		}

		loadTests();
	}, [navigate]);

	const loadTests = async (): Promise<void> => {
		try {
			setLoading(true);

			// Get user's specialization ID
			const currentUser = getCurrentUser();
			const specializationId = currentUser?.specializationId;

			if (!specializationId) {
				console.error('No specialization ID found for user');
				setTests([]);
				setLoading(false);
				return;
			}

			// Fetch quizzes for user's specialization only
			const url = `http://localhost:8000/api/specializations/${specializationId}/quizzes`;

			const response = await fetch(url);
			if (!response.ok) throw new Error('Failed to fetch quizzes');

			const data = await response.json();
			// Transform database format to frontend format
			const transformedTests: Test[] = (data.quizzes || []).map(
				(quiz: Quiz & { specialization_name?: string }) => ({
					id: quiz.id.toString(),
					title: quiz.title,
					description: quiz.description,
					category: quiz.specialization_name || 'General',
					specialization_id: quiz.specialization_id || specializationId,
					difficulty:
						typeof quiz.difficulty === 'number'
							? ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'][
									quiz.difficulty - 1
							  ] || 'Beginner'
							: quiz.difficulty || 'Beginner',
					estimatedTime: quiz.duration || 30,
					tags: [quiz.specialization_name || 'General'],
					questionCount: quiz.question_count || 0
				})
			);

			setTests(transformedTests);
			setLoading(false);
		} catch (error) {
			console.error('Error loading tests:', error);
			setTests([]);
			setLoading(false);
		}
	};

	const startTest = (test: Test): void => {
		navigate('/test-taking', {
			state: { testId: test.id }
		});
	};

	if (loading) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center'>
				<div className='bg-white p-8 rounded-xl shadow-lg'>
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
					<p className='text-gray-600 mt-4'>Loading tests...</p>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
			{/* Header */}
			<div className='bg-white shadow-sm border-b'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between items-center py-6'>
						<div className='flex items-center gap-4'>
							<button
								onClick={() => navigate('/dashboard')}
								className='p-2 text-gray-600 hover:text-blue-600 transition-colors'>
								<ArrowLeft className='h-5 w-5' />
							</button>
							<div>
								<h1 className='text-3xl font-bold text-gray-900'>
									Knowledge Tests Hub
								</h1>
								<p className='text-gray-600 mt-1'>
									Explore and take comprehensive tests to enhance your skills
								</p>
							</div>
						</div>
						<div className='text-sm text-gray-500'>
							{tests.length} test{tests.length !== 1 ? 's' : ''} available
						</div>
					</div>
				</div>
			</div>

			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{/* Tests Grid */}
				{tests.length === 0 ? (
					<div
						className={`${cardStyles.default} text-center relative overflow-hidden`}>
						{/* Animated background for empty state */}
						<div className='absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50'></div>
						<div className='relative z-10'>
							<div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4'>
								<BookOpen className='h-10 w-10 text-gray-400' />
							</div>
							<h3 className='text-xl font-semibold text-gray-900 mb-2'>
								No Tests Available
							</h3>
							<p className='text-gray-600 mb-4'>
								No tests available for your specialization yet. Check back soon!
							</p>
						</div>
					</div>
				) : (
					<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
						{tests.map((test) => (
							<div
								key={test.id}
								className={`${cardStyles.interactive} group relative overflow-hidden`}>
								{/* Subtle gradient overlay on hover */}
								<div className='absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>

								<div className='relative z-10 p-6'>
									<div className='flex items-start justify-between mb-4'>
										<div className='p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-300'>
											<BookOpen className='h-6 w-6 text-blue-600' />
										</div>
										<div className='flex flex-col items-end gap-2'>
											<span
												className={`text-xs font-medium px-2.5 py-0.5 rounded-full transition-all duration-300 ${getDifficultyColor(
													test.difficulty || 'Beginner'
												)}`}>
												{test.difficulty}
											</span>
											<span className='text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full group-hover:bg-gray-200 transition-colors'>
												{test.category}
											</span>
										</div>
									</div>

									<h3 className='text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors'>
										{test.title}
									</h3>

									<p className='text-gray-600 mb-4 line-clamp-3 text-sm'>
										{test.description}
									</p>

									<div className='flex items-center gap-4 text-sm text-gray-500 mb-6'>
										<div className='flex items-center gap-1'>
											<Clock className='h-4 w-4' />
											<span>{test.estimatedTime} min</span>
										</div>
										<div className='flex items-center gap-1'>
											<UserIcon className='h-4 w-4' />
											<span>{test.questionCount || 0} questions</span>
										</div>
									</div>

									{/* Tags */}
									{test.tags && test.tags.length > 0 && (
										<div className='mb-4'>
											<div className='flex flex-wrap gap-1'>
												{test.tags.slice(0, 3).map((tag, index) => (
													<span
														key={index}
														className='text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded group-hover:bg-blue-100 transition-colors'>
														{tag}
													</span>
												))}
												{test.tags.length > 3 && (
													<span className='text-xs text-gray-500'>
														+{test.tags.length - 3} more
													</span>
												)}
											</div>
										</div>
									)}

									<button
										onClick={() => startTest(test)}
										className={`${buttonStyles.primary} w-full py-3 px-4 flex items-center justify-center gap-2 group-hover:scale-105 transition-all duration-300`}>
										Start Test
										<ChevronRight className='h-4 w-4 group-hover:translate-x-1 transition-transform' />
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default TestHubPage;
