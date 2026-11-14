# Architecture

## Overview
fwr-frontend ("ReadinessAI") is a Next.js 16 App Router app that is client-rendered in
practice: every page except `/` (which assembles client landing sections) is `"use client"`,
with no SSR data fetching, server actions, route handlers or middleware. All data comes from a
separate FastAPI backend (`../FWR_BackEnd`, routes mounted under `/api/v1`) via axios + TanStack
Query in the browser. Scoring and business rules live in the backend; the frontend displays.

## Components
- **Root layout** — `app/layout.tsx` (server). Loads fonts via `next/font/google` (Poppins
  `--font-display`, Inter `--font-sans`, Space Mono `--font-mono`, Lora `--font-serif`) and
  mounts providers outside-in: `ErrorBoundary` → `QueryProvider` (`lib/query/provider.tsx`,
  devtools in dev) → `AuthProvider` (wraps `AuthGuard`) → `CareerProvider` → children + sonner
  `<Toaster richColors position="top-center" />`.
- **API client** — `lib/api/client.ts`. Single axios instance; base URL from
  `NEXT_PUBLIC_API_URL` (fallback `http://localhost:8000/api`, non-localhost forced to https);
  30s timeout; `withCredentials`. Request interceptor reads the bearer token from localStorage
  `fwr-auth-storage`. Response interceptor: `success === false` → `ApiError`; network/timeout →
  status 0; 401 on a protected path (except `/users/me`, `/users/logout`) clears
  `fwr-auth-storage` + `fwr-career-storage` and dispatches `auth:session-expired`; 403 →
  `auth:forbidden`. `api.get/post/put/patch/delete` unwrap a `{data}` envelope. No token refresh.
- **Auth events** — `lib/auth/events.ts`: window `CustomEvent` bus consumed by `AuthGuard`
  (session-expired, forbidden, logout, cross-tab logout via the `auth:logout` storage key).
- **Server state** — `hooks/api/*` (one file per domain) + `lib/query/client.ts` (staleTime 30s,
  gcTime 10m; queries retry ×3 except 401/403; mutations retry ×2 except auth/409; refetch on
  focus in prod only) + `lib/query/keys.ts` (hierarchical key factory).
- **Session** — `components/providers/AuthProvider.tsx` exposes `useAuth()`; the session is the
  `['auth','me']` query, seeded from localStorage `initialData`, refetched on tab visibility.
- **Client state** — `stores/useCareerStore.ts` (Zustand, persisted as `fwr-career-storage`):
  `currentCareer` + `careers`, filled from the API by `useSyncCareers` via `CareerProvider` when
  the user is onboarded. `stores/useAuthStore.ts` exists but is unused (its key is written by
  hand in `hooks/api/useAuth.ts`).
- **Route protection** — `app/(protected)/layout.tsx` redirects unauthenticated users to
  `/auth` and renders `DashboardNav`; `/onboarding` repeats the check itself; only `/dashboard`
  sends non-onboarded users to `/onboarding`.
- **Cross-page hand-off** — `sessionStorage.quizResult` carries the quiz submit response from a
  test page to its results page, which reads it in a `useState` initializer and deletes the key in
  an effect (no data → redirect back to the hub).
- **No SSR of protected content** — `app/(protected)/layout.tsx` renders its spinner until
  `useIsClient()` is true, so server HTML matches the first client render; protected pages only
  ever render in the browser.

## Data flow
1. Page calls a hook from `@/hooks` (e.g. `useFindQuizQuery`).
2. Hook calls `api.get(...)` with a key from `queryKeys`; the interceptor attaches the bearer
   token; the response envelope is unwrapped; snake_case is transformed where the module needs
   it (auth transformers in `lib/api/types.ts`; `transformQuizHistoryItem` in
   `hooks/api/useQuizzes.ts`).
3. Mutations `setQueryData` on detail keys and invalidate list keys. Quiz submit invalidates
   quiz history, `careers.all` and `careers.dashboard()`; login invalidates careers and goals.
4. A 401 tears down local auth state and the `AuthGuard` routes to `/auth?returnUrl=…`
   (`returnUrl` is currently ignored by `/auth`).

Main journey: `/` → `/auth` → `/onboarding` (sector → branch → specialisation, posts
`/users/complete-onboarding`) → `/dashboard` → `/technical-skills` → `/tests/[spec]/[level]` →
`…/results`; also `/soft-skills`, `/results`, `/goals`, `/benchmarking`, `/careers`.
Domain details: `.claude/skills/fwr-quiz-flow`, `fwr-career-onboarding`, `fwr-scoring-model`.

## Backend contract (paths relative to `NEXT_PUBLIC_API_URL`)
- **Users:** `GET /users/me`; `POST /users/login|register|logout|forgot-password|reset-password|complete-onboarding`; `GET /users/{id}/peer-benchmark`
- **Careers:** `GET /careers`, `/careers/primary`, `/careers/dashboard`, `/careers/{id}`, `/careers/{id}/dashboard`; `POST /careers`, `/careers/{id}/set-primary`; `PATCH|DELETE /careers/{id}`
- **Quizzes:** `GET /quizzes[?specialization_id]`, `/quizzes/by-specialization/{id}`, `/quizzes/{id}`, `/quizzes/find`, `/quizzes/history`, `/quizzes/attempts/summary`, `/quizzes/attempts/{id}/progress`; `POST /quizzes/{id}/start`, `/quizzes/attempts/{id}/submit`, `/quizzes/attempts/{id}/save-progress`
- **Sectors:** `GET /sectors`, `/sectors/hierarchy`, `/sectors/{id}`, `/sectors/{id}/branches`, `/sectors/{id}/hierarchy`, `/sectors/branches/{id}/specializations`
- **Goals:** `GET|POST /goals`; `GET|PATCH|DELETE /goals/{id}`; `POST /goals/{id}/complete`; `PATCH /goals/{id}/progress?progress=`
- **Journal:** `GET|POST /journal`; `GET|PATCH|DELETE /journal/{id}`
- **Activity:** `GET /activity`, `/activity/recent`, `/activity/stats` (hooks only, no UI)
- **Feedback:** `POST /quiz-feedback/`; `GET /quiz-feedback/check/{attemptId}`

Backend endpoints not consumed: admin (incl. `/admin/quiz-feedback`), quiz-generator,
`/users/token`, `GET /users/{id}`, `GET /users/{id}/dashboard`,
`PATCH /users/{id}/specialization`, `GET /sectors/branches/{id}`,
`GET /sectors/specializations/{id}`, `PUT /goals/{id}`, `PUT /journal/{id}`,
`/quizzes/attempts/{id}/results`, `/careers/{id}/benchmark`.

## External dependencies
- **FWR FastAPI backend** (`../FWR_BackEnd`) — all data, auth (JWT bearer), scoring, quiz
  content (quiz questions are generated offline with Gemini in the backend/PROMPTGENERATION repos).
- **Google Fonts** — loaded twice (next/font and a CSS `@import` in `globals.css`).
- No analytics, error monitoring (Sentry only mentioned in a comment), or other third parties.
