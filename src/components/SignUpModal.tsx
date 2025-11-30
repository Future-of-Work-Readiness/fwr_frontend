import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerUser } from '../../utils/auth';
import {
	signUpSchema,
	type SignUpFormData
} from '../../utils/schemas/authSchemas';
import { showToast } from '../lib/toastConfig';
import { X, User, Mail, Lock, AlertCircle } from 'lucide-react';

interface SignUpModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm<SignUpFormData>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: ''
		}
	});

	const onSubmit = async (data: SignUpFormData) => {
		setIsLoading(true);
		setError('');

		// Register user
		try {
			const result = await registerUser(data.name, data.email, data.password);

			if (result.success) {
				// Registration successful, navigate to onboarding
				showToast('success', 'Account created successfully!');
				reset();
				navigate('/onboarding');
				onClose();
			} else {
				const errorMsg = result.error || 'Registration failed';
				setError(errorMsg);
				showToast('error', 'Could not create account. Please try again.');
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Unknown error occurred';
			setError('Registration failed: ' + errorMessage);
			showToast('error', 'Could not create account. Please try again.');
		}

		setIsLoading(false);
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
			<div className='bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto'>
				<div className='flex justify-between items-center mb-6'>
					<div>
						<h3 className='text-3xl font-bold text-slate-800 mb-2'>
							Create Account
						</h3>
						<p className='text-gray-600'>Start your learning journey today</p>
					</div>
					<button
						onClick={onClose}
						className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
						<X className='w-5 h-5 text-gray-500' />
					</button>
				</div>

				{error && (
					<div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2'>
						<AlertCircle className='w-5 h-5 text-red-500 flex-shrink-0' />
						<p className='text-red-700 text-sm'>{error}</p>
					</div>
				)}

				<form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
					<div>
						<label className='block text-sm font-semibold text-gray-700 mb-2'>
							Full Name
						</label>
						<div className='relative'>
							<User className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
							<input
								type='text'
								{...register('name')}
								className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#3A7AFE] focus:border-[#3A7AFE] transition-all ${
									errors.name
										? 'border-red-300 focus:border-red-500 focus:ring-red-200'
										: 'border-[#E5E7EB]'
								}`}
								placeholder='Enter your full name'
							/>
						</div>
						{errors.name && (
							<p className='mt-1 text-sm text-red-600'>{errors.name.message}</p>
						)}
					</div>

					<div>
						<label className='block text-sm font-semibold text-gray-700 mb-2'>
							Email Address
						</label>
						<div className='relative'>
							<Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
							<input
								type='email'
								{...register('email')}
								className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#3A7AFE] focus:border-[#3A7AFE] transition-all ${
									errors.email
										? 'border-red-300 focus:border-red-500 focus:ring-red-200'
										: 'border-[#E5E7EB]'
								}`}
								placeholder='your@email.com'
							/>
						</div>
						{errors.email && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.email.message}
							</p>
						)}
					</div>

					<div>
						<label className='block text-sm font-semibold text-gray-700 mb-2'>
							Password
						</label>
						<div className='relative'>
							<Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
							<input
								type='password'
								{...register('password')}
								className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#3A7AFE] focus:border-[#3A7AFE] transition-all ${
									errors.password
										? 'border-red-300 focus:border-red-500 focus:ring-red-200'
										: 'border-[#E5E7EB]'
								}`}
								placeholder='Create a password'
							/>
						</div>
						{errors.password && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.password.message}
							</p>
						)}
					</div>

					<div>
						<label className='block text-sm font-semibold text-gray-700 mb-2'>
							Confirm Password
						</label>
						<div className='relative'>
							<Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
							<input
								type='password'
								{...register('confirmPassword')}
								className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#3A7AFE] focus:border-[#3A7AFE] transition-all ${
									errors.confirmPassword
										? 'border-red-300 focus:border-red-500 focus:ring-red-200'
										: 'border-[#E5E7EB]'
								}`}
								placeholder='Confirm your password'
							/>
						</div>
						{errors.confirmPassword && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.confirmPassword.message}
							</p>
						)}
					</div>

					<button
						type='submit'
						disabled={isLoading}
						className='w-full bg-[#3A7AFE] hover:bg-[#2E6AE8] text-white py-4 rounded-lg font-semibold text-lg hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'>
						{isLoading ? 'Creating Account...' : 'Create Account'}
					</button>

					<div className='text-center pt-4'>
						<p className='text-[#4B5563]'>
							Already have an account?{' '}
							<button
								type='button'
								onClick={() => {
									onClose();
									// You can trigger login modal here if needed
								}}
								className='text-[#3A7AFE] hover:text-[#2E6AE8] font-semibold transition-colors duration-200'>
								Login here
							</button>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
}
