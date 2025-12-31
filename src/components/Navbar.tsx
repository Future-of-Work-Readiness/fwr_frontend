import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Zap, LogOut, LayoutDashboard } from 'lucide-react';
import { getCurrentUser, logoutUser } from '../../utils/auth';
import { showToast } from '../lib/toastConfig';

interface NavbarProps {
	showSkipToDashboard?: boolean;
}

export default function Navbar({
	showSkipToDashboard = false
}: NavbarProps): JSX.Element {
	const navigate = useNavigate();
	const currentUser = getCurrentUser();

	const handleLogout = (): void => {
		logoutUser();
		showToast('success', 'Logged out successfully');
		navigate('/');
	};

	return (
		<motion.nav
			className='bg-white border-b border-gray-200 sticky top-0 z-50'
			initial={{ y: -20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.4, ease: 'easeOut' }}>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between items-center h-16 md:h-20'>
					<motion.div
						className='flex items-center space-x-3 cursor-pointer'
						whileHover={{ scale: 1.02 }}
						transition={{ duration: 0.2 }}
						onClick={() => navigate('/dashboard')}>
						<div className='w-10 h-10 bg-[#3A7AFE] rounded-lg flex items-center justify-center'>
							<Zap className='w-6 h-6 text-white' />
						</div>
						<span className='text-xl md:text-2xl font-bold text-[#1D2433]'>
							ReadinessAi
						</span>
					</motion.div>

					<div className='flex items-center space-x-2 md:space-x-4'>
						{showSkipToDashboard && (
							<button
								onClick={() => navigate('/dashboard')}
								className='flex items-center space-x-2 px-2 md:px-3 lg:px-4 py-2 text-[#4B5563] hover:text-[#3A7AFE] hover:bg-[#F7F9FC] rounded-lg font-medium transition-colors duration-200'>
								<LayoutDashboard className='w-4 h-4 md:w-5 md:h-5 flex-shrink-0' />
								<span className='hidden md:inline'>My Dashboard</span>
							</button>
						)}
						{currentUser && (
							<>
								<div className='text-sm text-[#4B5563] hidden sm:block'>
									{currentUser.name || currentUser.email}
								</div>
								<button
									onClick={handleLogout}
									className='flex items-center space-x-2 px-3 md:px-4 py-2 text-[#4B5563] hover:text-[#DC2626] hover:bg-[#fef2f2] rounded-lg transition-colors duration-200'>
									<LogOut className='w-4 h-4 md:w-5 md:h-5' />
									<span className='font-medium text-sm md:text-base hidden sm:inline'>
										Logout
									</span>
								</button>
							</>
						)}
					</div>
				</div>
			</div>
		</motion.nav>
	);
}
