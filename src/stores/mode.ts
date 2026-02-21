import { atom } from 'nanostores';
import type { Mode } from '@/types';

function getInitialMode(): Mode {
  if (typeof window !== 'undefined') {
    const stored = (window as unknown as Record<string, unknown>).__INITIAL_MODE__ as string | undefined;
    if (stored === 'developer' || stored === 'photographer') return stored;
    try {
      const ls = localStorage.getItem('portfolio-mode');
      if (ls === 'developer' || ls === 'photographer') return ls;
    } catch { /* private browsing or storage disabled */ }
  }
  return 'developer';
}

export const currentMode = atom<Mode>(getInitialMode());

if (typeof window !== 'undefined') {
  currentMode.listen((mode) => {
    try {
      localStorage.setItem('portfolio-mode', mode);
    } catch { /* private browsing or storage disabled */ }
  });
}
