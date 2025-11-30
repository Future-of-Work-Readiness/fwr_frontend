// Design System for consistent UI/UX across the application
// Neurodivergent-friendly color system - no gradients, soft colors only

export const colors = {
	brand: {
		primary: '#3A7AFE',
		secondary: '#1D2433'
	},
	text: {
		primary: '#1C1C1C',
		secondary: '#4B5563'
	},
	bg: {
		light: '#FFFFFF',
		muted: '#F7F9FC'
	},
	border: '#E5E7EB',
	success: {
		50: '#f0fdf4',
		100: '#dcfce7',
		500: '#4CAF50',
		600: '#16a34a'
	},
	warning: {
		50: '#fffbeb',
		100: '#fef3c7',
		500: '#EAB308',
		600: '#d97706'
	},
	error: {
		50: '#fef2f2',
		100: '#fee2e2',
		500: '#DC2626',
		600: '#dc2626'
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

// Removed gradients - using solid colors only for accessibility

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

// Common component styles - gentle animations, no scale transforms
export const buttonStyles = {
	primary: 'bg-[#3A7AFE] hover:bg-[#2E6AE8] text-white font-medium px-6 py-3 rounded-lg hover:shadow-md transition-all duration-200',
	secondary:
		'bg-white text-[#4B5563] border border-[#E5E7EB] px-6 py-3 rounded-lg hover:bg-[#F7F9FC] hover:shadow-sm transition-all duration-200',
	success: 'bg-[#4CAF50] hover:bg-[#16a34a] text-white font-medium px-6 py-3 rounded-lg hover:shadow-md transition-all duration-200',
	danger:
		'bg-[#DC2626] hover:bg-[#b91c1c] text-white font-medium px-6 py-3 rounded-lg hover:shadow-md transition-all duration-200'
};

export const cardStyles = {
	default:
		'bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6',
	elevated: 'bg-white rounded-xl shadow-md p-6 border border-[#E5E7EB]',
	interactive:
		'bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-[#E5E7EB] p-6'
};

export const inputStyles = {
	default:
		'w-full px-4 py-3 border-2 border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#3A7AFE] focus:border-[#3A7AFE] transition-all duration-200',
	error:
		'w-full px-4 py-3 border-2 border-[#DC2626] rounded-lg focus:ring-2 focus:ring-[#DC2626] focus:border-[#DC2626] transition-all duration-200'
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
	if (score >= 70) return { 500: colors.brand.primary, 600: '#2E6AE8' };
	if (score >= 50) return colors.warning;
	return colors.error;
};

export const getDifficultyColor = (
	difficulty: DifficultyLevel | string
): string => {
	const difficultyColors: Record<DifficultyLevel, string> = {
		Beginner: 'bg-[#f0fdf4] text-[#16a34a]',
		Intermediate: 'bg-[#fffbeb] text-[#d97706]',
		Advanced: 'bg-[#fef3c7] text-[#b45309]',
		Expert: 'bg-[#fef2f2] text-[#DC2626]'
	};
	if (difficulty in difficultyColors) {
		return difficultyColors[difficulty as DifficultyLevel];
	}
	return 'bg-[#F7F9FC] text-[#4B5563]';
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
		<div className='text-[#DC2626] text-6xl mb-4'>⚠️</div>
		<h3 className='text-xl font-semibold text-[#1C1C1C] mb-2'>
			Something went wrong
		</h3>
		<p className='text-[#4B5563] mb-4'>{message}</p>
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
		<div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50'>
			<div className='bg-white rounded-xl p-8 text-center shadow-xl'>
				<div className='text-6xl mb-4'>🎉</div>
				<h3 className='text-2xl font-bold text-[#1C1C1C] mb-2'>Success!</h3>
				<p className='text-[#4B5563]'>Your action was completed successfully.</p>
				<button onClick={onComplete} className={`${buttonStyles.primary} mt-4`}>
					Continue
				</button>
			</div>
		</div>
	);
};
