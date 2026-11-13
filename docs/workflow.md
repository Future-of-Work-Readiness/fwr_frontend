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
  Baseline 2026-11-13: 40 errors / 48 warnings (mostly `react/no-unescaped-entities`, React
  Compiler setState-in-effect, unused vars).
- `npx tsc --noEmit` — typecheck (no npm script). Baseline: 0 errors.
- No test runner is configured.

React Query devtools are mounted automatically in development.

## Branching & commits
- Day-to-day work is committed directly on `dev`; `dev` is merged to `main` via GitHub PR
  ("Merge pull request #N from Future-of-Work-Readiness/dev"), often one PR per commit or small
  batch. No feature branches in use.
- `origin/Hiba_frontend` is the old JS-era branch (fully contained in `dev`); ignore.
- Local `main` may be stale — compare against `origin/main`.
- Commit messages: conventional prefixes (`feat:`, `fix:`, `chore:`) with a descriptive subject.
- Remote: `git@github.com:Future-of-Work-Readiness/fwr_frontend.git`.

## CI
None. No `.github/workflows`. Run `npx tsc --noEmit`, `npm run lint` and `npm run build`
locally before opening a dev → main PR.

## Release / deployment
Deployed on **Vercel** via its Git integration (confirmed by the owner 2026-11-13). There is no
`vercel.json`; Vercel's Next.js defaults apply (`npm run build`). `NEXT_PUBLIC_API_URL` must be
set in the Vercel project's environment variables (it's inlined at build time, so changing it
needs a redeploy).
Not yet recorded: which branch is production (presumably `main`, with `dev` as preview) and
the production/backend URLs — fill in when confirmed.
Because there's no CI, Vercel's build is the only automated check on a merge — run
`npx tsc --noEmit` and `npm run build` locally before merging `dev` → `main`.
