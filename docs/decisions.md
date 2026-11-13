# Decisions

<!-- One entry per nontrivial, non-obvious tradeoff — not a changelog of every change.
     Entries below were reconstructed on 2026-11-13 from git history and the planning prompt at
     ../skyblue-nectar-haven-1237efe5-main/MIGRATION_PROMPT.md. "Not recorded" means no evidence
     of the rationale exists — fill it in if known. -->

## 2026-11-13 — GitHub Actions CI with a lint-baseline gate
Context: The only automated check was Vercel's build, which doesn't typecheck separately, lint, or
audit, and doesn't appear under GitHub Actions. Lint had 37 pre-existing errors.
Decision: `.github/workflows/ci.yml` — typecheck + build, a lint job that fails only when errors
exceed a baseline (`LINT_ERROR_BASELINE`), and `npm audit --omit=dev --audit-level=high`. Node 22.
Alternatives considered: plain `npm run lint` in CI; lint as non-blocking (`continue-on-error`);
pinning Node via `engines` in package.json.
Why rejected: plain lint would be red on every run until Phase 10 #12; non-blocking lint lets new
errors in silently. `engines` is also read by Vercel and could change the production build's Node
version — kept CI on 22 (local version) until Vercel's Node version is confirmed.

## 2025-11-27 — Convert the frontend from JavaScript to TypeScript
Context: The Vite React app (Oct–Nov 2025) was plain JSX.
Decision: Convert to TypeScript (commits `e1e57b2`, `798b898`).
Alternatives considered: Not recorded.
Why rejected: Not recorded.

## 2025-12-31 — Replace the Vite SPA with a fresh Next.js App Router app
Context: The Vite app was backed up (`6b6bbe0`) and replaced by a fresh `create-next-app`
(`5629115`), deleting `pages/`, `src/`, Dockerfile, docker-compose.yml, vercel.json and
vite.config.ts. The plan was written as a prompt (`MIGRATION_PROMPT.md`): target Next.js App
Router, keep the UI identical, drop Supabase, talk to the Python/FastAPI backend via
`NEXT_PUBLIC_API_URL`, aim for zero TypeScript errors.
Decision: Next.js App Router as the frontend framework.
Alternatives considered: Staying on Vite (implicit).
Why rejected: Not recorded. Note that the app does not currently use SSR, server components for
data, or middleware — the motivation (SEO/SSR?) is not reflected in the code.

## 2026-01-02 — Use the Lovable-generated app as the UI source
Context: A Lovable project (`../skyblue-nectar-haven-1237efe5-main`: Vite + React Router +
Supabase + shadcn + Tailwind 3) had the target UI across the same 14 routes.
Decision: Port its pages and components into the Next.js app (`28f8fce`), with a "UKBAA-inspired"
blue/orange design system in `app/globals.css` (`3d3a96b`).
Alternatives considered: Not recorded.
Why rejected: Not recorded.

## 2026-01-02 — TanStack Query + Zustand + axios + zod for state, HTTP and validation
Context: The Lovable app used React Context (`useAuth`, `useCareer`) and localStorage/Supabase.
Decision: TanStack Query for server state and caching, Zustand (persisted) to replace Context for
client state, axios as the HTTP layer for the Python backend, zod for validation — as specified
in `MIGRATION_PROMPT.md`.
Alternatives considered: Keeping Context API.
Why rejected: Only "replace Context" is recorded; deeper rationale not recorded. In practice the
auth session ended up in TanStack Query + hand-written localStorage, leaving `useAuthStore` unused.

## 2026-01-03 — Client-side-only route protection
Context: `MIGRATION_PROMPT.md` called for Next.js middleware-based protection.
Decision: Implemented as a client guard (`app/(protected)/layout.tsx` + `AuthGuard` + axios 401
interceptor) with the token in localStorage.
Alternatives considered: `middleware.ts` with cookie-based tokens.
Why rejected: Not recorded. Consequence: protected HTML renders briefly before redirect, and the
token is readable by any script on the page.

## 2025-12-31 — Tailwind CSS v4
Context: Lovable used Tailwind v3; `create-next-app` scaffolded v4 (`@tailwindcss/postcss`,
`@theme` in CSS, no config file).
Decision: Stay on v4 and port tokens into `app/globals.css`.
Alternatives considered: Not recorded.
Why rejected: Not recorded. Side effect: `tailwindcss-animate` (v3 plugin) is installed but not
wired, so shadcn `animate-in`/`fade-in-0` classes are no-ops.

## 2025-12-31 — Deploy on Vercel with no in-repo deploy config
Context: The Vite era had a dev-mode Dockerfile, docker-compose.yml and a vercel.json SPA
rewrite; all were deleted in the Next.js reset.
Decision: Deploy on Vercel via Git integration using Next.js defaults; no Dockerfile or
vercel.json re-added (target confirmed by the owner 2026-11-13).
Alternatives considered: Not recorded.
Why rejected: Not recorded.
