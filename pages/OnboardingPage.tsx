import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
	Code,
	Heart,
	Briefcase,
	GraduationCap,
	ShoppingBag,
	Building2,
	ArrowLeft,
	ArrowRight,
	CheckCircle2,
	AlertCircle,
	Loader2
} from 'lucide-react';
import {
	getSectors,
	getBranches,
	getSpecializations,
	updateUserSpecialization
} from '../utils/api';
import { getCurrentUser } from '../utils/auth';
import { showToast } from '../src/lib/toastConfig';
import type { Sector, Branch, Specialization } from '../src/types';

export default function OnboardingPage(): JSX.Element {
	const [currentStep, setCurrentStep] = useState<number>(1);
	const [selectedSector, setSelectedSector] = useState<string>('');
	const [selectedBranch, setSelectedBranch] = useState<string>('');
	const [selectedSpecialization, setSelectedSpecialization] =
		useState<string>('');
	const [sectors, setSectors] = useState<Sector[]>([]);
	const [branches, setBranches] = useState<Branch[]>([]);
	const [specializations, setSpecializations] = useState<Specialization[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>('');
	const navigate = useNavigate();

	// Icon mapping for sectors using lucide-react
	const sectorIcons: Record<
		string,
		React.ComponentType<{ className?: string }>
	> = {
		Technology: Code,
		Healthcare: Heart,
		Finance: Briefcase,
		Education: GraduationCap,
		Retail: ShoppingBag
	};

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
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
				duration: 0.5,
				ease: 'easeOut' as const
			}
		}
	};

	// Load sectors on component mount
	useEffect(() => {
		const loadSectors = async () => {
			try {
				setLoading(true);
				setError('');
				const sectorsData = await getSectors();
				console.log('Loaded sectors:', sectorsData);
				setSectors(sectorsData);
				if (sectorsData.length === 0) {
					setError(
						'No sectors found. Please check if the database has been populated.'
					);
				}
			} catch (err) {
				console.error('Failed to load sectors:', err);
				setError(
					'Failed to load sectors. Please check if the backend is running.'
				);
			} finally {
				setLoading(false);
			}
		};

		loadSectors();
	}, []);

	// Load branches when sector is selected
	useEffect(() => {
		const loadBranches = async () => {
			if (selectedSector) {
				try {
					setError('');
					setLoading(true);
					const branchesData = await getBranches(selectedSector);
					setBranches(branchesData);
				} catch (err) {
					console.error('Failed to load branches:', err);
					setError('Failed to load branches.');
					setBranches([]);
				} finally {
					setLoading(false);
				}
			}
		};

		loadBranches();
	}, [selectedSector]);

	// Load specializations when branch is selected
	useEffect(() => {
		const loadSpecializations = async () => {
			if (selectedBranch) {
				try {
					setError('');
					setLoading(true);
					const specsData = await getSpecializations(selectedBranch);
					setSpecializations(specsData);
				} catch (err) {
					console.error('Failed to load specializations:', err);
					setError('Failed to load specializations.');
					setSpecializations([]);
				} finally {
					setLoading(false);
				}
			}
		};

		loadSpecializations();
	}, [selectedBranch]);

	const handleSectorSelect = (sectorId: string | number): void => {
		setSelectedSector(String(sectorId));
		setSelectedBranch('');
		setSelectedSpecialization('');
		setCurrentStep(2);
	};

	const handleBranchSelect = (branchId: string | number): void => {
		setSelectedBranch(String(branchId));
		setSelectedSpecialization('');
		setCurrentStep(3);
	};

	const handleSpecializationSelect = (
		specializationId: string | number
	): void => {
		setSelectedSpecialization(String(specializationId));
	};

	const handleComplete = async () => {
		if (!selectedSpecialization) {
			setError('Please select a specialization');
			showToast('error', 'Please select a specialization to continue');
			return;
		}

		try {
			setLoading(true);
			setError('');

			// Get current user and save specialization selection
			const currentUser = getCurrentUser();
			if (currentUser && currentUser.id) {
				try {
					const result = await updateUserSpecialization(
						currentUser.id,
						parseInt(selectedSpecialization)
					);
					if (result && result.success) {
						// Backend returns updated user object
						const userData = result.user || result;
						if (userData && userData.id) {
							// Map backend response to frontend format
							const updatedUser = {
								id: userData.id,
								email: userData.email,
								name: userData.name,
								specializationId: userData.specialization_id,
								specialization_id: userData.specialization_id,
								readinessScore: userData.readiness_score || 0,
								technicalScore: userData.technical_score || 0,
								softSkillsScore: userData.soft_skills_score || 0,
								leadershipScore: userData.leadership_score || 0,
								createdAt: userData.created_at
							};
							localStorage.setItem('currentUser', JSON.stringify(updatedUser));
						} else {
							// Fallback: update localStorage with specializationId
							const updatedUser = {
								...currentUser,
								specializationId: parseInt(selectedSpecialization),
								specialization_id: parseInt(selectedSpecialization)
							};
							localStorage.setItem('currentUser', JSON.stringify(updatedUser));
						}
						showToast('success', 'Profile setup complete!');
						navigate('/dashboard');
					} else {
						throw new Error(result?.error || 'Failed to save specialization');
					}
				} catch (saveError) {
					console.warn('Failed to save specialization to backend:', saveError);
					// Still continue - update localStorage anyway
					const updatedUser = {
						...currentUser,
						specializationId: parseInt(selectedSpecialization),
						specialization_id: parseInt(selectedSpecialization)
					};
					localStorage.setItem('currentUser', JSON.stringify(updatedUser));
					showToast('success', 'Profile setup complete!');
					navigate('/dashboard');
				}
			} else {
				showToast('error', 'User session not found. Please log in again.');
				navigate('/');
			}
		} catch (err) {
			const error = err instanceof Error ? err : new Error('Unknown error');
			console.error('Failed to save specialization:', error);
			setError(
				error.message ||
					'Failed to save selections. You can continue to dashboard.'
			);
			showToast(
				'error',
				'Failed to save selections. Redirecting to dashboard...'
			);
			setLoading(false);
			// Still allow navigation even if save fails
			setTimeout(() => navigate('/dashboard'), 2000);
		}
	};

	const handleBack = () => {
		if (currentStep === 3) {
			setCurrentStep(2);
			setSelectedSpecialization('');
			setSelectedBranch('');
		} else if (currentStep === 2) {
			setCurrentStep(1);
			setSelectedBranch('');
			setSelectedSector('');
		} else {
			navigate('/');
		}
	};

	if (loading && sectors.length === 0) {
		return (
			<motion.div
				className='min-h-screen flex items-center justify-center bg-white'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}>
				<div className='text-center'>
					<motion.div
						animate={{ rotate: 360 }}
						transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
						<Loader2 className='w-12 h-12 text-[#3A7AFE] mx-auto mb-4' />
					</motion.div>
					<p className='text-[#4B5563]'>Loading sectors...</p>
				</div>
			</motion.div>
		);
	}

	return (
		<motion.div
			className='min-h-screen bg-white'
			initial='hidden'
			animate='visible'
			variants={containerVariants}>
			<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12'>
				<motion.div
					className='bg-white rounded-2xl p-6 md:p-12 shadow-sm border border-[#E5E7EB]'
					variants={itemVariants}>
					{/* Header */}
					<motion.div
						className='text-center mb-8 md:mb-12'
						variants={itemVariants}>
						<h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-[#1C1C1C] mb-4'>
							Welcome to Your Journey
						</h1>
						<p className='text-base md:text-lg text-[#4B5563]'>
							{currentStep === 1
								? "Let's start by selecting your industry sector"
								: currentStep === 2
								? 'Now choose a branch within this sector'
								: 'Finally, select your specialization'}
						</p>
					</motion.div>

					{/* Progress Indicator */}
					<motion.div
						className='flex items-center justify-center mb-8 md:mb-12'
						variants={itemVariants}>
						<motion.div
							className={`w-8 h-8 md:w-10 md:h-10 rounded-full text-white flex items-center justify-center font-bold text-sm md:text-base transition-colors duration-300 ${
								currentStep >= 1 ? 'bg-[#3A7AFE]' : 'bg-[#d1d5db]'
							}`}
							whileHover={{ scale: 1.1 }}
							transition={{ duration: 0.2 }}>
							{currentStep > 1 ? <CheckCircle2 className='w-5 h-5' /> : '1'}
						</motion.div>
						<motion.div
							className={`h-0.5 w-12 md:w-16 mx-2 md:mx-4 transition-colors duration-300 ${
								currentStep >= 2 ? 'bg-[#3A7AFE]' : 'bg-[#d1d5db]'
							}`}
							initial={{ scaleX: 0 }}
							animate={{ scaleX: currentStep >= 2 ? 1 : 0.3 }}
							transition={{ duration: 0.4, ease: 'easeOut' }}
						/>
						<motion.div
							className={`w-8 h-8 md:w-10 md:h-10 rounded-full text-white flex items-center justify-center font-bold text-sm md:text-base transition-colors duration-300 ${
								currentStep >= 2 ? 'bg-[#3A7AFE]' : 'bg-[#d1d5db]'
							}`}
							whileHover={{ scale: 1.1 }}
							transition={{ duration: 0.2 }}>
							{currentStep > 2 ? <CheckCircle2 className='w-5 h-5' /> : '2'}
						</motion.div>
						<motion.div
							className={`h-0.5 w-12 md:w-16 mx-2 md:mx-4 transition-colors duration-300 ${
								currentStep >= 3 ? 'bg-[#3A7AFE]' : 'bg-[#d1d5db]'
							}`}
							initial={{ scaleX: 0 }}
							animate={{ scaleX: currentStep >= 3 ? 1 : 0.3 }}
							transition={{ duration: 0.4, ease: 'easeOut' }}
						/>
						<motion.div
							className={`w-8 h-8 md:w-10 md:h-10 rounded-full text-white flex items-center justify-center font-bold text-sm md:text-base transition-colors duration-300 ${
								currentStep >= 3 ? 'bg-[#3A7AFE]' : 'bg-[#d1d5db]'
							}`}
							whileHover={{ scale: 1.1 }}
							transition={{ duration: 0.2 }}>
							{currentStep > 3 ? <CheckCircle2 className='w-5 h-5' /> : '3'}
						</motion.div>
					</motion.div>

					{/* Error Message */}
					{error && (
						<motion.div
							className='bg-[#fef2f2] border border-[#fee2e2] text-[#DC2626] p-4 rounded-lg mb-6 md:mb-8 flex items-center space-x-2'
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -10 }}>
							<AlertCircle className='w-5 h-5 flex-shrink-0' />
							<p className='text-sm'>{error}</p>
						</motion.div>
					)}

					{/* Step 1: Sector Selection */}
					{currentStep === 1 && (
						<motion.div
							key='step1'
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 20 }}
							transition={{ duration: 0.4, ease: 'easeOut' }}>
							<h2 className='text-xl md:text-2xl font-semibold mb-6 md:mb-8 text-[#1C1C1C]'>
								Choose Your Industry Sector
							</h2>
							{loading ? (
								<div className='text-center py-8'>
									<motion.div
										animate={{ rotate: 360 }}
										transition={{
											duration: 1,
											repeat: Infinity,
											ease: 'linear'
										}}>
										<Loader2 className='w-8 h-8 text-[#3A7AFE] mx-auto mb-4' />
									</motion.div>
									<p className='text-[#4B5563]'>Loading sectors...</p>
								</div>
							) : sectors.length === 0 ? (
								<div className='bg-[#fffbeb] border border-[#fef3c7] text-[#d97706] p-4 rounded-lg mb-8 text-center flex items-center justify-center space-x-2'>
									<AlertCircle className='w-5 h-5' />
									<p>No sectors available. Please check the database.</p>
								</div>
							) : (
								<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
									{sectors.map((sector, index) => {
										const IconComponent =
											sectorIcons[sector.name as string] || Building2;
										return (
											<motion.button
												key={sector.id}
												onClick={() => handleSectorSelect(sector.id)}
												className='p-6 md:p-8 border-2 border-[#E5E7EB] rounded-xl bg-white cursor-pointer text-center transition-all duration-200 hover:border-[#3A7AFE] hover:bg-[#3A7AFE]/10'
												variants={itemVariants}
												initial='hidden'
												animate='visible'
												transition={{ delay: index * 0.05 }}
												whileHover={{ y: -4, scale: 1.02 }}
												whileTap={{ scale: 0.98 }}>
												<div className='w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 bg-[#3A7AFE]/10 rounded-xl flex items-center justify-center'>
													<IconComponent className='w-6 h-6 md:w-8 md:h-8 text-[#3A7AFE]' />
												</div>
												<div className='font-semibold text-[#1C1C1C] text-base md:text-lg mb-2'>
													{sector.name}
												</div>
												<div className='text-sm text-[#4B5563]'>
													{sector.description}
												</div>
											</motion.button>
										);
									})}
								</div>
							)}
						</motion.div>
					)}

					{/* Step 2: Branch Selection */}
					{currentStep === 2 && (
						<motion.div
							key='step2'
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 20 }}
							transition={{ duration: 0.4, ease: 'easeOut' }}>
							<h2 className='text-xl md:text-2xl font-semibold mb-6 md:mb-8 text-[#1C1C1C]'>
								Choose Your Branch
							</h2>
							{loading ? (
								<div className='text-center py-8 text-[#4B5563]'>
									<motion.div
										animate={{ rotate: 360 }}
										transition={{
											duration: 1,
											repeat: Infinity,
											ease: 'linear'
										}}>
										<Loader2 className='w-8 h-8 text-[#3A7AFE] mx-auto mb-4' />
									</motion.div>
									<p>Loading branches...</p>
								</div>
							) : (
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6'>
									{branches.map((branch, index) => (
										<motion.button
											key={branch.id}
											onClick={() => handleBranchSelect(branch.id)}
											className='p-6 border-2 border-[#E5E7EB] rounded-xl bg-white cursor-pointer text-left transition-all duration-200 hover:border-[#3A7AFE] hover:bg-[#3A7AFE]/10'
											variants={itemVariants}
											initial='hidden'
											animate='visible'
											transition={{ delay: index * 0.05 }}
											whileHover={{ y: -4, scale: 1.02 }}
											whileTap={{ scale: 0.98 }}>
											<div className='font-semibold text-[#1C1C1C] mb-2 text-base md:text-lg'>
												{branch.name}
											</div>
											<div className='text-sm text-[#4B5563]'>
												{branch.description}
											</div>
										</motion.button>
									))}
								</div>
							)}
						</motion.div>
					)}

					{/* Step 3: Specialization Selection */}
					{currentStep === 3 && (
						<motion.div
							key='step3'
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 20 }}
							transition={{ duration: 0.4, ease: 'easeOut' }}>
							<h2 className='text-xl md:text-2xl font-semibold mb-6 md:mb-8 text-[#1C1C1C]'>
								Choose Your Specialization
							</h2>
							{loading ? (
								<div className='text-center py-8 text-[#4B5563]'>
									<motion.div
										animate={{ rotate: 360 }}
										transition={{
											duration: 1,
											repeat: Infinity,
											ease: 'linear'
										}}>
										<Loader2 className='w-8 h-8 text-[#3A7AFE] mx-auto mb-4' />
									</motion.div>
									<p>Loading specializations...</p>
								</div>
							) : (
								<div className='mb-6 md:mb-8 space-y-3'>
									{specializations.map((spec, index) => (
										<motion.label
											key={spec.id}
											className={`block p-4 md:p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
												selectedSpecialization === String(spec.id)
													? 'border-[#3A7AFE] bg-[#3A7AFE]/10'
													: 'border-[#E5E7EB] bg-white hover:border-[#3A7AFE]/50'
											}`}
											variants={itemVariants}
											initial='hidden'
											animate='visible'
											transition={{ delay: index * 0.05 }}
											whileHover={{ scale: 1.01 }}
											whileTap={{ scale: 0.99 }}>
											<div className='flex items-start space-x-3'>
												<input
													type='radio'
													name='specialization'
													value={spec.id}
													checked={selectedSpecialization === String(spec.id)}
													onChange={(e) =>
														handleSpecializationSelect(e.target.value)
													}
													className='mt-1 w-4 h-4 text-[#3A7AFE] focus:ring-[#3A7AFE]'
												/>
												<div className='flex-1'>
													<span className='font-semibold text-[#1C1C1C] text-base md:text-lg block mb-1'>
														{spec.name}
													</span>
													<div className='text-sm text-[#4B5563]'>
														{spec.description}
													</div>
												</div>
											</div>
										</motion.label>
									))}
								</div>
							)}
						</motion.div>
					)}

					{/* Navigation Buttons */}
					<motion.div
						className='flex flex-col sm:flex-row justify-between gap-4 mt-8 md:mt-12'
						variants={itemVariants}>
						<button
							onClick={handleBack}
							className='px-6 py-3 border border-[#d1d5db] rounded-lg bg-white text-[#374151] cursor-pointer flex items-center justify-center gap-2 transition-colors duration-200 hover:bg-[#F7F9FC]'>
							<ArrowLeft className='w-5 h-5' />
							<span>Back</span>
						</button>

						{currentStep === 3 && (
							<button
								onClick={handleComplete}
								disabled={!selectedSpecialization || loading}
								className={`px-6 py-3 border-none rounded-lg text-white flex items-center justify-center gap-2 transition-colors duration-200 w-full sm:w-auto ${
									selectedSpecialization && !loading
										? 'bg-[#3A7AFE] hover:bg-[#2E6AE8] cursor-pointer'
										: 'bg-[#9ca3af] cursor-not-allowed'
								}`}>
								{loading ? (
									<>
										<Loader2 className='w-5 h-5 animate-spin' />
										<span>Saving...</span>
									</>
								) : (
									<>
										<span>Complete</span>
										<ArrowRight className='w-5 h-5' />
									</>
								)}
							</button>
						)}
						{currentStep === 2 && (
							<button
								onClick={() => {
									const firstBranchId = branches[0]?.id;
									if (firstBranchId !== undefined) {
										handleBranchSelect(firstBranchId);
									}
								}}
								disabled={branches.length === 0}
								className={`px-6 py-3 border-none rounded-lg text-white flex items-center justify-center gap-2 transition-colors duration-200 w-full sm:w-auto ${
									branches.length > 0
										? 'bg-[#3A7AFE] hover:bg-[#2E6AE8] cursor-pointer'
										: 'bg-[#9ca3af] cursor-not-allowed'
								}`}>
								<span>Next</span>
								<ArrowRight className='w-5 h-5' />
							</button>
						)}
					</motion.div>
				</motion.div>
			</div>
		</motion.div>
	);
}
