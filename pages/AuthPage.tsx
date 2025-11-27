import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../utils/auth';

const apiUrl = import.meta.env.VITE_API_URL;
console.log('API URL:', apiUrl);

interface AuthFormData {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export default function AuthPage(): JSX.Element {
	const [isLogin, setIsLogin] = useState<boolean>(true);
	const [formData, setFormData] = useState<AuthFormData>({
		name: '',
		email: '',
		password: '',
		confirmPassword: ''
	});
	const [error, setError] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const navigate = useNavigate();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
		if (error) setError('');
	};

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>
	): Promise<void> => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		try {
			if (isLogin) {
				// Login
				const result = await loginUser(formData.email, formData.password);
				if (result.success) {
					navigate('/landing');
				} else {
					setError(result.error || 'Login failed');
				}
			} else {
				// Registration
				if (formData.password !== formData.confirmPassword) {
					setError('Passwords do not match');
					setIsLoading(false);
					return;
				}

				const result = await registerUser(
					formData.name,
					formData.email,
					formData.password
				);
				if (result.success) {
					navigate('/landing');
				} else {
					setError(result.error || 'Registration failed');
				}
			}
		} catch (error) {
			const err = error instanceof Error ? error : new Error('Unknown error');
			setError('An error occurred: ' + err.message);
		}

		setIsLoading(false);
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800 flex items-center justify-center p-4'>
			{/* Animated Background Elements */}
			<div className='absolute inset-0 overflow-hidden pointer-events-none'>
				<div className='absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse'></div>
				<div className='absolute -bottom-32 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse'></div>
				<div className='absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse'></div>
			</div>

			<div className='relative z-10 w-full max-w-md'>
				{/* Header */}
				<div className='text-center mb-8'>
					<div className='inline-flex items-center space-x-3 mb-6'>
						<div className='w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center'>
							<span className='text-white text-2xl font-bold'>🚀</span>
						</div>
						<span className='text-2xl font-bold text-white'>
							Future Work Readiness
						</span>
					</div>

					<h1 className='text-3xl md:text-4xl font-bold text-white mb-2'>
						{isLogin ? 'Welcome Back!' : 'Get Started!'}
					</h1>
					<p className='text-white/80'>
						{isLogin
							? 'Sign in to continue your journey'
							: 'Create your account to begin'}
					</p>
				</div>

				{/* Auth Card */}
				<div className='bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20'>
					{/* Toggle Tabs */}
					<div className='flex bg-gray-100 rounded-xl p-1 mb-6'>
						<button
							onClick={() => setIsLogin(true)}
							className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
								isLogin
									? 'bg-white text-blue-600 shadow-md'
									: 'text-gray-600 hover:text-blue-600'
							}`}>
							Sign In
						</button>
						<button
							onClick={() => setIsLogin(false)}
							className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
								!isLogin
									? 'bg-white text-blue-600 shadow-md'
									: 'text-gray-600 hover:text-blue-600'
							}`}>
							Register
						</button>
					</div>

					{/* Error Message */}
					{error && (
						<div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 flex items-center space-x-2 animate-fade-in'>
							<span>⚠️</span>
							<span className='text-sm'>{error}</span>
						</div>
					)}

					{/* Form */}
					<form onSubmit={handleSubmit} className='space-y-4'>
						{/* Name field for registration */}
						{!isLogin && (
							<div>
								<label className='block text-sm font-semibold text-gray-700 mb-2'>
									👤 Full Name
								</label>
								<input
									type='text'
									name='name'
									value={formData.name}
									onChange={handleInputChange}
									required
									className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
									placeholder='Enter your full name'
								/>
							</div>
						)}

						{/* Email */}
						<div>
							<label className='block text-sm font-semibold text-gray-700 mb-2'>
								📧 Email Address
							</label>
							<input
								type='email'
								name='email'
								value={formData.email}
								onChange={handleInputChange}
								required
								className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
								placeholder='your@email.com'
							/>
						</div>

						{/* Password */}
						<div>
							<label className='block text-sm font-semibold text-gray-700 mb-2'>
								🔒 Password
							</label>
							<input
								type='password'
								name='password'
								value={formData.password}
								onChange={handleInputChange}
								required
								className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
								placeholder='Enter your password'
							/>
						</div>

						{/* Confirm Password for registration */}
						{!isLogin && (
							<div>
								<label className='block text-sm font-semibold text-gray-700 mb-2'>
									🔐 Confirm Password
								</label>
								<input
									type='password'
									name='confirmPassword'
									value={formData.confirmPassword}
									onChange={handleInputChange}
									required
									className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
									placeholder='Confirm your password'
								/>
							</div>
						)}

						{/* Submit Button */}
						<button
							type='submit'
							disabled={isLoading}
							className='w-full py-3 mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'>
							{isLoading ? (
								<span className='flex items-center justify-center space-x-2'>
									<div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
									<span>
										{isLogin ? 'Signing In...' : 'Creating Account...'}
									</span>
								</span>
							) : (
								<span className='flex items-center justify-center space-x-2'>
									<span>{isLogin ? '🚀 Sign In' : '✨ Create Account'}</span>
								</span>
							)}
						</button>
					</form>

					{/* Additional Options */}
					<div className='mt-6 text-center'>
						{isLogin && (
							<a
								href='#'
								className='text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors'>
								Forgot your password?
							</a>
						)}
					</div>
				</div>

				{/* Footer */}
				<div className='text-center mt-8'>
					<p className='text-white/60 text-sm'>
						Discover your potential and build skills for tomorrow's workforce
					</p>
				</div>
			</div>
		</div>
	);
}
