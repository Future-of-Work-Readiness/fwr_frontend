---
name: fwr-career-onboarding
description: FWR onboarding and multi-career rules — sector → branch → specialisation selection, complete-onboarding payload, redirect gating, primary vs current career, TanStack→Zustand career sync. Use when touching /onboarding, /careers, /careers/add, the dashboard career switcher, or anything reading useCareerStore in fwr-frontend.
---

# FWR onboarding and careers

## Selection chain (`components/onboarding/*`, reused by `/careers/add`)
1. Sectors: `GET /sectors` (`hooks/api/useSectors.ts`). The `cross_functional` sector is filtered
   out in `SectorSelection.tsx` (~51).
2. Branches ("field" in the UI): `GET /sectors/{id}/branches`.
3. Specialisations: `GET /sectors/branches/{id}/specializations`. Names are `UPPER_SNAKE`; selection
   UI displays them via `formatSpecializationName` (`hooks/api/useSectors.ts` ~164); other pages
   use `formatSpecialisation` (`lib/constants/career.ts` ~169) — two formatters, keep in sync.
Sector/branch/spec types are snake_case and live in `useSectors.ts`. The constants in
`lib/constants/career.ts` (`TECHNOLOGY_FIELDS`, `SECTOR_TRACKS`, …) are unused — use the API.

## Onboarding (`app/onboarding/page.tsx`)
- Steps: intro → sector → field → specialisation. Step state is local (lost on reload).
- Choosing a specialisation immediately calls `useCompleteOnboarding` →
  `POST /users/complete-onboarding` with `{specialization_id, sector, field, specialisation}`.
- `onboardingCompleted` is taken from the backend, or derived from
  `preferred_specialization_id != null` (`lib/api/types.ts` ~255).
- The page guards itself (redirects to `/auth` if not logged in).

## Redirect / gating rules
- Login → `/dashboard` if `onboardingCompleted`, else `/onboarding`. Sign-up → `/onboarding`.
- `app/(protected)/layout.tsx` checks authentication only.
- Only `/dashboard` redirects non-onboarded users to `/onboarding`. Other protected pages don't.

## Careers (multi-profile)
- Server: `hooks/api/useCareers.ts` — `useCareersQuery`, `useAddCareer` (`POST /careers`),
  `useSetPrimaryCareer` (`POST /careers/{id}/set-primary`), dashboards:
  `useCareerDashboardQuery` (primary, `GET /careers/dashboard`) vs
  `useSpecificCareerDashboardQuery` (`GET /careers/{id}/dashboard`).
- Client: `stores/useCareerStore.ts` (persisted `fwr-career-storage`) holds `careers` +
  `currentCareer`. `CareerProvider` mounts `useSyncCareers`, which copies the query result into
  the store **only when the user is onboarded**.
- Pages read `useCareerStore` (dashboard, careers, goals, results, technical-skills,
  soft-skills, benchmarking, tests). Only `setCurrentCareer` and the sync setters are used; the
  store's local CRUD actions (`addCareer` with fake `career_<ts>` ids) are dead — always go
  through the API hooks.
- `/careers/add` excludes specialisations the user already has.
- `useDeleteCareer` / `useUpdateCareer` exist but have no UI.

## Pitfalls
- `setCareers` resets `currentCareer` to the primary career on every sync
  (`stores/useCareerStore.ts` ~63), so any refetch (after a quiz, on window focus in prod) drops
  a non-primary selection. Preserve the selection if you touch this.
- The dashboard empty state links to `/add-career`; the real route is `/careers/add`.
- On 401 the API client clears `fwr-career-storage` as well as auth storage.
