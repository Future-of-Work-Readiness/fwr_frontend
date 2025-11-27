// Design System for consistent UI/UX across the application

export const colors = {
	primary: {
		50: '#eff6ff',
		100: '#dbeafe',
		500: '#3b82f6',
		600: '#2563eb',
		700: '#1d4ed8',
		900: '#1e3a8a'
	},
	secondary: {
		50: '#faf5ff',
		100: '#f3e8ff',
		500: '#a855f7',
		600: '#9333ea',
		700: '#7c3aed',
		900: '#581c87'
	},
	success: {
		50: '#f0fdf4',
		100: '#dcfce7',
		500: '#22c55e',
		600: '#16a34a',
		700: '#15803d'
	},
	warning: {
		50: '#fffbeb',
		100: '#fef3c7',
		500: '#f59e0b',
		600: '#d97706',
		700: '#b45309'
	},
	error: {
		50: '#fef2f2',
		100: '#fee2e2',
		500: '#ef4444',
		600: '#dc2626',
		700: '#b91c1c'
	},
	gray: {
		50: '#f9fafb',
		100: '#f3f4f6',
		200: '#e5e7eb',
		300: '#d1d5db',
		400: '#9ca3af',
		500: '#6b7280',
		600: '#4b5563',
		700: '#374151',
		800: '#1f2937',
		900: '#111827'
	}
};

export const gradients = {
	primary: 'bg-gradient-to-r from-blue-600 to-purple-600',
	secondary: 'bg-gradient-to-r from-purple-600 to-pink-600',
	success: 'bg-gradient-to-r from-green-500 to-emerald-600',
	warning: 'bg-gradient-to-r from-yellow-500 to-orange-600',
	background: 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
};

export const shadows = {
	sm: 'shadow-sm',
	md: 'shadow-md',
	lg: 'shadow-lg',
	xl: 'shadow-xl',
	'2xl': 'shadow-2xl',
	glow: 'shadow-lg shadow-blue-500/25'
};

export const animations = {
	fadeIn: 'animate-fade-in',
	slideUp: 'animate-slide-up',
	bounce: 'animate-bounce',
	pulse: 'animate-pulse',
	spin: 'animate-spin'
};

export const spacing = {
	xs: '0.5rem',
	sm: '0.75rem',
	md: '1rem',
	lg: '1.5rem',
	xl: '2rem',
	'2xl': '3rem',
	'3xl': '4rem'
};

// Common component styles
export const buttonStyles = {
	primary: `${gradients.primary} text-white font-semibold px-6 py-3 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300`,
	secondary:
		'bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-300',
	success: `${gradients.success} text-white font-semibold px-6 py-3 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300`,
	danger:
		'bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300'
};

export const cardStyles = {
	default:
		'bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6',
	elevated: 'bg-white rounded-xl shadow-2xl p-6 border border-gray-100',
	interactive:
		'bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6'
};

export const inputStyles = {
	default:
		'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300',
	error:
		'w-full px-4 py-3 border-2 border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300'
};

type ColorScale = Record<string, string>;
type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

interface SkeletonLoaderProps {
	className?: string;
}

interface ErrorStateProps {
	message: string;
	onRetry?: () => void;
}

interface SuccessAnimationProps {
	show: boolean;
	onComplete: () => void;
}

// Utility functions
export const getScoreColor = (score: number): ColorScale => {
	if (score >= 90) return colors.success;
	if (score >= 70) return colors.primary;
	if (score >= 50) return colors.warning;
	return colors.error;
};

export const getDifficultyColor = (
	difficulty: DifficultyLevel | string
): string => {
	const difficultyColors: Record<DifficultyLevel, string> = {
		Beginner: 'bg-green-100 text-green-800',
		Intermediate: 'bg-yellow-100 text-yellow-800',
		Advanced: 'bg-orange-100 text-orange-800',
		Expert: 'bg-red-100 text-red-800'
	};
	if (difficulty in difficultyColors) {
		return difficultyColors[difficulty as DifficultyLevel];
	}
	return 'bg-gray-100 text-gray-800';
};

// Loading skeleton component
export const SkeletonLoader = ({
	className = ''
}: SkeletonLoaderProps): JSX.Element => (
	<div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// Error state component
export const ErrorState = ({
	message,
	onRetry
}: ErrorStateProps): JSX.Element => (
	<div className='text-center py-8'>
		<div className='text-red-500 text-6xl mb-4'>⚠️</div>
		<h3 className='text-xl font-semibold text-gray-900 mb-2'>
			Something went wrong
		</h3>
		<p className='text-gray-600 mb-4'>{message}</p>
		{onRetry && (
			<button onClick={onRetry} className={`${buttonStyles.primary} text-sm`}>
				Try Again
			</button>
		)}
	</div>
);

// Success animation component
export const SuccessAnimation = ({
	show,
	onComplete
}: SuccessAnimationProps): JSX.Element | null => {
	if (!show) return null;

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
			<div className='bg-white rounded-2xl p-8 text-center'>
				<div className='text-6xl mb-4'>🎉</div>
				<h3 className='text-2xl font-bold text-gray-900 mb-2'>Success!</h3>
				<p className='text-gray-600'>Your action was completed successfully.</p>
				<button onClick={onComplete} className={`${buttonStyles.primary} mt-4`}>
					Continue
				</button>
			</div>
		</div>
	);
};
