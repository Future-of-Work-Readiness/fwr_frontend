import React, { useState, useEffect } from 'react';
import { getCompleteHierarchy } from '../utils/hierarchicalApi';
import type { Sector, Branch, Specialization } from '../src/types';

interface HierarchicalSector extends Sector {
	branches?: HierarchicalBranch[];
}

interface HierarchicalBranch extends Branch {
	specializations?: Specialization[];
}

const HierarchyTestPage = (): JSX.Element => {
	const [hierarchy, setHierarchy] = useState<HierarchicalSector[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchHierarchy = async (): Promise<void> => {
			try {
				setLoading(true);
				const data = await getCompleteHierarchy();
				setHierarchy(data as HierarchicalSector[]);
				setError(null);
			} catch (err) {
				const error = err instanceof Error ? err : new Error('Unknown error');
				setError(error.message);
				console.error('Error fetching hierarchy:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchHierarchy();
	}, []);

	if (loading) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4'></div>
					<p className='text-gray-600'>Loading sector hierarchy...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<div className='text-center'>
					<div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
						<h3 className='font-bold'>Error Loading Data</h3>
						<p>{error}</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50 py-8'>
			<div className='max-w-6xl mx-auto px-4'>
				<div className='text-center mb-8'>
					<h1 className='text-4xl font-bold text-gray-900 mb-4'>
						Future of Work - Sector Hierarchy
					</h1>
					<p className='text-lg text-gray-600 mb-2'>
						Complete 3-level hierarchy: Sectors → Branches → Specializations
					</p>
					<div className='inline-block bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded'>
						✅ Backend Connection Successful
					</div>
				</div>

				{hierarchy.map((sector) => (
					<div key={sector.id} className='bg-white shadow-lg rounded-lg mb-8'>
						<div className='bg-blue-600 text-white px-6 py-4 rounded-t-lg'>
							<h2 className='text-2xl font-bold'>🏢 {sector.name}</h2>
							<p className='text-blue-100 mt-2'>{sector.description}</p>
							<div className='mt-2 text-sm'>
								<span className='bg-blue-500 px-2 py-1 rounded'>
									{sector.branches?.length || 0} Branches
								</span>
								<span className='bg-blue-500 px-2 py-1 rounded ml-2'>
									{sector.branches?.reduce(
										(total, branch) =>
											total + (branch.specializations?.length || 0),
										0
									)}{' '}
									Specializations
								</span>
							</div>
						</div>

						<div className='p-6'>
							{sector.branches?.map((branch, branchIndex) => (
								<div
									key={branch.id}
									className={`${
										branchIndex > 0 ? 'mt-6' : ''
									} border border-gray-200 rounded-lg overflow-hidden`}>
									<div className='bg-gray-100 px-4 py-3 border-b'>
										<h3 className='text-lg font-semibold text-gray-800'>
											📁 {branch.name}
										</h3>
										<p className='text-gray-600 text-sm mt-1'>
											{branch.description}
										</p>
										<span className='inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs mt-2'>
											{branch.specializations?.length || 0} Specializations
										</span>
									</div>

									<div className='p-4'>
										<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
											{branch.specializations?.map((spec) => (
												<div
													key={spec.id}
													className='bg-blue-50 border border-blue-200 rounded-lg p-3 hover:bg-blue-100 transition-colors'>
													<h4 className='font-medium text-blue-900 mb-1'>
														💼 {spec.name}
													</h4>
													<p className='text-blue-700 text-xs leading-relaxed'>
														{spec.description}
													</p>
												</div>
											))}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				))}

				<div className='bg-gray-800 text-white p-6 rounded-lg text-center'>
					<h3 className='text-xl font-bold mb-2'>🎉 Connection Established!</h3>
					<p className='text-gray-300'>
						Frontend successfully connected to Backend API. Data populated from
						PDF structure with proper 3-level hierarchy.
					</p>
					<div className='mt-4 flex justify-center space-x-4 text-sm'>
						<span className='bg-green-600 px-3 py-1 rounded'>✅ Database</span>
						<span className='bg-green-600 px-3 py-1 rounded'>
							✅ Backend API
						</span>
						<span className='bg-green-600 px-3 py-1 rounded'>✅ Frontend</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HierarchyTestPage;
