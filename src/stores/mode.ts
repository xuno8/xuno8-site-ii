import { atom } from 'nanostores';
import type { Mode } from '@/types';

function getInitialMode(): Mode {
  if (typeof window !== 'undefined') {
    const stored = window.__INITIAL_MODE__;
    if (stored === 'developer' || stored === 'photographer') return stored;
    try {
      const ls = localStorage.getItem('portfolio-mode');
      if (ls === 'developer' || ls === 'photographer') return ls;
    } catch {
      /* private browsing or storage disabled */
    }
  }
  return 'developer';
}

export const currentMode = atom<Mode>(getInitialMode());

if (typeof window !== 'undefined') {
  currentMode.listen((mode) => {
    try {
      localStorage.setItem('portfolio-mode', mode);
    } catch {
      /* private browsing or storage disabled */
    }

    const favicons = window.__FAVICONS__;
    if (favicons) {
      const link = document.getElementById('favicon') as HTMLLinkElement | null;
      if (link) link.href = favicons[mode] || favicons.developer;
    }

    const titles = window.__TITLES__;
    if (titles) {
      document.title = titles[mode] || titles.developer;
    }
  });
}
