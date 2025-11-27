import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../utils/auth';

interface ProtectedRouteProps {
	children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
	if (!isLoggedIn()) {
		// Redirect to landing page if not logged in
		return <Navigate to='/' replace />;
	}

	return children;
}
