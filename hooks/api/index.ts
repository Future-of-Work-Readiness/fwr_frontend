/**
 * API Hooks Index
 *
 * Re-export all TanStack Query hooks for API consumption
 */

// ============ AUTH HOOKS ============
export {
  useCurrentUser,
  useIsAuthenticated,
  useLogin,
  useRegister,
  useLogout,
  useForgotPassword,
  useResetPassword,
  useUserFromCache,
  useInvalidateAuth,
  useUpdateUserCache,
} from './useAuth';

// ============ CAREER HOOKS ============
export {
  useCareersQuery,
  useCareerQuery,
  usePrimaryCareerQuery,
  useSyncCareers,
  useCreateCareer,
  useAddCareer,
  useUpdateCareer,
  useSetPrimaryCareer,
  useDeleteCareer,
  useCompleteOnboarding,
  usePrefetchCareer,
  useCareerDashboardQuery,
  useSpecificCareerDashboardQuery,
  type CreateCareerPayload,
  type UpdateCareerPayload,
  type CompleteOnboardingPayload,
  type CareerDashboard,
  type CareerScores,
} from './useCareers';

// ============ GOALS & JOURNAL HOOKS ============
export {
  useGoalsQuery,
  useGoalQuery,
  useCreateGoal,
  useUpdateGoal,
  useDeleteGoal,
  useCompleteGoal,
  useUpdateGoalProgress,
  useJournalEntriesQuery,
  useJournalEntryQuery,
  useCreateJournalEntry,
  useUpdateJournalEntry,
  useDeleteJournalEntry,
  JOURNAL_PROMPTS,
  type CreateGoalPayload,
  type UpdateGoalPayload,
  type CreateJournalEntryPayload,
  type UpdateJournalEntryPayload,
  type GoalWithProgress,
} from './useGoals';

// ============ QUIZ HOOKS (NEW) ============
export {
  // Query hooks
  useQuizzesQuery,
  useQuizzesBySpecializationQuery,
  useQuizDetailQuery,
  useFindQuizQuery,
  useQuizHistoryQuery,
  useQuizHistoryAttemptsQuery,
  useQuizProgressQuery,
  useQuizAttemptSummary,
  // Mutation hooks
  useStartQuiz,
  useSubmitQuiz,
  useSaveQuizProgress,
  // Query keys
  quizQueryKeys,
  // Types
  type QuizOption,
  type QuizOptionWithAnswer,
  type QuizQuestion,
  type QuizSummary,
  type QuizDetail,
  type QuizStartResponse,
  type QuizAnswer,
  type QuestionResult,
  type ReadinessSnapshot,
  type QuizFeedback,
  type ScoreImpact,
  type UpdatedGoal,
  type QuizSubmitResponse,
  type QuizAttemptHistory,
  type QuizAttemptHistoryBackend,
  type QuizHistoryResponse,
  type QuizHistoryResponseBackend,
  type QuizHistoryFilters,
  type QuizProgress,
  type QuizProgressSave,
  type LevelAttemptSummary,
  type QuizAttemptSummaryResponse,
  // Legacy compatibility exports
  useAssessmentResults,
  useTestResults,
  useAllAssessmentResults,
  type AssessmentResult,
  type TestResult,
} from './useQuizzes';

// ============ ACTIVITY FEED HOOKS ============
export {
  useActivityFeedQuery,
  useRecentActivitiesQuery,
  useActivityStatsQuery,
  activityQueryKeys,
  getActivityIcon,
  getActivityColor,
  type Activity,
  type ActivityType,
  type ActivityListResponse,
  type ActivityStats,
  type ActivityFilters,
} from './useActivity';

// ============ BENCHMARK HOOKS ============
export {
  usePeerBenchmarkQuery,
  getPeerAverageFromBenchmark,
  getPercentileFromBenchmark,
  benchmarkQueryKeys,
  type PeerComparison,
  type CommonStrength,
  type CommonGap,
  type PeerBenchmarkData,
  type PeerBenchmarkResponse,
} from './useBenchmarks';

// ============ SECTOR HOOKS ============
export {
  useSectorsQuery,
  useSectorsHierarchyQuery,
  useSectorQuery,
  useBranchesQuery,
  useSectorHierarchyQuery,
  useSpecializationsQuery,
  formatSpecializationName,
  formatName,
  getSectorIcon,
  SECTOR_ICONS,
  type Sector,
  type Branch,
  type Specialization,
  type SpecializationInHierarchy,
  type BranchInHierarchy,
  type SectorHierarchy,
} from './useSectors';

// ============ LEGACY ASSESSMENT HOOKS (DEPRECATED) ============
// These are re-exported for backward compatibility but should be migrated to useQuizzes
export {
  useAssessmentResultsByCareer,
  useAssessmentQuestions,
  useStartAssessment,
  useSubmitTestResult,
  useSubmitAssessmentAnswers,
  type SubmitTestResultPayload,
  type StartAssessmentPayload,
} from './useAssessments';
