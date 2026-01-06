'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import ScrollReveal from '@/components/ui/scroll-reveal';
import {
	CheckCircle2,
	XCircle,
	ArrowLeft,
	Home,
	RefreshCcw,
	Trophy,
	Target,
	Clock,
	BarChart3,
	BookOpen,
	TrendingUp,
	Loader2
} from 'lucide-react';
import type { QuizSubmitResponse, QuestionResult } from '@/hooks';

interface StoredQuizResult extends QuizSubmitResponse {
	level: string;
	specialisation: string;
	timeTaken: number;
}

export default function SoftSkillsResultsPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [quizResult, setQuizResult] = useState<StoredQuizResult | null>(null);

	// Use ref to prevent double-processing in React Strict Mode
	const hasProcessedRef = useRef(false);

	useEffect(() => {
		// Prevent double-processing due to React Strict Mode
		if (hasProcessedRef.current) {
			return;
		}

		const storedData = sessionStorage.getItem('quizResult');
		if (storedData) {
			hasProcessedRef.current = true;
			const data = JSON.parse(storedData) as StoredQuizResult;
			setQuizResult(data);
			setLoading(false);
			// Clear session storage after reading
			sessionStorage.removeItem('quizResult');
		} else if (!hasProcessedRef.current) {
			// Only redirect if we haven't processed data and there's nothing in storage
			// Use a small delay to ensure we're not in the middle of a Strict Mode remount
			const timeoutId = setTimeout(() => {
				if (!hasProcessedRef.current) {
					router.push('/soft-skills');
				}
			}, 100);
			return () => clearTimeout(timeoutId);
		}
	}, [router]);

	if (loading || !quizResult) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<Loader2 className='h-8 w-8 animate-spin text-primary' />
			</div>
		);
	}

	const {
		percentage,
		passed,
		correct_count,
		total_count,
		question_results,
		readiness,
		feedback,
		quiz_title,
		passing_score,
		timeTaken
	} = quizResult;

	const score = Math.round(percentage);

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}m ${secs}s`;
	};

	const getScoreColor = (score: number) => {
		if (score >= 80) return 'text-green-600';
		if (score >= 70) return 'text-primary';
		if (score >= 50) return 'text-orange';
		return 'text-destructive';
	};

	const getScoreMessage = (score: number) => {
		if (score >= 90)
			return 'Exceptional! You demonstrate outstanding soft skills.';
		if (score >= 80)
			return 'Excellent! You have strong interpersonal abilities.';
		if (score >= 70) return "Good job! You've passed with solid skills.";
		if (score >= 50) return 'Keep practicing. Focus on areas for improvement.';
		return 'More work needed. Review the skills and try again.';
	};

	const getRecommendations = () => {
		// Use backend feedback if available
		if (feedback?.recommendations && feedback.recommendations.length > 0) {
			return feedback.recommendations;
		}

		// Fallback recommendations based on score
		if (score < 70) {
			return [
				'Review communication and active listening techniques',
				'Practice conflict resolution scenarios',
				'Focus on team collaboration exercises'
			];
		} else if (score < 85) {
			return [
				'Continue developing your leadership capabilities',
				'Explore advanced time management techniques',
				'Practice giving and receiving constructive feedback'
			];
		} else {
			return [
				'Consider mentoring others in soft skills development',
				'Focus on advanced leadership and strategic thinking',
				'Share your expertise with team members'
			];
		}
	};

	return (
		<div className='min-h-screen bg-background overflow-x-hidden'>
			<div className='max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 lg:py-8'>
				<ScrollReveal>
					<div className='text-center mb-6 sm:mb-8'>
						<div
							className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-4 ${
								passed ? 'bg-green-100' : 'bg-destructive/10'
							}`}>
							{passed ? (
								<CheckCircle2 className='h-8 w-8 sm:h-10 sm:w-10 text-green-600' />
							) : (
								<XCircle className='h-8 w-8 sm:h-10 sm:w-10 text-destructive' />
							)}
						</div>
						<h1 className='text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-2'>
							{passed ? 'Congratulations!' : 'Keep Practicing!'}
						</h1>
						<p className='text-muted-foreground text-sm sm:text-lg px-2'>
							{feedback?.overall || getScoreMessage(score)}
						</p>
					</div>
				</ScrollReveal>

				<ScrollReveal delay={0.1}>
					<Card className='mb-6'>
						<CardHeader className='px-3 sm:px-6'>
							<CardTitle className='flex items-center gap-2 text-base sm:text-lg'>
								<Trophy className='h-5 w-5 text-primary shrink-0' />
								Your Results
							</CardTitle>
						</CardHeader>
						<CardContent className='px-3 sm:px-6'>
							<div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6'>
								<div className='text-center p-4 sm:p-6 bg-muted/50 rounded-xl'>
									<p className='text-xs sm:text-sm text-muted-foreground mb-2'>
										Overall Score
									</p>
									<p className={`text-4xl sm:text-5xl font-bold ${getScoreColor(score)}`}>
										{score}%
									</p>
									<Badge
										variant={passed ? 'default' : 'destructive'}
										className='mt-2 text-xs'>
										{passed ? 'PASSED' : 'NOT PASSED'}
									</Badge>
								</div>
								<div className='text-center p-4 sm:p-6 bg-muted/50 rounded-xl'>
									<p className='text-xs sm:text-sm text-muted-foreground mb-2'>
										Time Taken
									</p>
									<div className='flex items-center justify-center gap-2'>
										<Clock className='h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0' />
										<p className='text-2xl sm:text-3xl font-bold'>
											{formatTime(timeTaken)}
										</p>
									</div>
								</div>
								<div className='text-center p-4 sm:p-6 bg-muted/50 rounded-xl'>
									<p className='text-xs sm:text-sm text-muted-foreground mb-2'>
										Questions
									</p>
									<div className='flex items-center justify-center gap-2'>
										<Target className='h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0' />
										<p className='text-2xl sm:text-3xl font-bold'>
											{correct_count}/{total_count}
										</p>
									</div>
									<p className='text-xs text-muted-foreground mt-1'>correct</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</ScrollReveal>

				{/* Readiness Scores */}
				<ScrollReveal delay={0.15}>
					<Card className='mb-6'>
						<CardHeader className='px-3 sm:px-6'>
							<CardTitle className='flex items-center gap-2 text-base sm:text-lg'>
								<BarChart3 className='h-5 w-5 text-primary shrink-0' />
								Readiness Scores
							</CardTitle>
							<CardDescription className='text-xs sm:text-sm'>
								Your updated overall readiness after this assessment
							</CardDescription>
						</CardHeader>
						<CardContent className='px-3 sm:px-6'>
							<div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
								<div>
									<div className='flex justify-between items-center mb-1'>
										<span className='text-xs sm:text-sm font-medium'>Overall</span>
										<span
											className={`text-xs sm:text-sm font-bold ${getScoreColor(
												readiness.overall
											)}`}>
											{Math.round(readiness.overall)}%
										</span>
									</div>
									<Progress value={readiness.overall} className='h-2' />
								</div>
								<div>
									<div className='flex justify-between items-center mb-1'>
										<span className='text-xs sm:text-sm font-medium'>Technical</span>
										<span
											className={`text-xs sm:text-sm font-bold ${getScoreColor(
												readiness.technical
											)}`}>
											{Math.round(readiness.technical)}%
										</span>
									</div>
									<Progress value={readiness.technical} className='h-2' />
								</div>
								<div>
									<div className='flex justify-between items-center mb-1'>
										<span className='text-xs sm:text-sm font-medium'>Soft Skills</span>
										<span
											className={`text-xs sm:text-sm font-bold ${getScoreColor(
												readiness.soft
											)}`}>
											{Math.round(readiness.soft)}%
										</span>
									</div>
									<Progress value={readiness.soft} className='h-2' />
								</div>
							</div>
						</CardContent>
					</Card>
				</ScrollReveal>

				{/* Feedback Section */}
				{/* <ScrollReveal delay={0.2}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Personalised Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedback?.strengths && (
                  <div>
                    <h3 className="font-semibold mb-2">Strengths</h3>
                    <p className="text-muted-foreground">{feedback.strengths}</p>
                  </div>
                )}
                {feedback?.weaknesses && (
                  <div>
                    <h3 className="font-semibold mb-2">Areas for Improvement</h3>
                    <p className="text-muted-foreground">{feedback.weaknesses}</p>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold mb-2">Recommendations</h3>
                  <ul className="space-y-2">
                    {getRecommendations().map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-primary">•</span>
                        <span>{rec}</span>
                    </li>
                    ))}
              </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal> */}

				{/* Question Review */}
				{question_results && question_results.length > 0 && (
					<ScrollReveal delay={0.25}>
						<Card className='mb-6 overflow-hidden'>
							<CardHeader className='px-3 sm:px-6'>
								<CardTitle className='flex items-center gap-2 text-base sm:text-lg'>
									<BookOpen className='h-5 w-5 text-primary shrink-0' />
									Question Review
								</CardTitle>
								<CardDescription className='text-xs sm:text-sm'>
									Review each question, your answer, and the correct answer
								</CardDescription>
							</CardHeader>
							<CardContent className='px-3 sm:px-6'>
								<div className='space-y-6'>
									{question_results.map(
										(result: QuestionResult, index: number) => (
											<div
												key={result.question_id}
												className='border-b pb-6 last:border-0'>
												<div className='flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3'>
													<h3 className='font-semibold text-base sm:text-lg'>
														Question {index + 1}
													</h3>
													{result.is_correct ? (
														<Badge className='bg-primary/10 text-primary border-primary/20 w-fit text-xs'>
															<CheckCircle2 className='h-3 w-3 mr-1' />
															Correct
														</Badge>
													) : (
														<Badge className='bg-destructive/10 text-destructive border-destructive/20 w-fit text-xs'>
															<XCircle className='h-3 w-3 mr-1' />
															Incorrect
														</Badge>
													)}
												</div>
												<p className='mb-4 text-sm sm:text-base break-words'>{result.question_text}</p>
												<div className='space-y-2 mb-4'>
													{result.options.map((option) => {
														const isUserAnswer =
															option.key === result.user_answer;
														const isCorrectAnswer = option.is_correct;
														return (
															<div
																key={option.key}
																className={`p-2 sm:p-3 rounded-lg border-2 ${
																	isCorrectAnswer
																		? 'border-primary bg-primary/10'
																		: isUserAnswer
																		? 'border-destructive bg-destructive/10'
																		: 'border-border'
																}`}>
																<div className='flex items-start gap-2'>
																	<div className='flex items-center gap-1 shrink-0 pt-0.5'>
																		{isCorrectAnswer && (
																			<CheckCircle2 className='h-4 w-4 text-primary' />
																		)}
																		{isUserAnswer && !isCorrectAnswer && (
																			<XCircle className='h-4 w-4 text-destructive' />
																		)}
																		<span className='font-medium text-sm'>
																			{option.key}.
																		</span>
																	</div>
																	<div className='flex-1 min-w-0'>
																		<span
																			className={`text-sm sm:text-base break-words ${
																				isCorrectAnswer
																					? 'font-semibold text-primary'
																					: isUserAnswer
																					? 'font-semibold text-destructive'
																					: ''
																			}`}>
																			{option.text}
																		</span>
																		{(isCorrectAnswer || (isUserAnswer && !isCorrectAnswer)) && (
																			<div className='mt-1'>
																				{isCorrectAnswer && (
																					<Badge className='bg-primary text-primary-foreground text-[10px] sm:text-xs'>
																						Correct
																					</Badge>
																				)}
																				{isUserAnswer && !isCorrectAnswer && (
																					<Badge className='bg-destructive text-destructive-foreground text-[10px] sm:text-xs'>
																						Your Answer
																					</Badge>
																				)}
																			</div>
																		)}
																	</div>
																</div>
															</div>
														);
													})}
												</div>
												{result.explanation && (
													<div className='bg-primary/10 p-2 sm:p-3 rounded-lg'>
														<p className='text-xs sm:text-sm text-foreground break-words'>
															<strong>Explanation:</strong> {result.explanation}
														</p>
													</div>
												)}
											</div>
										)
									)}
								</div>
							</CardContent>
						</Card>
					</ScrollReveal>
				)}

				<div className='flex flex-col sm:flex-row gap-4 justify-center mt-6'>
					<Button
						variant='outline'
						onClick={() => router.push('/soft-skills')}
						className='gap-2'>
						<RefreshCcw className='h-4 w-4' />
						Retake Assessment
					</Button>
					<Button onClick={() => router.push('/dashboard')} className='gap-2'>
						<Home className='h-4 w-4' />
						Back to Dashboard
					</Button>
				</div>
			</div>
		</div>
	);
}
