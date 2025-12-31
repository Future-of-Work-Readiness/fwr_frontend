import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
	ArrowRight,
	Zap,
	CheckCircle,
	BookOpen,
	Target,
	TrendingUp,
	Award,
	BarChart3,
	Users,
	Rocket,
	ArrowLeft,
	FileText,
	Brain,
	Star
} from 'lucide-react';
import { getCurrentUser } from '../utils/auth';
import Footer from '../src/components/Footer';

export default function OnboardingPage(): JSX.Element {
	const navigate = useNavigate();
	const currentUser = getCurrentUser();

	// Animation variants - matching LandingPage style (slower animations)
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.15,
				delayChildren: 0.3
			}
		}
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.8,
				ease: 'easeOut' as const
			}
		}
	};

	const handleGetStarted = () => {
		// Check if user has a specialization
		const hasSpecialization =
			currentUser?.specializationId !== null &&
			currentUser?.specializationId !== undefined;

		if (hasSpecialization) {
			// User already has a specialization, go to dashboard
			navigate('/dashboard');
		} else {
			// User needs to select a specialization, go to sector selection
			navigate('/sector-selection');
		}
	};

	const handleSkipToDashboard = () => {
		navigate('/dashboard');
	};

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
				transition={{ duration: 0.5, ease: 'easeOut' }}>
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
								ReadinessAi
							</span>
						</motion.div>

						<button
							onClick={handleSkipToDashboard}
							className='text-[#4B5563] hover:text-[#3A7AFE] font-medium px-3 md:px-4 py-2 transition-colors duration-200'>
							Skip to Dashboard
						</button>
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
							Welcome to <span className='text-[#3A7AFE]'>ReadinessAi</span>
							{currentUser?.name && (
								<span className='block text-3xl md:text-4xl lg:text-5xl mt-2'>
									{currentUser.name.split(' ')[0]}!
								</span>
							)}
						</motion.h1>

						<motion.p
							className='text-lg md:text-xl text-[#4B5563] leading-relaxed max-w-xl'
							variants={itemVariants}>
							You're about to embark on a journey to assess and improve your
							readiness. Let's get you set up and show
							you how everything works.
						</motion.p>

						<motion.div
							className='flex flex-col sm:flex-row gap-4 pt-4'
							variants={itemVariants}>
							<button
								onClick={handleGetStarted}
								className='group bg-[#3A7AFE] hover:bg-[#2E6AE8] text-white px-8 md:px-10 py-4 md:py-5 rounded-lg font-semibold text-base md:text-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-2'>
								<span>Get Started</span>
								<ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform duration-200' />
							</button>
							<button
								onClick={handleSkipToDashboard}
								className='text-[#3A7AFE] hover:text-[#2E6AE8] font-semibold px-8 md:px-10 py-4 md:py-5 transition-colors duration-200'>
								Skip to Dashboard
							</button>
						</motion.div>
					</motion.div>

					{/* Right Column - Visual */}
					<motion.div
						className='relative hidden lg:block'
						variants={itemVariants}
						initial='hidden'
						animate='visible'>
						<div className='relative bg-[#F7F9FC] rounded-2xl p-8 md:p-12 border border-gray-100'>
							<div className='space-y-6'>
								<div className='flex items-start space-x-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm'>
									<div className='w-12 h-12 rounded-lg bg-[#3A7AFE]/10 flex items-center justify-center flex-shrink-0'>
										<Rocket className='w-6 h-6 text-[#3A7AFE]' />
									</div>
									<div>
										<h4 className='font-semibold text-[#1C1C1C] mb-1'>
											Start Your Journey
										</h4>
										<p className='text-sm text-[#4B5563]'>
											Personalize your experience and unlock your potential
										</p>
									</div>
								</div>

								<div className='flex items-start space-x-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm'>
									<div className='w-12 h-12 rounded-lg bg-[#4CAF50]/10 flex items-center justify-center flex-shrink-0'>
										<TrendingUp className='w-6 h-6 text-[#4CAF50]' />
									</div>
									<div>
										<h4 className='font-semibold text-[#1C1C1C] mb-1'>
											Track Progress
										</h4>
										<p className='text-sm text-[#4B5563]'>
											Monitor your growth and readiness over time
										</p>
									</div>
								</div>

								<div className='flex items-start space-x-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm'>
									<div className='w-12 h-12 rounded-lg bg-[#EAB308]/10 flex items-center justify-center flex-shrink-0'>
										<Award className='w-6 h-6 text-[#EAB308]' />
									</div>
									<div>
										<h4 className='font-semibold text-[#1C1C1C] mb-1'>
											Earn Recognition
										</h4>
										<p className='text-sm text-[#4B5563]'>
											Get badges and credentials for your achievements
										</p>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* How the App Works Section */}
			<section className='bg-[#F7F9FC] py-16 md:py-24'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<motion.div
						className='text-center mb-12 md:mb-16'
						variants={itemVariants}
						initial='hidden'
						whileInView='visible'
						viewport={{ once: true }}>
						<h2 className='text-3xl md:text-4xl font-bold text-[#1C1C1C] mb-4'>
							How ReadinessAi Works
						</h2>
						<p className='text-base md:text-lg text-[#4B5563] max-w-2xl mx-auto'>
							Our platform helps you assess, improve, and demonstrate your
							readiness for tomorrow's workforce through comprehensive testing
							and personalized insights.
						</p>
					</motion.div>

					<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
						{[
							{
								icon: FileText,
								title: 'Take Knowledge Tests',
								description:
									'Complete industry-specific assessments that evaluate your technical knowledge and understanding of key concepts in your field.',
								color: 'bg-[#3A7AFE]/10',
								iconColor: 'text-[#3A7AFE]'
							},
							{
								icon: BarChart3,
								title: 'Track Your Readiness Score',
								description:
									'Monitor your Future of Work Readiness Score across technical skills, soft skills, and leadership capabilities.',
								color: 'bg-[#3A7AFE]/10',
								iconColor: 'text-[#3A7AFE]'
							},
							{
								icon: Target,
								title: 'Set Goals & Improve',
								description:
									'Define learning objectives, track your progress, and receive personalized recommendations to enhance your skills.',
								color: 'bg-[#4CAF50]/10',
								iconColor: 'text-[#4CAF50]'
							},
							{
								icon: TrendingUp,
								title: 'Compare with Peers',
								description:
									'Benchmark your performance against others in your specialization and understand where you stand in the market.',
								color: 'bg-[#3A7AFE]/10',
								iconColor: 'text-[#3A7AFE]'
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
								whileHover={{ y: -4, scale: 1.02 }}>
								<div
									className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
									<feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
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

			{/* Your Journey Section */}
			<section className='py-16 md:py-24 bg-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<motion.div
						className='text-center mb-12 md:mb-16'
						variants={itemVariants}
						initial='hidden'
						whileInView='visible'
						viewport={{ once: true }}>
						<h2 className='text-3xl md:text-4xl font-bold text-[#1C1C1C] mb-4'>
							Your Journey
						</h2>
						<p className='text-base md:text-lg text-[#4B5563] max-w-2xl mx-auto'>
							Here's what to expect as you progress through ReadinessAi
						</p>
					</motion.div>

					<div className='max-w-4xl mx-auto'>
						{[
							{
								step: 1,
								title: 'Choose Your Industry',
								description:
									'Select your industry sector, branch, and specialization to personalize your experience and receive relevant assessments.',
								icon: Target
							},
							{
								step: 2,
								title: 'Take Tests',
								description:
									'Complete knowledge tests and simulations tailored to your specialization. Each test helps build your readiness profile.',
								icon: FileText
							},
							{
								step: 4,
								title: 'Improve Skills',
								description:
									'Use insights from your results to set goals, track progress, and focus on developing the skills that matter most.',
								icon: TrendingUp
							}
						].map((journeyStep, index) => (
							<motion.div
								key={journeyStep.step}
								className='flex flex-col md:flex-row gap-6 mb-8 md:mb-12 last:mb-0'
								variants={itemVariants}
								initial='hidden'
								whileInView='visible'
								viewport={{ once: true }}
								transition={{ delay: index * 0.1 }}>
								{/* Step Number */}
								<div className='flex-shrink-0'>
									<div className='w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#3A7AFE] text-white flex items-center justify-center font-bold text-xl md:text-2xl'>
										{journeyStep.step}
									</div>
								</div>

								{/* Content */}
								<div className='flex-1 bg-[#F7F9FC] rounded-xl p-6 md:p-8 border border-gray-100'>
									<div className='flex items-start space-x-4 mb-4'>
										<div className='w-10 h-10 rounded-lg bg-[#3A7AFE]/10 flex items-center justify-center flex-shrink-0'>
											<journeyStep.icon className='w-5 h-5 text-[#3A7AFE]' />
										</div>
										<div>
											<h3 className='text-xl md:text-2xl font-semibold text-[#1C1C1C] mb-2'>
												{journeyStep.title}
											</h3>
											<p className='text-[#4B5563] leading-relaxed'>
												{journeyStep.description}
											</p>
										</div>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* What's Next Section */}
			<section className='bg-[#3A7AFE] py-16 md:py-24'>
				<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
					<motion.div
						variants={itemVariants}
						initial='hidden'
						whileInView='visible'
						viewport={{ once: true }}>
						<h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
							Ready to Get Started?
						</h2>
						<p className='text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto'>
							From your dashboard, you'll be able to access all tests, view your
							readiness scores, set goals, compare with peers, and track your
							progress over time.
						</p>
						<div className='flex flex-col sm:flex-row gap-4 justify-center'>
							<button
								onClick={handleGetStarted}
								className='group bg-white text-[#3A7AFE] px-8 md:px-10 py-4 md:py-5 rounded-lg font-semibold text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2'>
								<span>
									{currentUser?.specializationId
										? 'Go to Dashboard'
										: 'Start Personalizing'}
								</span>
								<ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform duration-200' />
							</button>
							<button
								onClick={handleSkipToDashboard}
								className='bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 px-8 md:px-10 py-4 md:py-5 rounded-lg font-semibold text-base md:text-lg transition-all duration-200'>
								Skip to Dashboard
							</button>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Footer */}
			<Footer />
		</motion.div>
	);
}
