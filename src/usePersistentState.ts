import { useEffect, useState } from 'react';

// useState that survives reloads via localStorage. Storage can be unavailable (private windows), so every access is guarded.
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        // Merge onto the default for object state so newly added fields get their defaults.
        return initial && typeof initial === 'object' && !Array.isArray(initial) ? { ...initial, ...parsed } : parsed;
      }
    } catch {}
    return initial;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);

  return [value, setValue] as const;
}
