# Implementation Plan — fwr-frontend (ReadinessAI)

## Session Handoff
<!-- Read this block first, via a targeted/line-limited read, before the rest of the
     file. Overwrite in place each update — this is not a changelog. Keep it to these
     five lines; anything durable belongs in decisions.md, architecture.md, or a
     phase's own Summary/Follow-ups instead. See implementation-lifecycle.md. -->
_Last updated: 2026-11-13_
Current phase: Phase 10 — Stabilisation (in progress). Phases 9 + 10 bug fixes + CI released to production 2026-11-13 (PR #28, merge b50af6b).
Next objective: Phase 10 complete pending release of #12/#13 (dev → main). Optional follow-up: clear the 49 lint warnings (mostly unused imports/vars).
Blockers: None. `main` has a ruleset ("push-protection") that only org admins can bypass — merge with `gh pr merge N --merge --admin`, or adopt the PR + required-checks ruleset suggested 2026-11-13.
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
Follow-ups: ~~Record Vercel production branch~~ (done 2026-11-13: main → prod, dev → preview/staging); ~~record production/backend URLs~~ (done 2026-11-13); replace README.md.

## Phase 9 — Dependency & security upgrade (in-major)
Status: done (pending a browser click-through against a running backend)
Summary: 2026-11-13. Prod audit 10 vulns (1 critical, 7 high) → 0. next 16.1.1 → 16.4.6, react/react-dom 19.2.3 → 19.3.1, axios → 1.21.0, zod → 4.6.7, tanstack query → 5.105.0, tailwind → 4.3.3, zustand → 5.0.16, everything else `npm update` within range. Removed 8 unused deps (recharts, date-fns, embla-carousel-react, input-otp, react-day-picker, react-resizable-panels, tailwindcss-animate, @hookform/resolvers). Verified: tsc clean, build passes, lint 37 errors / 51 warnings (was 40/48 — the +3 warnings are a new Next 16.4 rule, `no-location-assign-relative-destination`, on the deliberate hard reloads in `app/error.tsx:60` and `components/ui/error-boundary.tsx:70,176`), all routes 200 in `next dev` (backend down, so client-side data flows untested).
Key files: `package.json`, `package-lock.json`, `AGENTS.md` (generated by `next dev` 16.4 — commit it or it reappears)
Assumptions: next 16.4.6 taken under the security exception (<14 days old). Seven packages pinned back to the newest ≥14-day release instead of what `npm update` took (axios, zustand, tailwindcss, @tailwindcss/postcss, @tanstack/react-query(-devtools), react-hook-form). `@types/node` held at 20 — Vercel's Node version unconfirmed (Vercel MCP needs team-scope authorization). `npm install pkg@x` writes carets; exact pins on next/react/react-dom/eslint-config-next were restored by hand — keep doing that.
Follow-ups: 8 moderate dev-only advisories remain (minimatch via typescript-eslint ≤8.72.2 via eslint-config-next) — no in-range fix yet; re-check next session. Upgrading `react-hook-form`/`@radix-ui/react-toast` was in-range only; both are candidates for removal (Phase 10 for the dead toast stack). npm 11 hit ENOENT on `@tailwindcss/oxide-wasm32-wasi` when changing tailwind versions in place; `rm -rf node_modules` then reinstall fixed it.
Majors deliberately held — each its own later phase, if wanted: typescript 5.9 → 7, eslint 9 → 10 (check eslint-config-next support), framer-motion 12 → 14, lucide-react 0.562 → 1.x (icon renames), @types/node 20 → match Vercel's Node. Unused deps (recharts, date-fns, embla-carousel-react, input-otp, react-day-picker, react-resizable-panels, tailwindcss-animate) should be removed, not upgraded.

## Phase 10 — Stabilisation
Status: in progress — items 3–11 done and browser-verified 2026-11-13 against local backend (throwaway user `phase10-test-*@example.com`); tsc clean, build passes, lint 37 E / 49 W. #1, #14 done after backend fixes; #2 resolved by backend formula change. #12, #13 done 2026-11-13.
Summary: Fix known functional bugs found during the 2026-11-13 audit, then bring lint to zero errors.
Key files: see list
Assumptions: Password rule is frontend-only (backend has none): sign-up/reset now ≥8, login only checks presence so existing 6–7 char passwords still work.
Bug list (status):
1. Done — backend fixed scoring (scores over every quiz question; `selected_key` nullable; duplicates/foreign ids ignored; 409 on resubmit). Frontend now sends `null` for unanswered, results show "Not answered", and a 409 on submit shows an info toast and routes to `/results`. Verified: 1/20 answered → 1/20 (was 7/20); soft skills with none answered → 0% (was 5%); forced 409 → one toast + redirect.
2. **Done (backend, live 2026-11-13).** Technical is now a level-weighted %-of-max (perfect run = 100; was capped at 26.5 → readiness 41.2). Stored scores recomputed (~3.77×, rankings unchanged, goals untouched); readiness now 2-dp on submit too. Frontend audit: no change needed — gauge (80/60/40) and results colour bands were built for 0–100; `score_impact.quiz_points` isn't displayed; benchmarking `completedLevels` is computed but never rendered.
14. Done (backend + frontend, local) — `/quizzes/history` (and dashboard recent attempts) now return submitted attempts only; stats endpoint wired. Verified locally: 4 tests / 11% avg overall, technical filter 2 / 20%, matching `/history`.
3. Done — dashboard empty state → `/careers/add`.
4. Done — goals page uses `useUpdateGoalProgress` (`PATCH /goals/{id}/progress`); generic PATCH recomputed progress from current/target value. Progress hook now invalidates the detail query instead of caching the partial response.
5. Done — `setCareers` keeps the selected career (refreshed) if it still exists.
6. Done — `queryKeys.goals.list(userId, careerId?)`; careerId appended so `list(userId)` invalidation still matches.
7. Done — `/auth` honours a validated same-origin `returnUrl`; protected layout now passes the current path.
8. Done — page-level error toasts removed from quiz pages (hooks toast); timer only decrements, a separate once-only effect auto-submits at 0.
9. Done — soft-skills feedback refuses an empty `attempt_id` (modal shows the error); `[Feedback Debug]` logs removed.
10. Done — results stats come from backend `GET /quizzes/history/stats` (`useQuizHistoryStatsQuery`; all submitted attempts, same filters; pass rate = passed/total). Also fixed: rows and average showed raw points (`score`) as "%"; now `percentage`.
11. Done — see Assumptions.
12. **Done 2026-11-13.** 37 → 0 errors (warnings unchanged at 49). Unescaped quotes → `&apos;`/`&quot;` (renders identically); Footer `<a>` → `Link`; empty interfaces → type aliases; 11 set-state-in-effect fixed by deriving (benchmarking selection/loading, dashboard `isNewUser`), event handlers (results filter → page 1, quiz timer init on start, journal entry select), `useState` initializer (results pages' sessionStorage), render-time adjust (auth `?tab=`), `useSyncExternalStore` (`use-mobile`). CI gate replaced by plain `npm run lint`. Browser-verified 2026-11-14 against local backend (throwaway user `phase10b-test-*@example.com`): dashboard Welcome/Welcome Back at the 5-min boundary; benchmarking defaults to primary and keeps a manual pick across refetch; journal select loads each entry; both quiz timers start at the limit, auto-submit once, results render, refresh redirects to the hub; results pass/category filters reset page 2 → 1; next-devtools `get_errors` empty.
13. **Done 2026-11-13.** `hooks/use-is-client.ts` gates `app/(protected)/layout.tsx` to the spinner until hydrated. Verified via next-devtools `get_errors`: mismatch reproduced with the gate removed, none with it.
Verification notes: timer auto-submit tested by speeding up 1 s timeouts in-page (30 min → ~9 s) on both quiz pages — one submit each; with 1/20 answered the technical quiz scored 7/20, a live demonstration of #1. Duplicate-toast fix tested by forcing a start failure: one toast.
