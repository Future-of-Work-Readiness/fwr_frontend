"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * `false` during SSR and the hydration render, `true` afterwards.
 *
 * Use it to keep the first client render identical to the server HTML when the UI depends on
 * browser-only state (localStorage-backed auth, sessionStorage, window). Unlike the
 * `useEffect(() => setMounted(true))` idiom, it doesn't trip `react-hooks/set-state-in-effect`.
 */
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
