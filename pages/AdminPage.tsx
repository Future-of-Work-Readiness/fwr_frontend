import React, { useState, useEffect } from 'react';
import type {
	AdminTab,
	AdminStats,
	AdminSector,
	AdminBranch,
	AdminSpecialization,
	AdminUser,
	Message,
	FormDataType
} from '../src/types';

const API_BASE = import.meta.env.VITE_API_URL;

interface FormDataState {
	sector: { name: string; description: string };
	branch: { name: string; description: string; sector_id: string };
	specialization: { name: string; description: string; branch_id: string };
	user: {
		name: string;
		email: string;
		readiness_score: string;
		technical_score: string;
	};
}

function AdminPage(): JSX.Element {
	const [activeTab, setActiveTab] = useState<AdminTab>('stats');
	const [stats, setStats] = useState<AdminStats | null>(null);
	const [sectors, setSectors] = useState<AdminSector[]>([]);
	const [branches, setBranches] = useState<AdminBranch[]>([]);
	const [specializations, setSpecializations] = useState<AdminSpecialization[]>(
		[]
	);
	const [users, setUsers] = useState<AdminUser[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<Message | null>(null);

	// Form states
	const [formData, setFormData] = useState<FormDataState>({
		sector: { name: '', description: '' },
		branch: { name: '', description: '', sector_id: '' },
		specialization: { name: '', description: '', branch_id: '' },
		user: { name: '', email: '', readiness_score: '', technical_score: '' }
	});

	useEffect(() => {
		loadData();
	}, [activeTab]);

	const loadData = async (): Promise<void> => {
		setLoading(true);
		try {
			if (activeTab === 'stats') {
				const response = await fetch(`${API_BASE}/admin/stats`);
				const data = (await response.json()) as AdminStats;
				setStats(data);
			} else if (activeTab === 'sectors') {
				const response = await fetch(`${API_BASE}/admin/sectors`);
				const data = (await response.json()) as AdminSector[];
				setSectors(data);
			} else if (activeTab === 'branches') {
				const response = await fetch(`${API_BASE}/admin/branches`);
				const data = (await response.json()) as AdminBranch[];
				setBranches(data);
			} else if (activeTab === 'specializations') {
				const response = await fetch(`${API_BASE}/admin/specializations`);
				const data = (await response.json()) as AdminSpecialization[];
				setSpecializations(data);
			} else if (activeTab === 'users') {
				const response = await fetch(`${API_BASE}/admin/users`);
				const data = (await response.json()) as AdminUser[];
				setUsers(data);
			}
		} catch (error) {
			const err = error instanceof Error ? error : new Error('Unknown error');
			showMessage('Error loading data: ' + err.message, 'error');
		} finally {
			setLoading(false);
		}
	};

	const showMessage = (
		msg: string,
		type: 'success' | 'error' = 'success'
	): void => {
		setMessage({ text: msg, type });
		setTimeout(() => setMessage(null), 3000);
	};

	const handleCreate = async (type: FormDataType): Promise<void> => {
		setLoading(true);
		try {
			const endpoint = `${API_BASE}/admin/${type}`;
			// Map form data keys to API endpoints
			const formKey =
				type === 'sectors'
					? 'sector'
					: type === 'branches'
					? 'branch'
					: type === 'specializations'
					? 'specialization'
					: type === 'users'
					? 'user'
					: type;
			const data = formData[formKey as keyof FormDataState];

			const response = await fetch(endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			});

			if (!response.ok) {
				const error = (await response.json()) as { detail?: string };
				throw new Error(error.detail || 'Failed to create');
			}

			showMessage(`${type} created successfully!`, 'success');
			setFormData((prev) => ({
				...prev,
				[type]:
					type === 'sector'
						? { name: '', description: '' }
						: type === 'branch'
						? { name: '', description: '', sector_id: '' }
						: type === 'specialization'
						? { name: '', description: '', branch_id: '' }
						: { name: '', email: '', readiness_score: '', technical_score: '' }
			}));
			loadData();
		} catch (error) {
			const err = error instanceof Error ? error : new Error('Unknown error');
			showMessage(err.message, 'error');
		} finally {
			setLoading(false);
		}
	};

	const handleUpdate = async (
		type: FormDataType,
		id: string | number,
		updates: Record<string, unknown>
	): Promise<void> => {
		setLoading(true);
		try {
			const response = await fetch(`${API_BASE}/admin/${type}/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updates)
			});

			if (!response.ok) throw new Error('Failed to update');

			showMessage(`${type} updated successfully!`, 'success');
			loadData();
		} catch (error) {
			const err = error instanceof Error ? error : new Error('Unknown error');
			showMessage(err.message, 'error');
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (
		type: FormDataType,
		id: string | number
	): Promise<void> => {
		if (!window.confirm(`Are you sure you want to delete this ${type}?`))
			return;

		setLoading(true);
		try {
			const response = await fetch(`${API_BASE}/admin/${type}/${id}`, {
				method: 'DELETE'
			});

			if (!response.ok) throw new Error('Failed to delete');

			showMessage(`${type} deleted successfully!`, 'success');
			loadData();
		} catch (error) {
			const err = error instanceof Error ? error : new Error('Unknown error');
			showMessage(err.message, 'error');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-gray-50 p-8'>
			<div className='max-w-7xl mx-auto'>
				<h1 className='text-3xl font-bold text-gray-900 mb-8'>
					📊 Database Admin Panel
				</h1>

				{message && (
					<div
						className={`mb-4 p-4 rounded ${
							message.type === 'success'
								? 'bg-green-100 text-green-800'
								: 'bg-red-100 text-red-800'
						}`}>
						{message.text}
					</div>
				)}

				{/* Tabs */}
				<div className='flex space-x-4 mb-6 border-b'>
					{(
						[
							'stats',
							'sectors',
							'branches',
							'specializations',
							'users'
						] as AdminTab[]
					).map((tab) => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`px-4 py-2 font-medium ${
								activeTab === tab
									? 'border-b-2 border-blue-500 text-blue-600'
									: 'text-gray-600 hover:text-gray-900'
							}`}>
							{tab.charAt(0).toUpperCase() + tab.slice(1)}
						</button>
					))}
				</div>

				{/* Content */}
				{loading && <div className='text-center py-8'>Loading...</div>}

				{activeTab === 'stats' && stats && (
					<div className='bg-white rounded-lg shadow p-6'>
						<h2 className='text-2xl font-bold mb-4'>Database Statistics</h2>
						<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
							<div className='p-4 bg-blue-50 rounded'>
								<div className='text-2xl font-bold text-blue-600'>
									{stats.sectors}
								</div>
								<div className='text-sm text-gray-600'>Total Sectors</div>
							</div>
							<div className='p-4 bg-green-50 rounded'>
								<div className='text-2xl font-bold text-green-600'>
									{stats.branches}
								</div>
								<div className='text-sm text-gray-600'>Total Branches</div>
							</div>
							<div className='p-4 bg-purple-50 rounded'>
								<div className='text-2xl font-bold text-purple-600'>
									{stats.specializations}
								</div>
								<div className='text-sm text-gray-600'>Specializations</div>
							</div>
							<div className='p-4 bg-yellow-50 rounded'>
								<div className='text-2xl font-bold text-yellow-600'>
									{stats.users}
								</div>
								<div className='text-sm text-gray-600'>Total Users</div>
							</div>
							<div className='p-4 bg-indigo-50 rounded'>
								<div className='text-2xl font-bold text-indigo-600'>
									{stats.quizzes}
								</div>
								<div className='text-sm text-gray-600'>Quizzes</div>
							</div>
							<div className='p-4 bg-pink-50 rounded'>
								<div className='text-2xl font-bold text-pink-600'>
									{stats.quiz_attempts}
								</div>
								<div className='text-sm text-gray-600'>Quiz Attempts</div>
							</div>
							<div className='p-4 bg-teal-50 rounded'>
								<div className='text-2xl font-bold text-teal-600'>
									{stats.avg_readiness_score.toFixed(1)}
								</div>
								<div className='text-sm text-gray-600'>Avg Readiness Score</div>
							</div>
						</div>
					</div>
				)}

				{activeTab === 'sectors' && (
					<div className='space-y-6'>
						{/* Create Form */}
						<div className='bg-white rounded-lg shadow p-6'>
							<h2 className='text-xl font-bold mb-4'>Create New Sector</h2>
							<div className='grid grid-cols-2 gap-4'>
								<input
									type='text'
									placeholder='Sector Name'
									value={formData.sector.name}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											sector: { ...prev.sector, name: e.target.value }
										}))
									}
									className='px-4 py-2 border rounded'
								/>
								<input
									type='text'
									placeholder='Description'
									value={formData.sector.description}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											sector: { ...prev.sector, description: e.target.value }
										}))
									}
									className='px-4 py-2 border rounded'
								/>
							</div>
							<button
								onClick={() => handleCreate('sectors')}
								className='mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>
								Create Sector
							</button>
						</div>

						{/* List */}
						<div className='bg-white rounded-lg shadow p-6'>
							<h2 className='text-xl font-bold mb-4'>All Sectors</h2>
							<div className='overflow-x-auto'>
								<table className='w-full'>
									<thead className='bg-gray-50'>
										<tr>
											<th className='px-4 py-2 text-left'>ID</th>
											<th className='px-4 py-2 text-left'>Name</th>
											<th className='px-4 py-2 text-left'>Description</th>
											<th className='px-4 py-2 text-left'>Branches</th>
											<th className='px-4 py-2 text-left'>Actions</th>
										</tr>
									</thead>
									<tbody>
										{sectors.map((sector) => (
											<tr key={sector.id} className='border-t'>
												<td className='px-4 py-2'>{sector.id}</td>
												<td className='px-4 py-2'>{sector.name}</td>
												<td className='px-4 py-2'>
													{sector.description || '-'}
												</td>
												<td className='px-4 py-2'>{sector.branch_count}</td>
												<td className='px-4 py-2'>
													<button
														onClick={() => handleDelete('sectors', sector.id)}
														className='px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700'>
														Delete
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				)}

				{activeTab === 'branches' && (
					<div className='bg-white rounded-lg shadow p-6'>
						<h2 className='text-xl font-bold mb-4'>All Branches</h2>
						<div className='overflow-x-auto'>
							<table className='w-full'>
								<thead className='bg-gray-50'>
									<tr>
										<th className='px-4 py-2 text-left'>ID</th>
										<th className='px-4 py-2 text-left'>Name</th>
										<th className='px-4 py-2 text-left'>Sector</th>
										<th className='px-4 py-2 text-left'>Specializations</th>
										<th className='px-4 py-2 text-left'>Actions</th>
									</tr>
								</thead>
								<tbody>
									{branches.map((branch) => (
										<tr key={branch.id} className='border-t'>
											<td className='px-4 py-2'>{branch.id}</td>
											<td className='px-4 py-2'>{branch.name}</td>
											<td className='px-4 py-2'>{branch.sector_name}</td>
											<td className='px-4 py-2'>
												{branch.specialization_count}
											</td>
											<td className='px-4 py-2'>
												<button
													onClick={() => handleDelete('branches', branch.id)}
													className='px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700'>
													Delete
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}

				{activeTab === 'specializations' && (
					<div className='bg-white rounded-lg shadow p-6'>
						<h2 className='text-xl font-bold mb-4'>All Specializations</h2>
						<div className='overflow-x-auto'>
							<table className='w-full'>
								<thead className='bg-gray-50'>
									<tr>
										<th className='px-4 py-2 text-left'>ID</th>
										<th className='px-4 py-2 text-left'>Name</th>
										<th className='px-4 py-2 text-left'>Branch</th>
										<th className='px-4 py-2 text-left'>Sector</th>
										<th className='px-4 py-2 text-left'>Quizzes</th>
										<th className='px-4 py-2 text-left'>Actions</th>
									</tr>
								</thead>
								<tbody>
									{specializations.map((spec) => (
										<tr key={spec.id} className='border-t'>
											<td className='px-4 py-2'>{spec.id}</td>
											<td className='px-4 py-2'>{spec.name}</td>
											<td className='px-4 py-2'>{spec.branch_name}</td>
											<td className='px-4 py-2'>{spec.sector_name}</td>
											<td className='px-4 py-2'>{spec.quiz_count}</td>
											<td className='px-4 py-2'>
												<button
													onClick={() =>
														handleDelete('specializations', spec.id)
													}
													className='px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700'>
													Delete
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}

				{activeTab === 'users' && (
					<div className='bg-white rounded-lg shadow p-6'>
						<h2 className='text-xl font-bold mb-4'>All Users</h2>
						<div className='overflow-x-auto'>
							<table className='w-full'>
								<thead className='bg-gray-50'>
									<tr>
										<th className='px-4 py-2 text-left'>ID</th>
										<th className='px-4 py-2 text-left'>Name</th>
										<th className='px-4 py-2 text-left'>Email</th>
										<th className='px-4 py-2 text-left'>Specialization</th>
										<th className='px-4 py-2 text-left'>Readiness Score</th>
										<th className='px-4 py-2 text-left'>Actions</th>
									</tr>
								</thead>
								<tbody>
									{users.map((user) => (
										<tr key={user.id} className='border-t'>
											<td className='px-4 py-2'>{user.id}</td>
											<td className='px-4 py-2'>{user.name}</td>
											<td className='px-4 py-2'>{user.email}</td>
											<td className='px-4 py-2'>
												{user.specialization_name || '-'}
											</td>
											<td className='px-4 py-2'>
												{user.readiness_score.toFixed(1)}
											</td>
											<td className='px-4 py-2'>
												<button
													onClick={() =>
														handleUpdate('users', user.id, {
															readiness_score: 90
														})
													}
													className='px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 mr-2'>
													Update
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default AdminPage;
