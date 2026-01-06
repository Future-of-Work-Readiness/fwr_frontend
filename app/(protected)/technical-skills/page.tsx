'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers';
import { useCareerStore } from '@/stores/useCareerStore';
import { useQuizAttemptSummary, type LevelAttemptSummary } from '@/hooks/api';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import ScrollReveal from '@/components/ui/scroll-reveal';
import {
	Loader2,
	Code,
	ChevronRight,
	ArrowLeft,
	CheckCircle2,
	AlertCircle,
	Clock
} from 'lucide-react';
import {
	formatSpecialisation,
	SKILL_LEVELS,
	getLevelColor
} from '@/lib/constants';

/**
 * Format a date string to relative time (e.g., "2 days ago")
 */
function formatRelativeTime(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return 'Today';
	if (diffDays === 1) return 'Yesterday';
	if (diffDays < 7) return `${diffDays} days ago`;
	if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
	if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
	return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Get the button text based on attempt status
 */
function getButtonText(levelSummary: LevelAttemptSummary | undefined): string {
	if (!levelSummary || !levelSummary.attempted) {
		return 'Start Test';
	}
	if (levelSummary.passed) {
		return 'Practice Again';
	}
	return 'Retake Test';
}

/**
 * Get the status badge for a level
 */
function LevelStatusBadge({
	levelSummary
}: {
	levelSummary: LevelAttemptSummary | undefined;
}) {
	if (!levelSummary || !levelSummary.attempted) {
		return null;
	}

	if (levelSummary.passed) {
		return (
			<Badge className='bg-emerald-100 text-emerald-700 border-emerald-200 gap-1'>
				<CheckCircle2 className='h-3 w-3' />
				Passed
			</Badge>
		);
	}

	return (
		<Badge className='bg-amber-100 text-amber-700 border-amber-200 gap-1'>
			<AlertCircle className='h-3 w-3' />
			Not Passed
		</Badge>
	);
}

export default function TechnicalSkillsPage() {
	const router = useRouter();
	const { isLoading: authLoading } = useAuth();
	const { currentCareer, isLoading: careerLoading } = useCareerStore();

	// Fetch attempt summary for the current specialisation
	const { data: attemptSummary, isLoading: summaryLoading } =
		useQuizAttemptSummary(currentCareer?.specialisation ?? undefined);

	// Group exercises by level
	const exercisesByLevel = SKILL_LEVELS.map((level, levelIndex) => ({
		level,
		levelNumber: levelIndex + 1,
		questionCount: 20,
		totalDuration: 30,
		description: `Assess your ${level.toLowerCase()} level skills with 20 comprehensive questions`,
		specialisation: currentCareer?.specialisation || ''
	}));

	if (authLoading || careerLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-background'>
				<Loader2 className='h-8 w-8 animate-spin text-primary' />
			</div>
		);
	}

	const hasSpecialisation = !!currentCareer?.specialisation;

	return (
		<div className='min-h-screen bg-background'>
			<div className='flex'>
				<main className='flex-1 p-4 lg:p-8 pt-8'>
					<div className='max-w-7xl mx-auto space-y-8'>
						<ScrollReveal>
							<div className='mb-6 sm:mb-8'>
								<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-4'>
									<Button
										variant='ghost'
										onClick={() => router.push('/dashboard')}
										className='text-muted-foreground hover:text-foreground w-full sm:w-auto'>
										<ArrowLeft className='h-4 w-4 mr-2' />
										Back to Dashboard
									</Button>
								</div>
								<h1 className='text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-2 bg-gradient-to-r from-primary to-orange bg-clip-text text-transparent'>
									Technical Skills Tests
								</h1>
								<p className='text-muted-foreground text-sm sm:text-base lg:text-lg'>
									{currentCareer?.specialisation
										? `Tests tailored for ${formatSpecialisation(
												currentCareer.specialisation
										  )}`
										: 'Complete your profile to see personalised tests'}
								</p>
							</div>
						</ScrollReveal>

						{!hasSpecialisation ? (
							<Card className='border-2 border-primary/20 bg-white shadow-lg'>
								<CardContent className='py-12 text-center'>
									<Code className='h-12 w-12 mx-auto text-primary/60 mb-4' />
									<h3 className='text-lg font-semibold mb-2'>
										No exercises available
									</h3>
									<p className='text-muted-foreground mb-4'>
										Complete your profile setup to see relevant exercises
									</p>
									<Button
										onClick={() => router.push('/careers/add')}
										className='bg-primary hover:bg-primary/90'>
										Add Career Profile
									</Button>
								</CardContent>
							</Card>
						) : (
							<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
								{exercisesByLevel.map((levelData, levelIndex) => {
									const levelSummary =
										attemptSummary?.levels[String(levelData.levelNumber)];
									const buttonText = getButtonText(levelSummary);
									const isPassed = levelSummary?.passed;
									const isAttempted = levelSummary?.attempted;

									return (
										<ScrollReveal
											key={levelData.level}
											delay={levelIndex * 0.1}>
											<Card
												className={`h-full flex flex-col hover:shadow-xl transition-all duration-300 border-2 bg-white group ${
													isPassed
														? 'border-emerald-200 hover:border-emerald-300'
														: isAttempted
														? 'border-amber-200 hover:border-amber-300'
														: 'border-transparent hover:border-primary/20'
												}`}>
												<CardHeader className='flex-1 pb-3'>
													<div className='flex items-start justify-between gap-2 mb-3'>
														<Badge
															className={`${getLevelColor(
																levelData.level
															)} text-sm font-semibold`}>
															{levelData.level} (Level {levelData.levelNumber})
														</Badge>
														<LevelStatusBadge levelSummary={levelSummary} />
													</div>
													<CardTitle className='text-lg mb-2 group-hover:text-primary transition-colors'>
														{levelData.level} Assessment
													</CardTitle>
													<CardDescription className='text-sm'>
														{levelData.questionCount} questions •{' '}
														{levelData.totalDuration} mins
													</CardDescription>

													{/* Attempt Summary Info */}
													{summaryLoading ? (
														<div className='mt-3 space-y-2'>
															<Skeleton className='h-4 w-3/4' />
															<Skeleton className='h-4 w-1/2' />
														</div>
													) : isAttempted && levelSummary ? (
														<div className='mt-3 pt-3 border-t border-border/50 space-y-1.5 text-sm'>
															<div className='flex items-center justify-between text-muted-foreground'>
																<span>Best Score:</span>
																<span
																	className={`font-semibold ${
																		isPassed
																			? 'text-emerald-600'
																			: 'text-amber-600'
																	}`}>
																	{levelSummary.bestScore}%
																</span>
															</div>
															<div className='flex items-center justify-between text-muted-foreground'>
																<span>Attempts:</span>
																<span>{levelSummary.attemptCount}</span>
															</div>
															{levelSummary.lastAttemptAt && (
																<div className='flex items-center gap-1 text-muted-foreground'>
																	<Clock className='h-3 w-3' />
																	<span className='text-xs'>
																		Last taken:{' '}
																		{formatRelativeTime(
																			levelSummary.lastAttemptAt
																		)}
																	</span>
																</div>
															)}
															{!isPassed && (
																<div className='text-xs text-amber-600 mt-1'>
																	70% required to pass
																</div>
															)}
														</div>
													) : (
														<div className='mt-3 pt-3 border-t border-border/50 text-sm text-muted-foreground'>
															Not yet attempted
														</div>
													)}
												</CardHeader>
												<CardContent className='pt-0'>
													<Button
														className={`w-full gap-1 shadow-md hover:shadow-lg transition-all ${
															isPassed
																? 'bg-emerald-600 hover:bg-emerald-700 text-white'
																: isAttempted
																? 'bg-amber-600 hover:bg-amber-700 text-white'
																: 'bg-primary hover:bg-primary/90 text-white'
														}`}
														onClick={() => {
															router.push(
																`/tests/${
																	levelData.specialisation
																}/${levelData.level.toLowerCase()}`
															);
														}}>
														{buttonText} <ChevronRight className='h-4 w-4' />
													</Button>
												</CardContent>
											</Card>
										</ScrollReveal>
									);
								})}
							</div>
						)}
					</div>
				</main>
			</div>
		</div>
	);
}
