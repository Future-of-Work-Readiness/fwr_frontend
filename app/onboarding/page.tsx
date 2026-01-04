'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers';
import { useCompleteOnboarding, type Sector, type Branch, type Specialization } from '@/hooks/api';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
	OnboardingIntro,
	SectorSelection,
	FieldSelection,
	SpecialisationSelection
} from '@/components/onboarding';

type OnboardingStep = 'intro' | 'sector' | 'field' | 'specialisation';

export default function OnboardingPage() {
	const router = useRouter();
	const { isAuthenticated, user, isLoading: authLoading, isFetching: authFetching } = useAuth();
	const completeOnboardingMutation = useCompleteOnboarding();

	const [step, setStep] = useState<OnboardingStep>('intro');
	const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
	const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

	// Redirect if not authenticated
	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.replace('/auth');
		}
	}, [isAuthenticated, authLoading, router]);

	// Redirect if onboarding is already complete
	useEffect(() => {
		if (user?.onboardingCompleted) {
			router.replace('/dashboard');
		}
	}, [user, router]);

	// Handle successful onboarding completion
	useEffect(() => {
		if (completeOnboardingMutation.isSuccess) {
			toast.success("Welcome aboard! Let's measure your readiness.");
			router.push('/dashboard');
		}
		if (completeOnboardingMutation.isError) {
			toast.error(
				completeOnboardingMutation.error?.message ||
					'Failed to save your preferences. Please try again.'
			);
		}
	}, [
		completeOnboardingMutation.isSuccess,
		completeOnboardingMutation.isError,
		completeOnboardingMutation.error,
		router
	]);

	const handleSectorSelect = (sector: Sector) => {
		setSelectedSector(sector);
		// All sectors have branches, so go to field selection
		setStep('field');
	};

	const handleFieldSelect = (branch: Branch) => {
		setSelectedBranch(branch);
		setStep('specialisation');
	};

	const handleSpecialisationSelect = async (specialization: Specialization) => {
		if (!user || !selectedSector) return;

		// Use the specialization_id directly for the backend
		completeOnboardingMutation.mutate({
			specialization_id: specialization.specialization_id,
			sector: selectedSector.name,
			field: selectedBranch?.name || null,
			specialisation: specialization.name
		});
	};

	const handleBackFromField = () => {
		setSelectedBranch(null);
		setStep('sector');
	};

	const handleBackFromSpecialisation = () => {
		setSelectedBranch(null);
		setStep('field');
	};

	// Show loading state while checking auth (wait for fresh data, not just cached)
	if (authLoading || authFetching) {
		return (
			<div className='min-h-screen gradient-hero flex items-center justify-center'>
				<Loader2 className='h-8 w-8 animate-spin text-primary-foreground' />
			</div>
		);
	}

	// Don't render if not authenticated
	if (!isAuthenticated) {
		return (
			<div className='min-h-screen gradient-hero flex items-center justify-center'>
				<div className='flex flex-col items-center gap-4'>
					<Loader2 className='h-8 w-8 animate-spin text-primary-foreground' />
					<p className='text-primary-foreground/70'>Redirecting to login...</p>
				</div>
			</div>
		);
	}

	// Don't render if onboarding is already complete (redirect in progress)
	if (user?.onboardingCompleted) {
		return (
			<div className='min-h-screen gradient-hero flex items-center justify-center'>
				<div className='flex flex-col items-center gap-4'>
					<Loader2 className='h-8 w-8 animate-spin text-primary-foreground' />
					<p className='text-primary-foreground/70'>Redirecting to dashboard...</p>
				</div>
			</div>
		);
	}

	// Render current step
	switch (step) {
		case 'intro':
			return <OnboardingIntro onContinue={() => setStep('sector')} />;
		case 'sector':
			return (
				<SectorSelection
					onSelect={handleSectorSelect}
					onBack={() => setStep('intro')}
				/>
			);
		case 'field':
			return selectedSector ? (
				<FieldSelection
					sectorId={selectedSector.sector_id}
					sectorName={selectedSector.name}
					onSelect={handleFieldSelect}
					onBack={handleBackFromField}
				/>
			) : null;
		case 'specialisation':
			return selectedBranch ? (
				<SpecialisationSelection
					branchId={selectedBranch.branch_id}
					branchName={selectedBranch.name}
					onSelect={handleSpecialisationSelect}
					onBack={handleBackFromSpecialisation}
					isLoading={completeOnboardingMutation.isPending}
				/>
			) : null;
		default:
			return null;
	}
}
