# Project Structure

```
app/                      App Router. Root layout (fonts, providers, sonner), globals.css (all design tokens)
  page.tsx                /  — landing, assembles components/landing/*
  auth/                   /auth (?tab=signup) — login + sign-up
  forgot-password/        /forgot-password
  reset-password/         /reset-password?token=
  onboarding/             /onboarding — sector → branch → specialisation (self-guarded)
  privacy/, terms/        static legal pages
  (protected)/            auth-guarded group; layout renders DashboardNav + <main max-w-7xl>
    dashboard/            /dashboard
    careers/ (+ add/)     /careers, /careers/add
    goals/                /goals — goals + journal
    results/              /results — quiz history
    benchmarking/         /benchmarking — peer benchmark
    technical-skills/     /technical-skills — level picker
    tests/[specialisation]/[level]/ (+ results/)   quiz taking + results
    soft-skills/ (+ results/)                       soft-skills quiz + results
components/
  ui/                     ~40 shadcn-style primitives (kebab-case) + donut-chart, scroll-reveal, error-boundary
  landing/                homepage sections, Navbar, Footer
  dashboard/              DashboardNav, ReadinessGauge, QuickAccessCard
  onboarding/             Sector/Field/Specialisation steps (reused by /careers/add)
  feedback/               FeedbackModal
  providers/              AuthProvider (useAuth), AuthGuard, CareerProvider
hooks/
  api/                    TanStack Query hooks per domain (useAuth, useCareers, useQuizzes, useGoals, …)
  index.ts                barrel — import hooks from "@/hooks"
lib/
  api/                    axios client.ts, types.ts (ApiError, backend DTOs + transformers)
  query/                  QueryClient config, key factory (keys.ts), provider
  auth/events.ts          auth CustomEvent bus
  constants/              career.ts, skillLevels.ts (SKILL_LEVELS 1–5)
  validations/            zod schemas (only auth.ts is used)
  utils.ts                cn()
stores/                   Zustand persisted stores (useCareerStore used; useAuthStore unused)
types/index.ts            camelCase domain types (User, CareerProfile, Goal, JournalEntry, …)
providers/index.ts        unused re-export barrel
public/                   hero-bg.jpg; assets/ holds RAI-Logo2*.png. Root SVGs are create-next-app leftovers
docs/                     Claude project docs (this folder)
.claude/skills/           repo-local domain skills
```

## Conventions
- **Naming:** feature components PascalCase files (`HeroSection.tsx`); `components/ui` kebab-case
  (shadcn); API hooks `hooks/api/useX.ts` — queries end in `Query` (`useCareersQuery`), mutations
  are verbs (`useAddCareer`); stores `stores/useXStore.ts` persisted as `fwr-*-storage`; zod
  schemas `xSchema` + `type XSchema = z.infer<…>`. Pages: `export default function XPage`.
- **Imports:** path alias `@/*` → repo root. Pages import `useAuth` from `@/components/providers`,
  hooks from `@/hooks`, `useCareerStore` from `@/stores/useCareerStore`.
- **Where new features go:** route under `app/(protected)/<feature>/page.tsx` (or `app/<feature>`
  if public); keep the page thin and put sections in `components/<feature>/` with an `index.ts`
  barrel (the onboarding/landing pattern). Most existing pages (benchmarking, results, auth,
  tests/results) are 400–550-line monoliths — don't copy that; extract when touching them.
- **Where shared code goes:** UI primitives → `components/ui`; API hooks → `hooks/api` + export
  from `hooks/api/index.ts`; domain types → `types/index.ts`; API DTOs/transformers →
  `lib/api/types.ts`; constants → `lib/constants`.
- **Formatting:** no Prettier/editorconfig. Quote style and indentation vary by file
  (double-quote + spaces is most common) — match the file you're editing.

## Known inconsistencies and dead code (cleanup candidates)
- Types duplicated between `types/index.ts` and `lib/api/types.ts`; quiz/sector types live inline
  in hooks and stay snake_case.
- Per-hook key factories (`quizQueryKeys`, `activityQueryKeys`, `benchmarkQueryKeys` with root
  `'benchmarks'` vs `'benchmarking'` in keys.ts) and an inline `["feedbackCheck", id]`.
- `hooks/api/useAssessments.ts` is deprecated (stubbed/fake success). `useQuizzes.ts:749–783`
  redefines its result hooks and the barrel exports those; the barrel still exports
  `useAssessmentResultsByCareer`, `useAssessmentQuestions`, `useStartAssessment`,
  `useSubmitTestResult`, `useSubmitAssessmentAnswers` from the deprecated file.
- ~37 exported hooks unused (all activity hooks, `useUpdateCareer`, `useDeleteCareer`,
  `useSaveQuizProgress`, `useFeedbackCheck`, …).
- Dead: `stores/useAuthStore.ts`, `providers/index.ts`, `hooks/use-mobile.tsx`, Radix toast stack
  (`hooks/use-toast.ts` still re-exported from `hooks/index.ts` — name clash with sonner `toast`),
  `components/ui/sonner.tsx`, ~23 unused ui primitives, 5 unused validation files, unused
  constants in `lib/constants/career.ts`.
- Unused deps: recharts, date-fns, embla-carousel-react, input-otp, react-day-picker,
  react-resizable-panels, tailwindcss-animate (not wired), several Radix packages.
- `prose` in `app/privacy` has no effect (`@tailwindcss/typography` not installed).
- `.dark` tokens exist but nothing toggles dark mode.
