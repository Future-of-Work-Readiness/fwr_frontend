# Workflow

## Local development
1. `npm install`
2. Create `.env.local` with `NEXT_PUBLIC_API_URL=<backend base URL including /api/v1>`
   (e.g. `http://localhost:8000/api/v1`). `.env*` is gitignored. The client forces https for any
   non-localhost host.
3. Run the backend (`../FWR_BackEnd`) locally or point at a deployed one.
4. `npm run dev` → http://localhost:3000

Commands:
- `npm run dev` / `npm run build` / `npm run start`
- `npm run lint` — ESLint 9, `eslint-config-next` core-web-vitals + typescript, no custom rules.
  0 errors since 2026-11-13 (Phase 10 #12); 49 warnings (mostly unused vars/imports).
  Exits non-zero on any error.
- `npx tsc --noEmit` — typecheck (no npm script). Baseline: 0 errors.
- No test runner is configured.

React Query devtools are mounted automatically in development.

Claude Code MCP servers (`.mcp.json`, project scope): `vercel` (https://mcp.vercel.com, OAuth —
run `/mcp` once to sign in) and `next-devtools` (`npx next-devtools-mcp@latest`; needs
`npm run dev` running). Dependencies are checked at the start of every Claude session
(`.claude/skills/fwr-dependency-check`).

## Branching & commits
- Day-to-day work is committed directly on `dev`; `dev` is merged to `main` via GitHub PR
  ("Merge pull request #N from Future-of-Work-Readiness/dev"), often one PR per commit or small
  batch. No feature branches in use.
- `origin/Hiba_frontend` is the old JS-era branch (fully contained in `dev`); ignore.
- Local `main` may be stale — compare against `origin/main`.
- Commit messages: conventional prefixes (`feat:`, `fix:`, `chore:`) with a descriptive subject.
- Remote: `git@github.com:Future-of-Work-Readiness/fwr_frontend.git`.

## CI
GitHub Actions, `.github/workflows/ci.yml` (added 2026-11-13). Runs on push to `dev`/`main`, on
PRs into `main`/`dev`, and manually (`workflow_dispatch`). Node 22, `npm ci`. Three jobs:
- **Typecheck & build** — `npx tsc --noEmit`, `npm run build`.
- **Lint** — `npm run lint`; fails on any ESLint error, warnings don't fail it. (Was a
  `LINT_ERROR_BASELINE` gate at 37 errors until Phase 10 #12 brought errors to 0.)
- **Security audit** — `npm audit --omit=dev --audit-level=high`. Can turn red without a code change
  when a new advisory is published; fix with the dependency-check skill.
Vercel's builds are separate (its GitHub App posts deployments/commit statuses; they never appear
under Actions). Still run the checks locally before pushing — CI reports, it doesn't fix.

## Release / deployment
Deployed on **Vercel** via its Git integration (confirmed by the owner 2026-11-13). There is no
`vercel.json`; Vercel's Next.js defaults apply (`npm run build`). `NEXT_PUBLIC_API_URL` must be
set in the Vercel project's environment variables (it's inlined at build time, so changing it
needs a redeploy).
Branches (confirmed by the owner 2026-11-13): **`main` → production**, **`dev` → Vercel preview,
used as staging**.
The Vercel team is on the **Hobby** plan, which cannot deploy from a *private* repo owned by a GitHub
organization ("Cannot deploy from a private GitHub organization repository on the Hobby plan").
The repo was made **public** on 2026-11-13 to keep deploying (history scanned for secrets first —
none found). Don't make it private again without moving Vercel to Pro. Never commit secrets: CI runs
on fork PRs and the code is world-readable. A blocked deploy isn't retried automatically — push a
new commit or redeploy from the Vercel dashboard.

URLs (2026-11-13): production frontend `https://fwr-frontend.vercel.app` → backend
`https://fwr-backend-crhc.onrender.com/api/v1` (Render; read from the production bundle). Staging
preview URLs are per-deployment — see the Vercel bot comment on the PR. Which backend the Preview
environment's `NEXT_PUBLIC_API_URL` points to is not yet recorded.
Merge `dev` → `main` only when CI is green and any backend change the frontend depends on is
already live in production (e.g. nullable `selected_key`, Phase 10).
