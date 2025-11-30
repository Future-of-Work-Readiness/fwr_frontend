import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { loginUser } from '../../utils/auth';
import {
	loginSchema,
	type LoginFormData
} from '../../utils/schemas/authSchemas';
import { showToast } from '../lib/toastConfig';
import { Mail, Lock, AlertCircle, X } from 'lucide-react';

interface LoginModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSwitchToSignUp?: () => void;
}

export default function LoginModal({
	isOpen,
	onClose,
	onSwitchToSignUp
}: LoginModalProps) {
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	});

	const onSubmit = async (data: LoginFormData) => {
		setIsLoading(true);
		setError('');

		try {
			const result = await loginUser(data.email, data.password);

			if (result.success) {
				// Login successful, navigate to dashboard
				showToast('success', 'Welcome back!');
				reset();
				navigate('/dashboard');
				onClose();
			} else {
				const errorMsg = result.error || 'Login failed';
				setError(errorMsg);
				showToast('error', 'Invalid email or password');
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Unknown error occurred';
			setError('Login failed: ' + errorMessage);
			showToast('error', 'Login failed. Please try again.');
		}

		setIsLoading(false);
	};

	const handleClose = () => {
		reset();
		setError('');
		onClose();
	};

	if (!isOpen) return null;

	return (
		<motion.div
			className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			onClick={handleClose}>
			<motion.div
				className='bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl'
				initial={{ scale: 0.95, opacity: 0, y: 20 }}
				animate={{ scale: 1, opacity: 1, y: 0 }}
				exit={{ scale: 0.95, opacity: 0, y: 20 }}
				transition={{ duration: 0.3, ease: 'easeOut' }}
				onClick={(e) => e.stopPropagation()}>
				<motion.div
					className='mb-8'
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}>
					<div className='flex justify-between items-center mb-4'>
						<div>
							<h3 className='text-3xl font-bold text-[#1C1C1C] mb-2'>
								Welcome Back
							</h3>
							<p className='text-[#4B5563]'>Login to continue your journey</p>
						</div>
						<button
							onClick={handleClose}
							className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
							<X className='w-5 h-5 text-gray-500' />
						</button>
					</div>
				</motion.div>

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

				<motion.form
					onSubmit={handleSubmit(onSubmit)}
					className='space-y-5'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}>
					<div>
						<label className='block text-sm font-semibold text-[#1C1C1C] mb-2'>
							Email Address
						</label>
						<div className='relative'>
							<Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
							<input
								type='email'
								{...register('email')}
								className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#3A7AFE] focus:border-[#3A7AFE] transition-all ${
									errors.email
										? 'border-red-300 focus:border-red-500 focus:ring-red-200'
										: 'border-gray-200'
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
						<label className='block text-sm font-semibold text-[#1C1C1C] mb-2'>
							Password
						</label>
						<div className='relative'>
							<Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
							<input
								type='password'
								{...register('password')}
								className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#3A7AFE] focus:border-[#3A7AFE] transition-all ${
									errors.password
										? 'border-red-300 focus:border-red-500 focus:ring-red-200'
										: 'border-gray-200'
								}`}
								placeholder='••••••••'
							/>
						</div>
						{errors.password && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.password.message}
							</p>
						)}
					</div>

					<button
						type='submit'
						disabled={isLoading}
						className='w-full bg-[#3A7AFE] hover:bg-[#2E6AE8] text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'>
						{isLoading ? 'Logging in...' : 'Login'}
					</button>

					<div className='text-center pt-4 space-y-2'>
						<p className='text-[#4B5563]'>
							Don't have an account?{' '}
							<button
								type='button'
								onClick={() => {
									handleClose();
									if (onSwitchToSignUp) {
										onSwitchToSignUp();
									}
								}}
								className='text-[#3A7AFE] hover:text-[#2E6AE8] font-semibold transition-colors duration-200'>
								Sign up here
							</button>
						</p>
						<button
							type='button'
							onClick={handleClose}
							className='text-[#4B5563] hover:text-[#1C1C1C] font-medium transition-colors duration-200'>
							Cancel
						</button>
					</div>
				</motion.form>
			</motion.div>
		</motion.div>
	);
}
