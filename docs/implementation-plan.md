# Implementation Plan — fwr-frontend (ReadinessAI)

## Session Handoff
<!-- Read this block first, via a targeted/line-limited read, before the rest of the
     file. Overwrite in place each update — this is not a changelog. Keep it to these
     five lines; anything durable belongs in decisions.md, architecture.md, or a
     phase's own Summary/Follow-ups instead. See implementation-lifecycle.md. -->
_Last updated: 2026-11-13_
Current phase: Phase 10 — Stabilisation (not started). Phase 9 dependency upgrade done 2026-11-13, uncommitted at time of writing.
Next objective: Commit Phase 9; click through the app against a running backend; then Phase 10 item 1 (unanswered questions submitted as "A").
Blockers: None. (Deployed on Vercel; production branch and backend URL still unrecorded in docs/workflow.md.)
Not yet migrated: None — Claude docs bootstrapped from code + git history on 2026-11-13 (no Cursor rules existed). README.md is still create-next-app boilerplate; replace with a pointer to docs/ once docs are confirmed.

## Phase 1 — Vite JS prototype
Status: done (superseded)
Summary: 2025-10-10 → 2025-11-23. Plain-JSX Vite app with landing, onboarding, dashboard, goals/self-reflection, feedback, sectors and quizzes wired to the backend. Authored by earlier contributors; branch `origin/Hiba_frontend`.
Key files: (deleted) `pages/*.jsx`
Assumptions: —
Follow-ups: —

## Phase 2 — Docker + TypeScript conversion
Status: done (superseded)
Summary: 2025-11-25 → 2025-11-27. Dev Docker setup, JS → TSX conversion, build/API-base-URL/deployment fixes (PRs #1–#5).
Key files: (deleted) Dockerfile, docker-compose.yml, `src/`
Assumptions: —
Follow-ups: —

## Phase 3 — Vite/TS UI refresh
Status: done (superseded)
Summary: 2025-11-30. framer-motion, toasts, sector/goals/benchmarking/results pages (PRs #6–#15).
Key files: (deleted)
Assumptions: —
Follow-ups: —

## Phase 4 — Next.js migration
Status: done
Summary: 2025-12-31. Backed up the Vite app (`6b6bbe0`) and replaced it with a fresh Next.js App Router app (`5629115`, PR #16). See decisions.md.
Key files: `app/layout.tsx`, `package.json`, `next.config.ts`, `tsconfig.json`
Assumptions: Migration plan in `../skyblue-nectar-haven-1237efe5-main/MIGRATION_PROMPT.md`.
Follow-ups: Middleware-based protection from that plan was never implemented.

## Phase 5 — Design system + Lovable UI port
Status: done
Summary: 2026-01-02. UKBAA-inspired blue/orange tokens, fonts and animations (`3d3a96b`); 69 files ported from the Lovable app with mock hooks (`28f8fce`).
Key files: `app/globals.css`, `components/ui/*`, `components/{landing,dashboard,onboarding}/*`, `app/(protected)/*`, `stores/*`, `lib/validations/*`
Assumptions: —
Follow-ups: Many ported ui primitives and validations remain unused (see project-structure.md).

## Phase 6 — Real backend integration
Status: done
Summary: 2026-01-03 → 2026-01-05. Replaced mocks with the axios client, TanStack Query hooks and key factory; auth, careers + Zustand sync, quizzes, soft skills, benchmarks; removed leadership score from frontend types (PRs #17–#19).
Key files: `lib/api/client.ts`, `lib/api/types.ts`, `lib/query/*`, `lib/auth/events.ts`, `hooks/api/*`, `components/providers/*`
Assumptions: Backend scoring is authoritative (see `.claude/skills/fwr-scoring-model`).
Follow-ups: `useAssessments.ts` deprecated stubs; unused activity and save-progress hooks; duplicated types and key factories.

## Phase 7 — Polish + account features
Status: done
Summary: 2026-01-05 → 2026-01-07. Mobile responsiveness, privacy/terms pages, footer, quiz feedback modal, dashboard nav, forgot/reset password (PRs #20–#27).
Key files: `app/privacy`, `app/terms`, `components/feedback/FeedbackModal.tsx`, `hooks/api/useFeedback.ts`, `components/dashboard/DashboardNav.tsx`, `app/forgot-password`, `app/reset-password`
Assumptions: —
Follow-ups: Social login buttons only show a "not configured" toast.

## Phase 8 — Claude Code bootstrap
Status: done
Summary: 2026-11-13. Moved the project from Cursor to Claude Code: CLAUDE.md, docs/*, repo-local skills reconstructed from code + git history (no Cursor rules existed). Added Vercel + Next DevTools MCP servers and a per-session dependency check.
Key files: `CLAUDE.md`, `docs/*`, `.claude/skills/*`, `.mcp.json`
Assumptions: Decision rationales marked "not recorded" where no evidence exists.
Follow-ups: Record Vercel production branch + backend URL in docs/workflow.md; replace README.md.

## Phase 9 — Dependency & security upgrade (in-major)
Status: done (pending a browser click-through against a running backend)
Summary: 2026-11-13. Prod audit 10 vulns (1 critical, 7 high) → 0. next 16.1.1 → 16.4.6, react/react-dom 19.2.3 → 19.3.1, axios → 1.21.0, zod → 4.6.7, tanstack query → 5.105.0, tailwind → 4.3.3, zustand → 5.0.16, everything else `npm update` within range. Removed 8 unused deps (recharts, date-fns, embla-carousel-react, input-otp, react-day-picker, react-resizable-panels, tailwindcss-animate, @hookform/resolvers). Verified: tsc clean, build passes, lint 37 errors / 51 warnings (was 40/48 — the +3 warnings are a new Next 16.4 rule, `no-location-assign-relative-destination`, on the deliberate hard reloads in `app/error.tsx:60` and `components/ui/error-boundary.tsx:70,176`), all routes 200 in `next dev` (backend down, so client-side data flows untested).
Key files: `package.json`, `package-lock.json`, `AGENTS.md` (generated by `next dev` 16.4 — commit it or it reappears)
Assumptions: next 16.4.6 taken under the security exception (<14 days old). Seven packages pinned back to the newest ≥14-day release instead of what `npm update` took (axios, zustand, tailwindcss, @tailwindcss/postcss, @tanstack/react-query(-devtools), react-hook-form). `@types/node` held at 20 — Vercel's Node version unconfirmed (Vercel MCP needs team-scope authorization). `npm install pkg@x` writes carets; exact pins on next/react/react-dom/eslint-config-next were restored by hand — keep doing that.
Follow-ups: 8 moderate dev-only advisories remain (minimatch via typescript-eslint ≤8.72.2 via eslint-config-next) — no in-range fix yet; re-check next session. Upgrading `react-hook-form`/`@radix-ui/react-toast` was in-range only; both are candidates for removal (Phase 10 for the dead toast stack). npm 11 hit ENOENT on `@tailwindcss/oxide-wasm32-wasi` when changing tailwind versions in place; `rm -rf node_modules` then reinstall fixed it.
Majors deliberately held — each its own later phase, if wanted: typescript 5.9 → 7, eslint 9 → 10 (check eslint-config-next support), framer-motion 12 → 14, lucide-react 0.562 → 1.x (icon renames), @types/node 20 → match Vercel's Node. Unused deps (recharts, date-fns, embla-carousel-react, input-otp, react-day-picker, react-resizable-panels, tailwindcss-animate) should be removed, not upgraded.

## Phase 10 — Stabilisation
Status: not started
Summary: Fix known functional bugs found during the 2026-11-13 audit, then bring lint to zero errors.
Key files: see list
Assumptions: Bugs below were found by code reading; the first three are confirmed by direct inspection.
Follow-ups (bug list, priority order):
1. Unanswered questions submitted as `"A"` — `app/(protected)/tests/[specialisation]/[level]/page.tsx:129`, `app/(protected)/soft-skills/page.tsx:135`. Changes scores.
2. Readiness ceiling: with one quiz per level, technical maxes at 26.5 and readiness ≈ 41 (backend `quizzes/service.py`). Confirm with backend owner.
3. Dashboard empty state pushes `/add-career`; real route is `/careers/add` — `app/(protected)/dashboard/page.tsx:94`.
4. Goal progress edits lost: `goals/page.tsx:94` PATCHes `/goals/{id}` but backend recomputes progress — use `useUpdateGoalProgress`.
5. `useCareerStore.setCareers` resets `currentCareer` to primary on every refetch (`stores/useCareerStore.ts:63`).
6. `useGoalsQuery(careerId)` omits `careerId` from the query key (`hooks/api/useGoals.ts:105`).
7. `returnUrl` set by `AuthGuard` is ignored by `/auth`.
8. Double error toasts (quiz hooks + page catch blocks); timer auto-submit calls `handleSubmit` inside a setState updater (`tests/.../page.tsx:73`).
9. Soft-skills feedback can send `attempt_id: ''`; `[Feedback Debug]` console.logs in `tests/.../results/page.tsx:524-529`.
10. Results stats ("Passed / Avg / Pass rate") computed from the current page only (`results/page.tsx:109`).
11. Password minimum is 6 chars (`lib/validations/auth.ts`).
12. Lint: 37 errors / 51 warnings (post-Phase 9).

<!-- Candidate later phases (not yet scheduled): dead-code & dependency cleanup; consolidate
     protected-path list and auth storage; tests + CI; middleware/cookie auth; quiz save/resume. -->
