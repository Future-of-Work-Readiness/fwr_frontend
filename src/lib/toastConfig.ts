import toast, { type ToastOptions } from 'react-hot-toast';

/**
 * Custom toast configuration matching the app's design system
 * Neurodivergent-friendly: minimal motion, calm colors, accessible
 */
export const toastOptions: ToastOptions = {
	duration: 4000,
	position: 'top-right',
	style: {
		background: '#111827',
		color: '#F9FAFB',
		borderRadius: '8px',
		padding: '16px',
		fontSize: '14px',
		fontWeight: '500',
		boxShadow:
			'0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
		border: '1px solid rgba(255, 255, 255, 0.1)'
	}
};

/**
 * Helper function to show success toast
 */
export const showSuccessToast = (
	message: string,
	options?: ToastOptions
): string => {
	return toast.success(message, {
		...toastOptions,
		iconTheme: {
			primary: '#38BDF8',
			secondary: '#111827'
		},
		style: {
			...toastOptions.style,
			borderLeft: '4px solid #38BDF8'
		},
		...options
	});
};

/**
 * Helper function to show error toast
 */
export const showErrorToast = (
	message: string,
	options?: ToastOptions
): string => {
	return toast.error(message, {
		...toastOptions,
		iconTheme: {
			primary: '#F87171',
			secondary: '#111827'
		},
		style: {
			...toastOptions.style,
			borderLeft: '4px solid #F87171'
		},
		...options
	});
};

/**
 * Helper function to show loading toast
 */
export const showLoadingToast = (
	message: string,
	options?: ToastOptions
): string => {
	return toast.loading(message, {
		...toastOptions,
		iconTheme: {
			primary: '#F9FAFB',
			secondary: '#111827'
		},
		...options
	});
};

/**
 * Helper function to show info toast
 */
export const showInfoToast = (
	message: string,
	options?: ToastOptions
): string => {
	return toast(message, {
		...toastOptions,
		...options
	});
};

/**
 * Generic showToast function that accepts a type
 */
export const showToast = (
	type: 'success' | 'error' | 'loading' | 'info',
	message: string,
	options?: ToastOptions
): string => {
	switch (type) {
		case 'success':
			return showSuccessToast(message, options);
		case 'error':
			return showErrorToast(message, options);
		case 'loading':
			return showLoadingToast(message, options);
		case 'info':
			return showInfoToast(message, options);
		default:
			return showInfoToast(message, options);
	}
};
