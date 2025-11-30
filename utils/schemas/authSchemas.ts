import { z } from 'zod';

/**
 * Sign Up Form Validation Schema
 * Validates user registration form data
 */
export const signUpSchema = z
	.object({
		name: z.string().min(1, 'Name is required').trim(),
		email: z
			.string()
			.min(1, 'Email is required')
			.email('Invalid email address')
			.trim(),
		password: z.string().min(6, 'Password must be at least 6 characters'),
		confirmPassword: z.string().min(1, 'Please confirm your password')
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});

/**
 * Login Form Validation Schema
 * Validates user login form data
 */
export const loginSchema = z.object({
	email: z
		.string()
		.min(1, 'Email is required')
		.email('Invalid email address')
		.trim(),
	password: z.string().min(1, 'Password is required')
});

/**
 * TypeScript type inferred from the sign up schema
 */
export type SignUpFormData = z.infer<typeof signUpSchema>;

/**
 * TypeScript type inferred from the login schema
 */
export type LoginFormData = z.infer<typeof loginSchema>;

