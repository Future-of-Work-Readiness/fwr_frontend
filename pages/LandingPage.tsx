import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
	ArrowRight,
	Zap,
	CheckCircle,
	TrendingUp,
	Users,
	Target,
	BookOpen,
	BarChart3,
	Award
} from 'lucide-react';
import SignUpModal from '../src/components/SignUpModal';
import LoginModal from '../src/components/LoginModal';

export default function LandingPage() {
	const [showLogin, setShowLogin] = useState(false);
	const [showSignUp, setShowSignUp] = useState(false);

	const handleGetStarted = () => {
		// Navigate to onboarding for new users
		setShowSignUp(true);
	};

	const handleLoginClick = () => {
		setShowLogin(true);
	};

	// Gentle animation variants - Educative.io style
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.12,
				delayChildren: 0.2
			}
		}
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: [0.6, -0.05, 0.01, 0.99] as const
			}
		}
	};

	const currentYear = new Date().getFullYear();

	return (
		<motion.div
			className='min-h-screen bg-white'
			initial='hidden'
			animate='visible'
			variants={containerVariants}>
			{/* Navigation */}
			<motion.nav
				className='bg-white border-b border-gray-200 sticky top-0 z-50'
				initial={{ y: -20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.6, ease: 'easeOut' }}>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between items-center h-16 md:h-20'>
						<motion.div
							className='flex items-center space-x-3'
							whileHover={{ scale: 1.02 }}
							transition={{ duration: 0.2 }}>
							<div className='w-10 h-10 bg-[#3A7AFE] rounded-lg flex items-center justify-center'>
								<Zap className='w-6 h-6 text-white' />
							</div>
							<span className='text-xl md:text-2xl font-bold text-[#1D2433]'>
								FutureReady
							</span>
						</motion.div>

						<div className='flex items-center space-x-3 md:space-x-4'>
							<button
								onClick={handleLoginClick}
								className='text-[#4B5563] hover:text-[#3A7AFE] font-medium px-3 md:px-4 py-2 transition-colors duration-200'>
								Login
							</button>
							<button
								onClick={() => setShowSignUp(true)}
								className='bg-[#3A7AFE] hover:bg-[#2E6AE8] text-white font-medium px-4 md:px-6 py-2 rounded-lg transition-colors duration-200'>
								Sign Up
							</button>
						</div>
					</div>
				</div>
			</motion.nav>

			{/* Hero Section */}
			<section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24'>
				<div className='grid lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
					{/* Left Column - Content */}
					<motion.div
						className='space-y-6 md:space-y-8'
						variants={containerVariants}
						initial='hidden'
						animate='visible'>
						<motion.h1
							className='text-4xl md:text-5xl lg:text-6xl font-bold text-[#1C1C1C] leading-tight'
							variants={itemVariants}>
							Are You Ready for the{' '}
							<span className='text-[#3A7AFE]'>Future of Work?</span>
						</motion.h1>

						<motion.p
							className='text-lg md:text-xl text-[#4B5563] leading-relaxed max-w-xl'
							variants={itemVariants}>
							Test your skills, get your readiness score, and prepare for
							tomorrow's jobs.
						</motion.p>

						<motion.div
							className='flex flex-col sm:flex-row gap-4 pt-4'
							variants={itemVariants}>
							<button
								onClick={handleGetStarted}
								className='group bg-[#3A7AFE] hover:bg-[#2E6AE8] text-white px-8 md:px-10 py-4 md:py-5 rounded-lg font-semibold text-base md:text-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-2'>
								<span>Get Started for Free</span>
								<ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform duration-200' />
							</button>
							<button
								onClick={handleLoginClick}
								className='text-[#3A7AFE] hover:text-[#2E6AE8] font-semibold px-8 md:px-10 py-4 md:py-5 transition-colors duration-200'>
								Login
							</button>
						</motion.div>

						<motion.div
							className='flex items-center gap-6 pt-2'
							variants={itemVariants}>
							<div className='flex items-center space-x-2'>
								<CheckCircle className='w-5 h-5 text-green-600' />
								<span className='text-[#4B5563] text-sm md:text-base'>
									No credit card required
								</span>
							</div>
						</motion.div>
					</motion.div>

					{/* Right Column - Visual */}
					<motion.div
						className='relative hidden lg:block'
						variants={itemVariants}
						initial='hidden'
						animate='visible'>
						{/* Simple, calm illustration */}
						<div className='relative bg-[#F7F9FC] rounded-2xl p-8 md:p-12 border border-gray-100'>
							{/* Feature cards - static, no rotation */}
							<div className='space-y-6'>
								<div className='flex items-start space-x-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm'>
									<div className='w-12 h-12 rounded-lg bg-[#3A7AFE]/10 flex items-center justify-center flex-shrink-0'>
										<Target className='w-6 h-6 text-[#3A7AFE]' />
									</div>
									<div>
										<h4 className='font-semibold text-[#1C1C1C] mb-1'>
											Skill Assessment
										</h4>
										<p className='text-sm text-[#4B5563]'>
											Industry-specific tests and simulations
										</p>
									</div>
								</div>

								<div className='flex items-start space-x-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm'>
									<div className='w-12 h-12 rounded-lg bg-[#3A7AFE]/10 flex items-center justify-center flex-shrink-0'>
										<TrendingUp className='w-6 h-6 text-[#3A7AFE]' />
									</div>
									<div>
										<h4 className='font-semibold text-[#1C1C1C] mb-1'>
											Track Progress
										</h4>
										<p className='text-sm text-[#4B5563]'>
											Monitor improvement over time
										</p>
									</div>
								</div>

								<div className='flex items-start space-x-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm'>
									<div className='w-12 h-12 rounded-lg bg-[#3A7AFE]/10 flex items-center justify-center flex-shrink-0'>
										<Users className='w-6 h-6 text-[#3A7AFE]' />
									</div>
									<div>
										<h4 className='font-semibold text-[#1C1C1C] mb-1'>
											Compare & Learn
										</h4>
										<p className='text-sm text-[#4B5563]'>
											Benchmark against peers
										</p>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Features Section */}
			<section className='bg-[#F7F9FC] py-16 md:py-24'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<motion.div
						className='text-center mb-12 md:mb-16'
						variants={itemVariants}
						initial='hidden'
						whileInView='visible'
						viewport={{ once: true }}>
						<h2 className='text-2xl md:text-3xl font-semibold text-[#1C1C1C] mb-4'>
							Why Choose FutureReady?
						</h2>
						<p className='text-base md:text-lg text-[#4B5563] max-w-2xl mx-auto'>
							Comprehensive assessments and personalized insights to help you
							succeed in the future of work
						</p>
					</motion.div>

					<div className='grid md:grid-cols-3 gap-6 md:gap-8'>
						{[
							{
								icon: BookOpen,
								title: 'Comprehensive Learning',
								description:
									'Access industry-specific courses and assessments tailored to your career goals.'
							},
							{
								icon: BarChart3,
								title: 'Detailed Analytics',
								description:
									'Track your progress with detailed insights and personalized recommendations.'
							},
							{
								icon: Award,
								title: 'Career Readiness',
								description:
									"Get certified and demonstrate your readiness for tomorrow's job market."
							}
						].map((feature, index) => (
							<motion.div
								key={feature.title}
								className='bg-white rounded-xl p-6 md:p-8 border border-gray-100 shadow-sm'
								variants={itemVariants}
								initial='hidden'
								whileInView='visible'
								viewport={{ once: true }}
								transition={{ delay: index * 0.1 }}
								whileHover={{ y: -4 }}>
								<div className='w-12 h-12 rounded-lg bg-[#3A7AFE]/10 flex items-center justify-center mb-4'>
									<feature.icon className='w-6 h-6 text-[#3A7AFE]' />
								</div>
								<h3 className='text-xl font-semibold text-[#1C1C1C] mb-2'>
									{feature.title}
								</h3>
								<p className='text-[#4B5563] leading-relaxed'>
									{feature.description}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className='bg-white border-t border-gray-200 py-10 md:py-12'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='grid md:grid-cols-4 gap-8 md:gap-12'>
						{/* Brand */}
						<div className='md:col-span-1'>
							<div className='flex items-center space-x-3 mb-4'>
								<div className='w-10 h-10 bg-[#3A7AFE] rounded-lg flex items-center justify-center'>
									<Zap className='w-6 h-6 text-white' />
								</div>
								<span className='text-xl font-bold text-[#1D2433]'>
									FutureReady
								</span>
							</div>
							<p className='text-sm text-[#4B5563]'>
								Preparing you for the future of work.
							</p>
						</div>

						{/* Links */}
						<div>
							<h4 className='font-semibold text-[#1C1C1C] mb-4'>Product</h4>
							<ul className='space-y-2'>
								<li>
									<a
										href='#'
										className='text-sm text-[#4B5563] hover:text-[#3A7AFE] transition-colors duration-200'>
										Features
									</a>
								</li>
								<li>
									<a
										href='#'
										className='text-sm text-[#4B5563] hover:text-[#3A7AFE] transition-colors duration-200'>
										Pricing
									</a>
								</li>
								<li>
									<a
										href='#'
										className='text-sm text-[#4B5563] hover:text-[#3A7AFE] transition-colors duration-200'>
										About
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h4 className='font-semibold text-[#1C1C1C] mb-4'>Legal</h4>
							<ul className='space-y-2'>
								<li>
									<a
										href='#'
										className='text-sm text-[#4B5563] hover:text-[#3A7AFE] transition-colors duration-200'>
										Privacy Policy
									</a>
								</li>
								<li>
									<a
										href='#'
										className='text-sm text-[#4B5563] hover:text-[#3A7AFE] transition-colors duration-200'>
										Terms of Service
									</a>
								</li>
								<li>
									<a
										href='#'
										className='text-sm text-[#4B5563] hover:text-[#3A7AFE] transition-colors duration-200'>
										Contact
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h4 className='font-semibold text-[#1C1C1C] mb-4'>Support</h4>
							<ul className='space-y-2'>
								<li>
									<a
										href='#'
										className='text-sm text-[#4B5563] hover:text-[#3A7AFE] transition-colors duration-200'>
										Help Center
									</a>
								</li>
								<li>
									<a
										href='#'
										className='text-sm text-[#4B5563] hover:text-[#3A7AFE] transition-colors duration-200'>
										Documentation
									</a>
								</li>
							</ul>
						</div>
					</div>

					{/* Copyright */}
					<div className='mt-8 md:mt-12 pt-8 border-t border-gray-200'>
						<p className='text-sm text-[#4B5563] text-center'>
							© {currentYear} FutureReady. All rights reserved.
						</p>
					</div>
				</div>
			</footer>

			{/* Login Modal */}
			<LoginModal
				isOpen={showLogin}
				onClose={() => setShowLogin(false)}
				onSwitchToSignUp={() => {
					setShowLogin(false);
					setShowSignUp(true);
				}}
			/>

			{/* Sign Up Modal */}
			<SignUpModal isOpen={showSignUp} onClose={() => setShowSignUp(false)} />
		</motion.div>
	);
}
