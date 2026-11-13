---
name: fwr-quiz-flow
description: The FWR test-taking flow — levels, URL scheme, find/start/submit sequence, results hand-off, feedback, cache invalidation. Use when adding or changing an assessment type or level, the technical-skills or soft-skills pages, the test or results pages, the timer, or quiz feedback in fwr-frontend.
---

# FWR quiz flow

## Levels and URLs
- `lib/constants/skillLevels.ts` `SKILL_LEVELS`: Beginner, Intermediate, Proficient, Master, Expert
  = `difficulty_level` 1–5. Levels are **not** locked; all five are always available.
- Route: `/tests/{specialisation}/{level}` where specialisation is the lowercased, hyphenated
  spec name and level is the lowercased level name. The page maps back with
  `toUpperCase().replace(/-/g, '_')` and `getLevelNumber`.
- Users only see quizzes for their own specialisation (`specialization_id`). Don't add a manual
  specialisation filter — it was removed on purpose.

## Sequence (`hooks/api/useQuizzes.ts`)
1. `/technical-skills` calls `useQuizAttemptSummary` (`GET /quizzes/attempts/summary`) to choose
   button text per level: "Start Test" / "Retake Test" (attempted, not passed) /
   "Practice Again" (passed).
2. Test page: `useFindQuizQuery(spec, level)` → `GET /quizzes/find`.
3. `useStartQuiz` → `POST /quizzes/{id}/start` returns the attempt + questions.
4. Client countdown from `time_limit_minutes`; auto-submits at 0.
5. `useSubmitQuiz` → `POST /quizzes/attempts/{id}/submit` with
   `answers: [{question_id, selected_key}]`.
6. The response (`QuizSubmitResponse`: `readiness`, `score_impact`, `updated_goals`,
   `question_results`) **plus `attempt_id` and `quiz_id`** is written to
   `sessionStorage.quizResult`, then the page routes to `…/results`, which reads it once.
7. On success the hook invalidates quiz history, `careers.all` and `careers.dashboard()`.
   Any new score-affecting mutation must do the same.
8. Results page shows "next level" only if passed, and offers `FeedbackModal` once per view.

## Soft skills
A single quiz: `useFindQuizQuery("SOFT_SKILLS", 1)` on `/soft-skills`, same start/submit flow,
results at `/soft-skills/results`. The backend treats any specialisation containing "SOFT" as
soft skills. The skill-areas list on the page is hardcoded.

## Feedback (`components/feedback/FeedbackModal.tsx`, `hooks/api/useFeedback.ts`)
1–5 stars + ≥10 chars. `POST /quiz-feedback/` with `{attempt_id, rating, feedback_text,
quiz_id, quiz_title, difficulty_level, category, specialization_name}`. `useFeedbackCheck`
(`GET /quiz-feedback/check/{attemptId}`) exists but is unused.

## Checklist: adding a new assessment type or quiz page
- [ ] Backend quiz exists and is findable via `/quizzes/find` (specialisation + level).
- [ ] Page under `app/(protected)/…` plus a results page reading `sessionStorage.quizResult`.
- [ ] Sidebar-hiding rule in `components/dashboard/DashboardNav.tsx` (~line 35: hides on
      `/technical-skills`, `/soft-skills` and `/tests/*` except results).
- [ ] Protected-path lists: `lib/api/client.ts` and two in `components/providers/AuthGuard.tsx`.
- [ ] Invalidate history + careers + dashboard after submit.
- [ ] Pass `attempt_id`/`quiz_id` through to feedback.

## Known issues (Phase 9 in docs/implementation-plan.md)
- Unanswered questions are submitted as `"A"` (test page ~129, soft-skills ~135). Don't copy.
- Timer auto-submit calls `handleSubmit` inside a setState updater (test page ~73).
- Errors toast twice (hook + page catch).
- `useSaveQuizProgress` / `useQuizProgressQuery` (save/resume) exist but aren't wired.
- `hooks/api/useAssessments.ts` is deprecated — use `useQuizzes.ts`.
