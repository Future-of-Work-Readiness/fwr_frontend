'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers';
import { useCompleteOnboarding } from '@/hooks';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { SectorType, TechnologyFieldType } from '@/lib/constants';
import {
	OnboardingIntro,
	SectorSelection,
	FieldSelection,
	SpecialisationSelection
} from '@/components/onboarding';

type OnboardingStep = 'intro' | 'sector' | 'field' | 'specialisation';

export default function OnboardingPage() {
	const router = useRouter();
	const { isAuthenticated, user, isLoading: authLoading } = useAuth();
	const completeOnboardingMutation = useCompleteOnboarding();

	const [step, setStep] = useState<OnboardingStep>('intro');
	const [sector, setSector] = useState<SectorType | null>(null);
	const [field, setField] = useState<TechnologyFieldType | null>(null);

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

	const handleSectorSelect = (selectedSector: SectorType) => {
		setSector(selectedSector);
		// For technology, go to field selection; for others, go directly to specialisation
		if (selectedSector === 'technology') {
			setStep('field');
		} else {
			setStep('specialisation');
		}
	};

	const handleFieldSelect = (selectedField: TechnologyFieldType) => {
		setField(selectedField);
		setStep('specialisation');
	};

	const handleSpecialisationSelect = async (specialisation: string) => {
		if (!user || !sector) return;

		completeOnboardingMutation.mutate({
			sector,
			field: field || null,
			specialisation
		});
	};

	const handleBackFromField = () => {
		setField(null);
		setStep('sector');
	};

	const handleBackFromSpecialisation = () => {
		if (sector === 'technology') {
			setStep('field');
		} else {
			setStep('sector');
		}
	};

	// Show loading state while checking auth
	if (authLoading) {
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
			return (
				<FieldSelection
					onSelect={handleFieldSelect}
					onBack={handleBackFromField}
				/>
			);
		case 'specialisation':
			return sector ? (
				<SpecialisationSelection
					sector={sector}
					field={field || undefined}
					onSelect={handleSpecialisationSelect}
					onBack={handleBackFromSpecialisation}
					isLoading={completeOnboardingMutation.isPending}
				/>
			) : null;
		default:
			return null;
	}
}
