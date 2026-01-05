'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Target, Users } from 'lucide-react';
import ScrollReveal from '@/components/ui/scroll-reveal';

interface OnboardingIntroProps {
	onContinue: () => void;
}

const OnboardingIntro = ({ onContinue }: OnboardingIntroProps) => {
	return (
		<div className='min-h-screen gradient-hero flex items-center justify-center p-4'>
			<div className='w-full max-w-2xl'>
				<ScrollReveal>
					<div className='text-center mb-10'>
						<div className='inline-flex items-center justify-center mb-6'>
							<Image
								src='/assets/RAI-Logo2-nobg.png'
								alt='ReadinessAI Logo'
								width={80}
								height={80}
							/>
						</div>
						<h1 className='text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-4'>
							Choose Your Specialisation
						</h1>
					</div>
				</ScrollReveal>

				<ScrollReveal delay={0.1}>
					<Card className='border-0 shadow-xl bg-card/95 backdrop-blur-sm'>
						<CardContent className='p-8'>
							<h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
								<Target className='h-5 w-5 text-primary' />
								Why Choose a Specialisation?
							</h2>
							<p className='text-muted-foreground mb-8 leading-relaxed'>
								Making your choice helps us personalise your experience, track
								your progress, and compare your performance with peers in the
								same field.
							</p>

							<div className='grid sm:grid-cols-2 gap-4 mb-8'>
								<div className='flex flex-col items-center text-center p-4 rounded-lg'>
									<Target className='h-8 w-8 text-primary mb-2' />
									<span className='text-sm font-medium'>Knowledge Tests</span>
								</div>
								<div className='flex flex-col items-center text-center p-4 rounded-lg'>
									<Users className='h-8 w-8 text-orange mb-2' />
									<span className='text-sm font-medium'>Peer Comparison</span>
								</div>
							</div>

							<p className='text-sm text-muted-foreground text-center mb-6'>
								Don&apos;t worry, you can always update your selection later
								from your dashboard settings.
							</p>

							<Button onClick={onContinue} size='lg' className='w-full'>
								Get Started
							</Button>
						</CardContent>
					</Card>
				</ScrollReveal>
			</div>
		</div>
	);
};

export default OnboardingIntro;
