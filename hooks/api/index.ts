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
  useCreateCareer,
  useAddCareer,
  useUpdateCareer,
  useSetPrimaryCareer,
  useDeleteCareer,
  useCompleteOnboarding,
  usePrefetchCareer,
  type CreateCareerPayload,
  type UpdateCareerPayload,
  type CompleteOnboardingPayload,
} from './useCareers';

// ============ GOALS & JOURNAL HOOKS ============
export {
  useGoalsQuery,
  useGoalQuery,
  useCreateGoal,
  useUpdateGoal,
  useDeleteGoal,
  useCompleteGoal,
  useJournalEntriesQuery,
  useJournalEntryQuery,
  useCreateJournalEntry,
  useDeleteJournalEntry,
  JOURNAL_PROMPTS,
  type CreateGoalPayload,
  type UpdateGoalPayload,
  type CreateJournalEntryPayload,
  type GoalWithProgress,
} from './useGoals';

// ============ ASSESSMENT HOOKS ============
export {
  useAssessmentResults,
  useAllAssessmentResults,
  useAssessmentResultsByCareer,
  useTestResults,
  useAssessmentQuestions,
  useStartAssessment,
  useSubmitTestResult,
  useSubmitAssessmentAnswers,
  type AssessmentResult,
  type SubmitTestResultPayload,
  type StartAssessmentPayload,
  type TestResult,
} from './useAssessments';
