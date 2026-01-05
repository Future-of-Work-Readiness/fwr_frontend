'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers';
import { useCareerStore } from '@/stores/useCareerStore';
import {
	useAddCareer,
	useCareersQuery,
	type Sector,
	type Branch,
	type Specialization
} from '@/hooks/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
	SectorSelection,
	FieldSelection,
	SpecialisationSelection
} from '@/components/onboarding';

type AddCareerStep = 'sector' | 'field' | 'specialisation';

export default function AddCareerPage() {
	const router = useRouter();
	const { user, isLoading: authLoading } = useAuth();
	const { setCurrentCareer } = useCareerStore();
	const [step, setStep] = useState<AddCareerStep>('sector');
	const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
	const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

	const addCareerMutation = useAddCareer();

	// Get existing careers to prevent duplicates
	const { data: existingCareers } = useCareersQuery();
	const existingSpecialisations =
		existingCareers
			?.map((c) => c.specialisation?.toUpperCase())
			.filter((s): s is string => s !== undefined) || [];

	const handleSectorSelect = (sector: Sector) => {
		setSelectedSector(sector);
		// All sectors go to field selection (step 2) to pick a branch
		setStep('field');
	};

	const handleBranchSelect = (branch: Branch) => {
		setSelectedBranch(branch);
		setStep('specialisation');
	};

	const handleSpecialisationSelect = async (specialization: Specialization) => {
		if (!user || !selectedSector) {
			toast.error('Missing user or sector information.');
			return;
		}

		// Check if this career already exists
		if (existingSpecialisations.includes(specialization.name.toUpperCase())) {
			toast.error(
				'You already have this career profile. Please select a different specialization.'
			);
			return;
		}

		try {
			const result = await addCareerMutation.mutateAsync({
				sector: selectedSector.name as
					| 'technology'
					| 'finance'
					| 'health_social_care'
					| 'education'
					| 'construction',
				field: selectedBranch?.name || null,
				specialisation: specialization.name,
				is_primary: false // New careers are not primary by default
			});

			// Set the new career as current
			if (result.career) {
				setCurrentCareer(result.career);
			}
			toast.success('Career profile created successfully!');
			router.push('/careers');
		} catch (error: unknown) {
			console.error('Error creating career:', error);
			const errorMessage =
				error instanceof Error ? error.message : 'Unknown error';
			toast.error(
				`Failed to create career profile: ${errorMessage}. Please try again.`
			);
		}
	};

	const handleBackFromField = () => {
		setSelectedBranch(null);
		setStep('sector');
	};

	const handleBackFromSpecialisation = () => {
		setStep('field');
	};

	const handleBackFromSector = () => {
		router.push('/careers');
	};

	if (authLoading) {
		return (
			<div className='min-h-screen gradient-hero flex items-center justify-center'>
				<Loader2 className='h-8 w-8 animate-spin text-primary-foreground' />
			</div>
		);
	}

	switch (step) {
		case 'sector':
			return (
				<SectorSelection
					onSelect={handleSectorSelect}
					onBack={handleBackFromSector}
				/>
			);
		case 'field':
			return selectedSector ? (
				<FieldSelection
					sectorId={selectedSector.sector_id}
					sectorName={selectedSector.name}
					onSelect={handleBranchSelect}
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
					isLoading={addCareerMutation.isPending}
					excludedSpecialisations={existingSpecialisations}
				/>
			) : null;
		default:
			return null;
	}
}
