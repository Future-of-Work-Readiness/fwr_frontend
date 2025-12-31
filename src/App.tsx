import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { toastOptions } from './lib/toastConfig';

// Import pages for new user flow
import AuthPage from '../pages/AuthPage'; // Login/Registration page
import LandingPageAuth from '../pages/LandingPageAuth'; // Landing page after login
import OnboardingPage from '../pages/OnboardingPage';
import SectorSelectionPage from '../pages/SectorSelectionPage';
import DashboardPage from '../pages/DashboardPage';

// Import additional pages
import TestHubPage from '../pages/TestHubPage';
import TestPage from '../pages/TestPage';
import TestTakingPage from '../pages/TestTakingPage';
import TestResultsPage from '../pages/TestResultsPage';
import GoalsPage from '../pages/GoalsPage';
import PeerBenchmarkingPage from '../pages/PeerBenchmarkingPage';
import ConnectionTestPage from '../pages/ConnectionTestPage';
import DatabaseTestPage from '../pages/DatabaseTestPage';
import SimpleTestPage from '../pages/SimpleTestPage';
import AdminPage from '../pages/AdminPage';

// Import components
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from '../pages/LandingPage';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App(): JSX.Element {
	return (
		<BrowserRouter>
			<Routes>
				<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID as string}>
					{/* Public Routes */}
					<Route path='/' element={<LandingPage />} />

					{/* Testing Routes (accessible without auth) */}
					<Route path='/connection-test' element={<ConnectionTestPage />} />
					<Route path='/database-test' element={<DatabaseTestPage />} />
					<Route path='/simple-test' element={<SimpleTestPage />} />
					<Route path='/test' element={<TestPage />} />
					<Route path='/admin' element={<AdminPage />} />
					<Route path='/auth' element={<AuthPage />} />

					{/* Protected Routes - Require Authentication */}
					<Route
						path='/landing'
						element={
							<ProtectedRoute>
								<LandingPageAuth />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/onboarding'
						element={
							<ProtectedRoute>
								<OnboardingPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/sector-selection'
						element={
							<ProtectedRoute>
								<SectorSelectionPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/dashboard'
						element={
							<ProtectedRoute>
								<DashboardPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/tests'
						element={
							<ProtectedRoute>
								<TestHubPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/test-hub'
						element={
							<ProtectedRoute>
								<TestHubPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/test-taking'
						element={
							<ProtectedRoute>
								<TestTakingPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/test-results'
						element={
							<ProtectedRoute>
								<TestResultsPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/goals'
						element={
							<ProtectedRoute>
								<GoalsPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/peer-benchmark'
						element={
							<ProtectedRoute>
								<PeerBenchmarkingPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path='/take-test/:testType'
						element={
							<ProtectedRoute>
								<TestTakingPage />
							</ProtectedRoute>
						}
					/>
				</GoogleOAuthProvider>
			</Routes>
			<Toaster toastOptions={toastOptions} />
		</BrowserRouter>
	);
}

export default App;
