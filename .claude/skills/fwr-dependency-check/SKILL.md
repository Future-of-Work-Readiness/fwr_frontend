---
name: fwr-dependency-check
description: Session-start check for outdated or vulnerable npm dependencies in fwr-frontend, and how to pick the "latest safe" version and propose upgrades (Next.js, React, and everything else). Use at the start of every session in this repo, and whenever upgrading, adding, or auditing a dependency.
---

# Dependency check (every session)

The owner wants to be told, every session, when anything is behind the latest safe version —
from Next.js and React down. **Suggest; never install.** The owner runs the upgrade.

## 1. Check (once per session, at start — keep output out of the conversation)
```bash
npm outdated
npm audit --omit=dev
```
Summarise; don't paste raw output. If nothing is outdated beyond patch level and audit is clean,
say so in one line and move on.

## 2. Choose the "latest safe" version for each package
- Stable releases only — no canary / rc / beta / next tags.
- Prefer a release published **≥14 days ago** (`npm view <pkg> time --json`).
  **Exception:** if `npm audit` reports an advisory affecting the installed version, recommend the
  lowest-risk release that fixes it (usually the newest patch on the current minor/major), even
  if it's newer than 14 days.
- Keep peer groups moving together:
  - `next` + `eslint-config-next` (same version)
  - `react` + `react-dom` + `@types/react` + `@types/react-dom`
  - `tailwindcss` + `@tailwindcss/postcss`
  - `@tanstack/react-query` + `@tanstack/react-query-devtools`
  - `@types/node` major = the Node major Vercel builds with (not the newest)
- `next` and `react`/`react-dom` are **pinned exactly** in package.json, so `npm update` won't move
  them — they need an explicit `npm install pkg@x.y.z`.

## 3. Classify and propose
Output one short table: `package | current | proposed | type | reason`.
- **Security** (audit advisory): recommend now, at the top.
- **Patch/minor**: batch into one `npm install …` / `npm update` command.
- **Major**: never batch. List separately with a link to the migration guide/changelog and
  recommend it as its own phase in `docs/implementation-plan.md` (one major per phase for
  framework-level packages: next, react, typescript, eslint, tailwindcss).
- **Unused dependency** (see `docs/project-structure.md`): recommend removal instead of upgrade.

## 4. After the owner upgrades
Verify: `npx tsc --noEmit`, `npm run lint` (no new errors vs baseline), `npm run build`, and a
`npm run dev` smoke test (next-devtools MCP `get_errors` if available). Record a
`docs/decisions.md` entry only for majors or non-obvious version holds (e.g. "held TypeScript at
5.x because …").

## Don't
- Don't run `npm install`/`npm update`/`npm audit fix` yourself — give the commands.
- Don't run `npm audit fix --force` (it jumps majors outside package.json ranges).
- Don't let a dependency upgrade ride along with feature or bug-fix work in the same commit.
