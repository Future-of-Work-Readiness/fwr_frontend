import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Target,
	Plus,
	Edit2,
	Trash2,
	BookOpen,
	TrendingUp,
	CheckCircle
} from 'lucide-react';
import { buttonStyles } from '../utils/designSystem';
import type { User } from '../src/types';

interface Goal {
	id: number | string;
	title: string;
	description?: string;
	category: string;
	target_value: number;
	current_value: number;
	target_date?: string;
	is_completed?: boolean;
}

interface JournalEntry {
	id: number | string;
	prompt?: string;
	content: string;
	entry_date: string;
}

interface ReadinessData {
	overall: number;
	technical: number;
	soft: number;
	leadership?: number;
}

export default function GoalsPage(): JSX.Element {
	const navigate = useNavigate();
	const [user, setUser] = useState<User | null>(null);
	const [readiness, setReadiness] = useState<ReadinessData | null>(null);
	const [goals, setGoals] = useState<Goal[]>([]);
	const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// Form states
	const [showGoalForm, setShowGoalForm] = useState<boolean>(false);
	const [showJournalForm, setShowJournalForm] = useState<boolean>(false);
	const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

	interface GoalFormData {
		title: string;
		description: string;
		category: string;
		target_value: number;
		target_date: string;
	}

	const [goalForm, setGoalForm] = useState<GoalFormData>({
		title: '',
		description: '',
		category: 'readiness',
		target_value: 0,
		target_date: ''
	});

	interface JournalFormData {
		prompt: string;
		content: string;
	}

	const [journalForm, setJournalForm] = useState<JournalFormData>({
		prompt: '',
		content: ''
	});

	useEffect(() => {
		const userData = localStorage.getItem('currentUser');
		if (!userData) {
			navigate('/');
			return;
		}
		const parsed = JSON.parse(userData);
		setUser(parsed);
		fetchData(parsed.id);
	}, [navigate]);

	const fetchData = async (userId: number | string): Promise<void> => {
		setLoading(true);
		setError(null);
		try {
			// Fetch readiness
			const readinessRes = await fetch(
				`http://localhost:8000/api/dashboard?user_id=${userId}`
			);
			if (readinessRes.ok) {
				const readinessData = await readinessRes.json();
				setReadiness(readinessData.readiness as ReadinessData);
			}

			// Fetch goals
			const goalsRes = await fetch(
				`http://localhost:8000/api/goals?user_id=${userId}`
			);
			if (goalsRes.ok) {
				const goalsData = await goalsRes.json();
				setGoals(goalsData as Goal[]);
			}

			// Fetch journal entries
			const journalRes = await fetch(
				`http://localhost:8000/api/journal?user_id=${userId}&limit=10`
			);
			if (journalRes.ok) {
				const journalData = await journalRes.json();
				setJournalEntries(journalData as JournalEntry[]);
			}
		} catch {
			setError('Failed to load data');
		} finally {
			setLoading(false);
		}
	};

	const handleCreateGoal = async (
		e: React.FormEvent<HTMLFormElement>
	): Promise<void> => {
		e.preventDefault();
		if (!user) return;
		console.log('Creating goal with form data:', goalForm);
		try {
			let formattedDate: string | null = null;
			if (goalForm.target_date) {
				// Convert YYYY-MM-DD to YYYY-MM-DDT00:00:00
				formattedDate =
					goalForm.target_date.length === 10
						? `${goalForm.target_date}T00:00:00`
						: goalForm.target_date;
			}
			const payload = {
				...goalForm,
				target_date: formattedDate
			};
			console.log('Sending payload:', payload);

			const res = await fetch(
				`http://localhost:8000/api/goals?user_id=${user.id}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload)
				}
			);

			console.log('Response status:', res.status);

			if (res.ok) {
				const result = await res.json();
				console.log('Goal created successfully:', result);
				await fetchData(user.id);
				setShowGoalForm(false);
				setGoalForm({
					title: '',
					description: '',
					category: 'readiness',
					target_value: 0,
					target_date: ''
				});
				alert('Goal created successfully!');
			} else {
				const errorData = await res.text();
				console.error('Failed to create goal:', errorData);
				alert('Failed to create goal: ' + errorData);
			}
		} catch (e) {
			const err = e instanceof Error ? e : new Error('Unknown error');
			console.error('Error creating goal:', e);
			alert('Failed to create goal: ' + err.message);
		}
	};

	const handleUpdateGoal = async (
		e: React.FormEvent<HTMLFormElement>
	): Promise<void> => {
		e.preventDefault();
		if (!user || !editingGoal) return;
		try {
			const res = await fetch(
				`http://localhost:8000/api/goals/${editingGoal.id}?user_id=${user.id}`,
				{
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(goalForm)
				}
			);
			if (res.ok) {
				await fetchData(user.id);
				setEditingGoal(null);
				setShowGoalForm(false);
				setGoalForm({
					title: '',
					description: '',
					category: 'readiness',
					target_value: 0,
					target_date: ''
				});
			}
		} catch (e) {
			const err = e instanceof Error ? e : new Error('Unknown error');
			alert('Failed to update goal: ' + err.message);
		}
	};

	const handleDeleteGoal = async (goalId: number | string): Promise<void> => {
		if (!user) return;
		if (!window.confirm('Are you sure you want to delete this goal?')) return;
		try {
			const res = await fetch(
				`http://localhost:8000/api/goals/${goalId}?user_id=${user.id}`,
				{
					method: 'DELETE'
				}
			);
			if (res.ok) {
				await fetchData(user.id);
			}
		} catch (e) {
			const err = e instanceof Error ? e : new Error('Unknown error');
			alert('Failed to delete goal: ' + err.message);
		}
	};

	const handleUpdateProgress = async (
		goalId: number | string,
		currentValue: number
	): Promise<void> => {
		if (!user) return;
		try {
			const res = await fetch(
				`http://localhost:8000/api/goals/${goalId}/progress?user_id=${user.id}&current_value=${currentValue}`,
				{
					method: 'PATCH'
				}
			);
			if (res.ok) {
				await fetchData(user.id);
			}
		} catch (e) {
			const err = e instanceof Error ? e : new Error('Unknown error');
			alert('Failed to update progress: ' + err.message);
		}
	};

	const handleCreateJournal = async (
		e: React.FormEvent<HTMLFormElement>
	): Promise<void> => {
		e.preventDefault();
		if (!user) return;
		try {
			const res = await fetch(
				`http://localhost:8000/api/journal?user_id=${user.id}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(journalForm)
				}
			);
			if (res.ok) {
				await fetchData(user.id);
				setShowJournalForm(false);
				setJournalForm({ prompt: '', content: '' });
			}
		} catch (e) {
			const err = e instanceof Error ? e : new Error('Unknown error');
			alert('Failed to create journal entry: ' + err.message);
		}
	};

	const handleDeleteJournal = async (
		entryId: number | string
	): Promise<void> => {
		if (!user) return;
		if (!window.confirm('Are you sure you want to delete this journal entry?'))
			return;
		try {
			const res = await fetch(
				`http://localhost:8000/api/journal/${entryId}?user_id=${user.id}`,
				{
					method: 'DELETE'
				}
			);
			if (res.ok) {
				await fetchData(user.id);
			}
		} catch (e) {
			const err = e instanceof Error ? e : new Error('Unknown error');
			alert('Failed to delete journal entry: ' + err.message);
		}
	};

	const startEditGoal = (goal: Goal): void => {
		setEditingGoal(goal);
		setGoalForm({
			title: goal.title,
			description: goal.description || '',
			category: goal.category,
			target_value: goal.target_value,
			target_date: goal.target_date ? goal.target_date.split('T')[0] : ''
		});
		setShowGoalForm(true);
	};

	if (loading) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
					<p className='text-gray-600'>Loading...</p>
				</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center'>
				<div className='text-center'>
					<p className='text-gray-600'>Loading...</p>
				</div>
			</div>
		);
	}

	const currentReadiness: ReadinessData = readiness || {
		overall: user?.readiness_score || 0,
		technical: user?.technical_score || 0,
		soft: user?.soft_skills_score || 0
	};

	const getProgressPercentage = (goal: Goal): number => {
		if (goal.target_value === 0) return 0;
		return Math.min(
			100,
			Math.round((goal.current_value / goal.target_value) * 100)
		);
	};

	const journalPrompts = [
		'What was my biggest challenge this week?',
		'What skill do I want to develop next?',
		'What progress have I made toward my goals?',
		'What obstacles am I facing?',
		'What am I grateful for in my learning journey?'
	];

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{/* Header */}
				<div className='mb-8 flex items-center justify-between'>
					<div>
						<h1 className='text-4xl font-bold text-gray-900 mb-2'>
							Self-Reflection & Goals
						</h1>
						<p className='text-gray-600'>
							Track your progress and reflect on your journey
						</p>
					</div>
					<button
						onClick={() => navigate('/dashboard')}
						className='px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors'>
						Back to Dashboard
					</button>
				</div>

				{/* Two-Column Layout */}
				{error && (
					<div className='mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
						{error}
					</div>
				)}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					{/* Where I Am Now */}
					<div className='bg-white rounded-xl shadow-lg p-6'>
						<h2 className='text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2'>
							<Target className='h-6 w-6 text-blue-600' />
							Where I Am Now
						</h2>
						<div className='space-y-4'>
							<div className='p-4 bg-blue-50 rounded-lg'>
								<div className='text-sm text-gray-600 mb-1'>
									Overall Readiness
								</div>
								<div className='text-3xl font-bold text-blue-600'>
									{Math.round(currentReadiness.overall)}%
								</div>
							</div>
							<div className='p-4 bg-green-50 rounded-lg'>
								<div className='text-sm text-gray-600 mb-1'>
									Technical Skills
								</div>
								<div className='text-3xl font-bold text-green-600'>
									{Math.round(currentReadiness.technical)}%
								</div>
							</div>
							<div className='p-4 bg-yellow-50 rounded-lg'>
								<div className='text-sm text-gray-600 mb-1'>Soft Skills</div>
								<div className='text-3xl font-bold text-yellow-600'>
									{Math.round(currentReadiness.soft)}%
								</div>
							</div>
						</div>
					</div>

					{/* Where I Want To Be */}
					<div className='bg-white rounded-xl shadow-lg p-6'>
						<h2 className='text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2'>
							<TrendingUp className='h-6 w-6 text-purple-600' />
							Where I Want To Be
						</h2>
						{!showGoalForm ? (
							<button
								onClick={() => {
									setEditingGoal(null);
									setGoalForm({
										title: '',
										description: '',
										category: 'readiness',
										target_value: 0,
										target_date: ''
									});
									setShowGoalForm(true);
								}}
								className='w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition-colors flex items-center justify-center gap-2 text-gray-600'>
								<Plus className='h-5 w-5' />
								Set a New Goal
							</button>
						) : (
							<form
								onSubmit={editingGoal ? handleUpdateGoal : handleCreateGoal}
								className='space-y-4'>
								<input
									type='text'
									placeholder='Goal Title'
									value={goalForm.title}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										setGoalForm({ ...goalForm, title: e.target.value })
									}
									className='w-full p-3 border border-gray-300 rounded-lg'
									required
								/>
								<textarea
									placeholder='Description (optional)'
									value={goalForm.description}
									onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
										setGoalForm({ ...goalForm, description: e.target.value })
									}
									className='w-full p-3 border border-gray-300 rounded-lg'
									rows={2}
								/>
								<select
									value={goalForm.category}
									onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
										setGoalForm({ ...goalForm, category: e.target.value })
									}
									className='w-full p-3 border border-gray-300 rounded-lg'>
									<option value='readiness'>Overall Readiness</option>
									<option value='technical'>Technical Skills</option>
									<option value='soft_skills'>Soft Skills</option>
									<option value='leadership'>Leadership</option>
								</select>
								<input
									type='number'
									placeholder='Target Value (%)'
									value={goalForm.target_value}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										setGoalForm({
											...goalForm,
											target_value: parseFloat(e.target.value) || 0
										})
									}
									className='w-full p-3 border border-gray-300 rounded-lg'
									min='0'
									max='100'
									step='0.1'
									required
								/>
								<input
									type='date'
									value={goalForm.target_date}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										setGoalForm({ ...goalForm, target_date: e.target.value })
									}
									className='w-full p-3 border border-gray-300 rounded-lg'
								/>
								<div className='flex gap-2'>
									<button
										type='submit'
										className={`${buttonStyles.primary} flex-1 px-4 py-2`}
										onClick={() => console.log('Create Goal button clicked!')}>
										{editingGoal ? 'Update Goal' : 'Create Goal'}
									</button>
									<button
										type='button'
										onClick={() => {
											setShowGoalForm(false);
											setEditingGoal(null);
										}}
										className='px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg'>
										Cancel
									</button>
								</div>
							</form>
						)}
					</div>
				</div>

				{/* Goal Tracking Dashboard */}
				<div className='bg-white rounded-xl shadow-lg p-6 mb-8'>
					<h2 className='text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2'>
						<CheckCircle className='h-6 w-6 text-green-600' />
						Goal Tracking Dashboard
					</h2>
					{goals.length === 0 ? (
						<div className='text-center py-8 text-gray-500'>
							<p>No goals set yet. Create your first goal above!</p>
						</div>
					) : (
						<div className='space-y-4'>
							{goals.map((goal) => {
								const progress = getProgressPercentage(goal);
								return (
									<div
										key={goal.id}
										className='border border-gray-200 rounded-lg p-4'>
										<div className='flex items-start justify-between mb-2'>
											<div className='flex-1'>
												<h3 className='font-semibold text-lg text-gray-900'>
													{goal.title}
												</h3>
												{goal.description && (
													<p className='text-sm text-gray-600 mt-1'>
														{goal.description}
													</p>
												)}
												<div className='mt-2 flex items-center gap-4 text-sm text-gray-500'>
													<span className='capitalize'>
														{goal.category.replace('_', ' ')}
													</span>
													<span>Target: {goal.target_value}%</span>
													{goal.target_date && (
														<span>
															By:{' '}
															{new Date(goal.target_date).toLocaleDateString()}
														</span>
													)}
													{goal.is_completed && (
														<span className='text-green-600 font-semibold'>
															✓ Completed
														</span>
													)}
												</div>
											</div>
											<div className='flex gap-2'>
												<button
													onClick={() => startEditGoal(goal)}
													className='p-2 text-blue-600 hover:bg-blue-50 rounded'>
													<Edit2 className='h-4 w-4' />
												</button>
												<button
													onClick={() => handleDeleteGoal(goal.id)}
													className='p-2 text-red-600 hover:bg-red-50 rounded'>
													<Trash2 className='h-4 w-4' />
												</button>
											</div>
										</div>
										<div className='mt-3'>
											<div className='flex items-center justify-between mb-1'>
												<span className='text-sm text-gray-600'>
													Progress: {goal.current_value.toFixed(1)}% /{' '}
													{goal.target_value}%
												</span>
												<span className='text-sm font-semibold text-gray-900'>
													{progress}%
												</span>
											</div>
											<div className='w-full bg-gray-200 rounded-full h-3'>
												<div
													className={`h-3 rounded-full transition-all ${
														goal.is_completed ? 'bg-green-500' : 'bg-blue-500'
													}`}
													style={{ width: `${progress}%` }}
												/>
											</div>
											{!goal.is_completed && (
												<div className='mt-2'>
													<input
														type='number'
														placeholder='Update progress'
														min='0'
														max={goal.target_value}
														step='0.1'
														className='w-32 p-1 border border-gray-300 rounded text-sm'
														onKeyPress={(
															e: React.KeyboardEvent<HTMLInputElement>
														) => {
															if (e.key === 'Enter') {
																const value = parseFloat(e.currentTarget.value);
																if (!isNaN(value)) {
																	handleUpdateProgress(goal.id, value);
																	e.currentTarget.value = '';
																}
															}
														}}
													/>
												</div>
											)}
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>

				{/* Self-Reflection Journal */}
				<div className='bg-white rounded-xl shadow-lg p-6'>
					<div className='flex items-center justify-between mb-4'>
						<h2 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
							<BookOpen className='h-6 w-6 text-indigo-600' />
							Self-Reflection Journal
						</h2>
						{!showJournalForm && (
							<button
								onClick={() => {
									setJournalForm({ prompt: '', content: '' });
									setShowJournalForm(true);
								}}
								className='px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2'>
								<Plus className='h-4 w-4' />
								New Entry
							</button>
						)}
					</div>

					{showJournalForm && (
						<form
							onSubmit={handleCreateJournal}
							className='mb-6 space-y-4 border-b pb-6'>
							<select
								value={journalForm.prompt}
								onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
									setJournalForm({ ...journalForm, prompt: e.target.value })
								}
								className='w-full p-3 border border-gray-300 rounded-lg'>
								<option value=''>Select a prompt (optional)</option>
								{journalPrompts.map((prompt, idx) => (
									<option key={idx} value={prompt}>
										{prompt}
									</option>
								))}
							</select>
							<textarea
								placeholder='Write your reflection here...'
								value={journalForm.content}
								onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
									setJournalForm({ ...journalForm, content: e.target.value })
								}
								className='w-full p-3 border border-gray-300 rounded-lg'
								rows={6}
								required
							/>
							<div className='flex gap-2'>
								<button
									type='submit'
									className='px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg'>
									Save Entry
								</button>
								<button
									type='button'
									onClick={() => {
										setShowJournalForm(false);
										setJournalForm({ prompt: '', content: '' });
									}}
									className='px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg'>
									Cancel
								</button>
							</div>
						</form>
					)}

					{journalEntries.length === 0 ? (
						<div className='text-center py-8 text-gray-500'>
							<p>No journal entries yet. Start reflecting on your journey!</p>
						</div>
					) : (
						<div className='space-y-4'>
							{journalEntries.map((entry) => (
								<div
									key={entry.id}
									className='border border-gray-200 rounded-lg p-4'>
									{entry.prompt && (
										<div className='text-sm font-semibold text-indigo-600 mb-2'>
											{entry.prompt}
										</div>
									)}
									<p className='text-gray-700 whitespace-pre-wrap'>
										{entry.content}
									</p>
									<div className='mt-3 flex items-center justify-between'>
										<span className='text-xs text-gray-500'>
											{new Date(entry.entry_date).toLocaleDateString()}
										</span>
										<button
											onClick={() => handleDeleteJournal(entry.id)}
											className='text-xs text-red-600 hover:text-red-800'>
											Delete
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
