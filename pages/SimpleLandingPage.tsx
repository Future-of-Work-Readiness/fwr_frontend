import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SimpleLandingPage(): JSX.Element {
	const navigate = useNavigate();

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100'>
			<div className='max-w-7xl mx-auto px-4 py-20'>
				<div className='text-center'>
					<h1 className='text-4xl font-bold text-slate-800 mb-4'>
						Future of Work Readiness
					</h1>
					<p className='text-xl text-gray-600 mb-8'>
						Prepare for the future of work with personalized learning paths
					</p>

					<div className='space-x-4'>
						<button
							onClick={() => navigate('/onboarding')}
							className='bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors'>
							Get Started
						</button>
						<button className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-8 py-3 rounded-lg transition-colors'>
							Login
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
