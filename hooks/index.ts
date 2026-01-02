// Re-export all hooks
export { useIsMobile } from "./use-mobile";
export { useToast, toast } from "./use-toast";
export { useLoginMutation, useSignUpMutation, useLogoutMutation } from "./useAuthMutations";
export { useCreateCareerMutation, useCompleteOnboardingMutation, useCareersQuery, useSetPrimaryCareerMutation, useAddCareerMutation } from "./useCareerMutations";
export { useSubmitTestResultMutation, useTestResultsQuery } from "./useTestMutations";
export { 
  useGoalsQuery, 
  useCreateGoalMutation, 
  useUpdateGoalMutation, 
  useDeleteGoalMutation,
  useJournalEntriesQuery,
  useCreateJournalEntryMutation,
  JOURNAL_PROMPTS,
  type Goal,
  type JournalEntry 
} from "./useGoalsMutations";
export { 
  useAssessmentResultsQuery, 
  useAllAssessmentResultsQuery,
  type AssessmentResult 
} from "./useResultsMutations";
