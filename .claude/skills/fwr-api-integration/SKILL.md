---
name: fwr-api-integration
description: How to consume a new or changed FWR backend endpoint in fwr-frontend — api client envelope and errors, snake_case/camelCase transforms, query keys, invalidation, auth events and storage keys. Use when adding or modifying a hook in hooks/api, touching lib/api/client.ts, or debugging 401/403/network errors.
---

# FWR API integration

## Steps to add an endpoint hook
1. Confirm the route in `../FWR_BackEnd` (routes mount under `/api/v1`; `NEXT_PUBLIC_API_URL`
   must already include `/api/v1`, so hook paths start at `/users`, `/careers`, …).
2. Add types: backend DTO (snake_case) + transformer in `lib/api/types.ts` if the module returns
   snake_case; domain type in `types/index.ts`. Check first — careers and `/users/me` already
   return camelCase; quiz/sector types are kept snake_case inline in their hooks.
3. Add a key to `lib/query/keys.ts` (`['domain', 'entity', id/filters]`). Include every
   parameter that changes the result in the key (see the `useGoalsQuery(careerId)` bug).
4. Write the hook in `hooks/api/use<Domain>.ts` using `api.get/post/put/patch/delete` from
   `lib/api/client.ts`. Queries end in `Query`; mutations are verbs.
5. Mutations: `setQueryData` on the detail key, invalidate the list key; if the action can
   change scores, invalidate `careers.all` and `careers.dashboard()` too.
6. Toast in **either** the hook or the page, not both. Use `toast` from `sonner`.
7. Export from `hooks/api/index.ts` (and therefore `@/hooks`).

## Client behaviour (`lib/api/client.ts`)
- `api.*` unwraps a `{data}` envelope; body `success === false` throws `ApiError`
  (`lib/api/types.ts`) with `data.error || 'Request failed'`. On HTTP errors the message
  priority is `error` → `message` → `detail` → status default.
- Timeout/network failures → `ApiError` with status 0.
- 401 on a protected path (except `/users/me`, `/users/logout`): clears `fwr-auth-storage` and
  `fwr-career-storage`, dispatches `auth:session-expired` → `AuthGuard` → `/auth?returnUrl=`.
- 403 → `auth:forbidden`. Events are defined in `lib/auth/events.ts`.
- There is no token refresh (`RefreshTokenResponse`/`auth:token-refreshed` are defined but unused).
- Query retries: ×3 except 401/403; mutation retries: ×2 except auth/409 (`lib/query/client.ts`).

## Storage contract
- `fwr-auth-storage` — Zustand-persist format `{state: {user, accessToken, isAuthenticated}}`,
  written by hand in `hooks/api/useAuth.ts` (`saveAuthToStorage`) and read by the client
  interceptor. `stores/useAuthStore.ts` uses the same key but is otherwise unused.
- `fwr-career-storage` — `stores/useCareerStore.ts`.
- `auth:logout` localStorage key — cross-tab logout signal.

## Protected paths
Listed in `lib/api/client.ts` and twice in `components/providers/AuthGuard.tsx`. Keep all three
in sync when adding a protected route.

## Don't
- Don't call axios or `fetch` from pages/components.
- Don't add new per-hook key factories (legacy: `quizQueryKeys`, `activityQueryKeys`,
  `benchmarkQueryKeys`).
- Don't build on `hooks/api/useAssessments.ts` (deprecated, contains fake success responses).
