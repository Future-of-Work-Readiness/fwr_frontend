import React, { useState, useEffect } from 'react';
import { testConnection, authAPI, quizAPI } from '../utils/api';

interface TestResult {
	success: boolean;
	data?: unknown;
	error?: string;
	status: string;
	count?: number;
}

interface TestResults {
	basicConnection?: TestResult;
	quizzesEndpoint?: TestResult;
	registrationEndpoint?: TestResult;
}

const ConnectionTestPage = (): JSX.Element => {
	const [connectionStatus, setConnectionStatus] =
		useState<string>('Testing...');
	const [testResults, setTestResults] = useState<TestResults>({});
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		runConnectionTests();
	}, []);

	const runConnectionTests = async (): Promise<void> => {
		setLoading(true);
		const results: TestResults = {};

		// Test 1: Basic API connection
		try {
			const connectionTest = await testConnection();
			results.basicConnection = {
				success: connectionTest.success,
				data: connectionTest.data,
				status: connectionTest.success ? '✅ Connected' : '❌ Failed'
			};
			setConnectionStatus(connectionTest.success ? 'Connected' : 'Failed');
		} catch (error) {
			const err = error instanceof Error ? error : new Error('Unknown error');
			results.basicConnection = {
				success: false,
				error: err.message,
				status: '❌ Failed'
			};
			setConnectionStatus('Failed');
		}

		// Test 2: Get quizzes
		try {
			const quizzes = await quizAPI.getAllQuizzes();
			results.quizzesEndpoint = {
				success: true,
				count: quizzes.length,
				status: `✅ ${quizzes.length} quizzes loaded`
			};
		} catch (error) {
			const err = error instanceof Error ? error : new Error('Unknown error');
			results.quizzesEndpoint = {
				success: false,
				error: err.message,
				status: '❌ Failed'
			};
		}

		// Test 3: Test registration endpoint (dry run)
		try {
			// This will likely fail but we can see the error response
			await authAPI.register({
				email: 'test@example.com',
				password: 'testpass',
				name: 'Test User'
			});
		} catch (error) {
			const err = error instanceof Error ? error : new Error('Unknown error');
			results.registrationEndpoint = {
				success: false,
				error: err.message,
				status: err.message.includes('already exists')
					? '✅ Endpoint working (user exists)'
					: `⚠️ ${err.message}`
			};
		}

		setTestResults(results);
		setLoading(false);
	};

	if (loading) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
					<p className='mt-4 text-gray-600'>Testing backend connection...</p>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50 py-8'>
			<div className='max-w-4xl mx-auto px-4'>
				<div className='bg-white rounded-lg shadow-lg p-6'>
					<h1 className='text-3xl font-bold text-gray-800 mb-6'>
						Frontend ↔ Backend Connection Test
					</h1>

					<div className='mb-6'>
						<div
							className={`text-lg font-semibold p-4 rounded-lg ${
								connectionStatus === 'Connected'
									? 'bg-green-100 text-green-800'
									: 'bg-red-100 text-red-800'
							}`}>
							Overall Status: {connectionStatus}
						</div>
					</div>

					<div className='space-y-6'>
						<h2 className='text-2xl font-semibold text-gray-700'>
							Test Results
						</h2>

						{Object.entries(testResults).map(
							([testName, result]: [string, TestResult]) => (
								<div
									key={testName}
									className='border border-gray-200 rounded-lg p-4'>
									<h3 className='font-semibold text-lg mb-2 capitalize'>
										{testName.replace(/([A-Z])/g, ' $1').trim()}
									</h3>

									<div className='flex items-center gap-2 mb-2'>
										<span className='text-lg'>{result.status}</span>
									</div>

									{result.data != null && (
										<div className='bg-gray-100 p-3 rounded mt-2'>
											<p className='font-medium'>Response:</p>
											<pre className='text-sm text-gray-600 mt-1'>
												{String(JSON.stringify(result.data, null, 2))}
											</pre>
										</div>
									)}

									{result.error && (
										<div className='bg-red-50 p-3 rounded mt-2'>
											<p className='font-medium text-red-800'>Error:</p>
											<p className='text-sm text-red-600 mt-1'>
												{result.error}
											</p>
										</div>
									)}

									{result.count !== undefined && (
										<div className='bg-blue-50 p-3 rounded mt-2'>
											<p className='text-blue-800'>
												Items found: {result.count}
											</p>
										</div>
									)}
								</div>
							)
						)}
					</div>

					<div className='mt-8 p-4 bg-blue-50 rounded-lg'>
						<h3 className='font-semibold text-blue-800 mb-2'>Next Steps:</h3>
						<ul className='text-blue-700 space-y-1'>
							<li>• If connection works: Your backend is running correctly!</li>
							<li>• If quizzes load: Your quiz endpoints are working</li>
							<li>
								• If registration shows "user exists": Auth endpoints are
								working
							</li>
							<li>• Ready to test login and registration from your frontend</li>
						</ul>
					</div>

					<div className='mt-6 flex gap-4'>
						<button
							onClick={runConnectionTests}
							className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
							Rerun Tests
						</button>
						<a
							href='http://localhost:8000/docs'
							target='_blank'
							rel='noopener noreferrer'
							className='bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors'>
							View API Docs
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ConnectionTestPage;
