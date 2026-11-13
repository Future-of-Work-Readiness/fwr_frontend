# fwr-frontend (ReadinessAI)

Next.js frontend for Future of Work Readiness: a career-readiness platform where users pick a
sector → branch → specialisation, take levelled technical and soft-skill quizzes, and track
readiness scores, goals, journal entries and peer benchmarks. The backend is a separate FastAPI
repo (`../FWR_BackEnd`); this repo is UI + API consumption only.

## Stack
Next.js 16.1 (App Router, effectively all client-rendered) · React 19 · TypeScript (strict) ·
Tailwind CSS v4 (tokens in `app/globals.css`, no tailwind.config) · shadcn-style Radix UI in
`components/ui` · TanStack Query v5 (server state) · Zustand v5 (persisted client state) ·
axios · zod · sonner (toasts) · framer-motion.

## Development philosophy
- Docs, not chat history, are the source of truth. `docs/implementation-plan.md` says
  what's done and what's next.
- One implementation phase per session (see `~/.claude/workflows/session-management.md`).
- Reusable procedures are Skills: framework/library patterns in `~/.claude/skills/`
  (global), this project's domain logic in `.claude/skills/` (local to this repo).

## Required reading, in order, at session start
1. This file.
2. `docs/implementation-plan.md`'s Session Handoff block (targeted read of just that
   section) — current phase, next objective, blockers. Reconcile it against the repo
   before trusting it (see `~/.claude/workflows/implementation-lifecycle.md`). Read the
   rest of the file only if the handoff isn't enough to begin.
3. Whichever of these the current phase actually needs: `docs/architecture.md`,
   `docs/decisions.md`, `docs/project-structure.md`, `docs/workflow.md`.
Don't read all four reflexively — read what the phase needs.

## Coding standards
- All backend calls go through a hook in `hooks/api/*` that uses `api` from
  `lib/api/client.ts`. Pages and components never call axios directly.
- Query keys come from `lib/query/keys.ts`. Don't add new per-hook key factories (some
  legacy ones exist — see `docs/project-structure.md`).
- Toasts: `import { toast } from "sonner"` only. The Radix toast stack (`hooks/use-toast`,
  `components/ui/toaster.tsx`) is dead; don't revive it. Don't toast in both a mutation hook
  and the calling page.
- Styling uses the CSS-variable tokens and custom utilities in `app/globals.css`
  (`gradient-hero`, `shadow-glow`, `font-display`, …). No hardcoded hex colors.
- Images via `next/image`; entrance animations via `components/ui/scroll-reveal.tsx`.
- New dependencies or new architectural patterns need an entry in `docs/decisions.md`.

## Session completion checklist
The generic checklist (verify, sync docs, recommend next steps) lives in
`~/.claude/workflows/verification.md` and `~/.claude/workflows/implementation-lifecycle.md`
— not repeated here. Only what's project-specific:
- Tests: none exist yet. Verify UI changes by running `npm run dev` against a backend.
- Typecheck: `npx tsc --noEmit` (clean at baseline — keep it clean).
- Lint: `npm run lint` (baseline 2026-11-13: 40 errors / 48 warnings — don't add new ones).
- Build: `npm run build` before recommending a merge to `main`.

## Project-specific rules
- **Never compute scores in the frontend.** Readiness, technical and soft-skill scores are
  computed by the backend; the UI only displays them. See `.claude/skills/fwr-scoring-model`.
- **Users only see quizzes for their own specialisation.** A manual specialisation filter on
  the test hub was deliberately removed; don't reintroduce it.
- **Protected paths are listed in three places** — `lib/api/client.ts` and twice in
  `components/providers/AuthGuard.tsx`. Adding a protected route means updating all three
  (until they're consolidated).
- **Route protection is client-side only** (`app/(protected)/layout.tsx` + `AuthGuard`). There
  is no `middleware.ts`.
- **localStorage keys `fwr-auth-storage` and `fwr-career-storage` are a contract** between
  `hooks/api/useAuth.ts`, `lib/api/client.ts` and `stores/useCareerStore.ts`. Change all or none.
- **`NEXT_PUBLIC_API_URL` must include the `/api/v1` prefix** — the client's fallback
  (`http://localhost:8000/api`) does not match the backend.
- Forms follow the existing pattern: `useState` per field + `schema.parse()` from
  `lib/validations/*` in try/catch. react-hook-form is installed but unused — adopting it is a
  decision, not a drive-by.
- Backend payloads are snake_case; some modules (careers, `/users/me`) already return camelCase.
  Transform at the hook boundary (see `lib/api/types.ts`), not in components.
- Commit on `dev`, PR `dev` → `main`. Conventional-commit prefixes (`feat:`, `fix:`, `chore:`)
  with a meaningful subject.
