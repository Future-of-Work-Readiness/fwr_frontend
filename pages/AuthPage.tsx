import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { loginUser, registerUser } from '../utils/auth';
import {
	loginSchema,
	signUpSchema,
	type LoginFormData,
	type SignUpFormData
} from '../utils/schemas/authSchemas';
import { showToast } from '../src/lib/toastConfig';
import { Mail, Lock, User, AlertCircle, Zap } from 'lucide-react';

export default function AuthPage(): JSX.Element {
	const [isLogin, setIsLogin] = useState<boolean>(true);
	const [error, setError] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const navigate = useNavigate();

	// Login form
	const loginForm = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	});

	// Sign up form
	const signUpForm = useForm<SignUpFormData>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: ''
		}
	});

	// Use the appropriate form based on isLogin
	const currentForm = isLogin ? loginForm : signUpForm;

	const handleLogin = async (data: LoginFormData) => {
		setIsLoading(true);
		setError('');

		try {
			const result = await loginUser(data.email, data.password);
			if (result.success) {
				showToast('success', 'Welcome back!');
				navigate('/dashboard');
			} else {
				const errorMsg = result.error || 'Login failed';
				setError(errorMsg);
				showToast('error', 'Invalid email or password');
			}
		} catch (error) {
			const err = error instanceof Error ? error : new Error('Unknown error');
			setError('Login failed: ' + err.message);
			showToast('error', 'Login failed. Please try again.');
		}

		setIsLoading(false);
	};

	const handleSignUp = async (data: SignUpFormData) => {
		setIsLoading(true);
		setError('');

		try {
			const result = await registerUser(data.name, data.email, data.password);
			if (result.success) {
				showToast('success', 'Account created successfully!');
				navigate('/onboarding');
			} else {
				const errorMsg = result.error || 'Registration failed';
				setError(errorMsg);
				showToast('error', 'Could not create account. Please try again.');
			}
		} catch (error) {
			const err = error instanceof Error ? error : new Error('Unknown error');
			setError('Registration failed: ' + err.message);
			showToast('error', 'Could not create account. Please try again.');
		}

		setIsLoading(false);
	};

	const handleToggle = () => {
		setIsLogin(!isLogin);
		setError('');
		// Reset forms when switching
		loginForm.reset();
		signUpForm.reset();
	};

	return (
		<motion.div
			className='min-h-screen bg-white flex items-center justify-center p-4'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.6, ease: 'easeOut' }}>
			<div className='relative z-10 w-full max-w-md'>
				{/* Header */}
				<motion.div
					className='text-center mb-8'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: 'easeOut' }}>
					<div className='inline-flex items-center space-x-3 mb-6'>
						<div className='w-12 h-12 bg-[#3A7AFE] rounded-lg flex items-center justify-center'>
							<Zap className='w-6 h-6 text-white' />
						</div>
						<span className='text-2xl font-bold text-[#1D2433]'>
							FutureReady
						</span>
					</div>

					<h1 className='text-3xl md:text-4xl font-bold text-[#1C1C1C] mb-2'>
						{isLogin ? 'Welcome Back!' : 'Get Started!'}
					</h1>
					<p className='text-[#4B5563]'>
						{isLogin
							? 'Sign in to continue your journey'
							: 'Create your account to begin'}
					</p>
				</motion.div>

				{/* Auth Card */}
				<motion.div
					className='bg-white rounded-2xl p-8 shadow-sm border border-[#E5E7EB]'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}>
					{/* Toggle Tabs */}
					<div className='flex bg-[#F7F9FC] rounded-lg p-1 mb-6'>
						<button
							onClick={handleToggle}
							type='button'
							className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
								isLogin
									? 'bg-white text-[#3A7AFE] shadow-sm'
									: 'text-[#4B5563] hover:text-[#3A7AFE]'
							}`}>
							Sign In
						</button>
						<button
							onClick={handleToggle}
							type='button'
							className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
								!isLogin
									? 'bg-white text-[#3A7AFE] shadow-sm'
									: 'text-[#4B5563] hover:text-[#3A7AFE]'
							}`}>
							Register
						</button>
					</div>

					{/* Error Message */}
					{error && (
						<motion.div
							className='mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2'
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -10 }}>
							<AlertCircle className='w-5 h-5 text-red-500 flex-shrink-0' />
							<p className='text-red-700 text-sm'>{error}</p>
						</motion.div>
					)}

					{/* Login Form */}
					{isLogin ? (
						<form
							onSubmit={loginForm.handleSubmit(handleLogin)}
							className='space-y-5'>
							<div>
								<label className='block text-sm font-semibold text-[#1C1C1C] mb-2'>
									Email Address
								</label>
								<div className='relative'>
									<Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
									<input
										type='email'
										{...loginForm.register('email')}
										className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#3A7AFE] focus:border-[#3A7AFE] transition-all ${
											loginForm.formState.errors.email
												? 'border-red-300 focus:border-red-500 focus:ring-red-200'
												: 'border-gray-200'
										}`}
										placeholder='your@email.com'
									/>
								</div>
								{loginForm.formState.errors.email && (
									<p className='mt-1 text-sm text-red-600'>
										{loginForm.formState.errors.email.message}
									</p>
								)}
							</div>

							<div>
								<label className='block text-sm font-semibold text-[#1C1C1C] mb-2'>
									Password
								</label>
								<div className='relative'>
									<Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
									<input
										type='password'
										{...loginForm.register('password')}
										className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#3A7AFE] focus:border-[#3A7AFE] transition-all ${
											loginForm.formState.errors.password
												? 'border-red-300 focus:border-red-500 focus:ring-red-200'
												: 'border-gray-200'
										}`}
										placeholder='••••••••'
									/>
								</div>
								{loginForm.formState.errors.password && (
									<p className='mt-1 text-sm text-red-600'>
										{loginForm.formState.errors.password.message}
									</p>
								)}
							</div>

							<button
								type='submit'
								disabled={isLoading}
								className='w-full bg-[#3A7AFE] hover:bg-[#2E6AE8] text-white py-4 rounded-xl font-semibold text-lg hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'>
								{isLoading ? 'Logging in...' : 'Login'}
							</button>
						</form>
					) : (
						/* Sign Up Form */
						<form
							onSubmit={signUpForm.handleSubmit(handleSignUp)}
							className='space-y-5'>
							<div>
								<label className='block text-sm font-semibold text-[#1C1C1C] mb-2'>
									Full Name
								</label>
								<div className='relative'>
									<User className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
									<input
										type='text'
										{...signUpForm.register('name')}
										className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#3A7AFE] focus:border-[#3A7AFE] transition-all ${
											signUpForm.formState.errors.name
												? 'border-red-300 focus:border-red-500 focus:ring-red-200'
												: 'border-gray-200'
										}`}
										placeholder='Enter your full name'
									/>
								</div>
								{signUpForm.formState.errors.name && (
									<p className='mt-1 text-sm text-red-600'>
										{signUpForm.formState.errors.name.message}
									</p>
								)}
							</div>

							<div>
								<label className='block text-sm font-semibold text-[#1C1C1C] mb-2'>
									Email Address
								</label>
								<div className='relative'>
									<Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
									<input
										type='email'
										{...signUpForm.register('email')}
										className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#3A7AFE] focus:border-[#3A7AFE] transition-all ${
											signUpForm.formState.errors.email
												? 'border-red-300 focus:border-red-500 focus:ring-red-200'
												: 'border-gray-200'
										}`}
										placeholder='your@email.com'
									/>
								</div>
								{signUpForm.formState.errors.email && (
									<p className='mt-1 text-sm text-red-600'>
										{signUpForm.formState.errors.email.message}
									</p>
								)}
							</div>

							<div>
								<label className='block text-sm font-semibold text-[#1C1C1C] mb-2'>
									Password
								</label>
								<div className='relative'>
									<Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
									<input
										type='password'
										{...signUpForm.register('password')}
										className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#3A7AFE] focus:border-[#3A7AFE] transition-all ${
											signUpForm.formState.errors.password
												? 'border-red-300 focus:border-red-500 focus:ring-red-200'
												: 'border-gray-200'
										}`}
										placeholder='Create a password'
									/>
								</div>
								{signUpForm.formState.errors.password && (
									<p className='mt-1 text-sm text-red-600'>
										{signUpForm.formState.errors.password.message}
									</p>
								)}
							</div>

							<div>
								<label className='block text-sm font-semibold text-[#1C1C1C] mb-2'>
									Confirm Password
								</label>
								<div className='relative'>
									<Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
									<input
										type='password'
										{...signUpForm.register('confirmPassword')}
										className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#3A7AFE] focus:border-[#3A7AFE] transition-all ${
											signUpForm.formState.errors.confirmPassword
												? 'border-red-300 focus:border-red-500 focus:ring-red-200'
												: 'border-gray-200'
										}`}
										placeholder='Confirm your password'
									/>
								</div>
								{signUpForm.formState.errors.confirmPassword && (
									<p className='mt-1 text-sm text-red-600'>
										{signUpForm.formState.errors.confirmPassword.message}
									</p>
								)}
							</div>

							<button
								type='submit'
								disabled={isLoading}
								className='w-full bg-[#3A7AFE] hover:bg-[#2E6AE8] text-white py-4 rounded-xl font-semibold text-lg hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'>
								{isLoading ? 'Creating Account...' : 'Create Account'}
							</button>
						</form>
					)}

					{/* Additional Options */}
					<div className='mt-6 text-center'>
						{isLogin && (
							<button
								type='button'
								className='text-[#3A7AFE] hover:text-[#2E6AE8] text-sm font-medium transition-colors duration-200'>
								Forgot your password?
							</button>
						)}
					</div>
				</motion.div>

				{/* Footer */}
				<motion.div
					className='text-center mt-8'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}>
					<p className='text-[#4B5563] text-sm'>
						Discover your potential and build skills for tomorrow's workforce
					</p>
				</motion.div>
			</div>
		</motion.div>
	);
}
