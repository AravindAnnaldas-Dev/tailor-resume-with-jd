"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Persists a string value to localStorage. Safe to use in Next.js (SSR) —
 * it only touches window/localStorage after mount, and fails silently if
 * storage is unavailable (private browsing, sandboxed contexts, etc).
 */
export function useLocalStorage(key: string, initialValue = "") {
  const [value, setValue] = useState<string>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) setValue(stored);
    } catch {
      // storage unavailable — value stays in memory only for this session
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: string) => {
      setValue(next);
      try {
        window.localStorage.setItem(key, next);
      } catch {
        // storage unavailable — value still updates in memory
      }
    },
    [key],
  );

  return { value, setValue: update, hydrated };
}
