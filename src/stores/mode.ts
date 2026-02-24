import { atom } from 'nanostores';
import type { Mode } from '@/types';

export const currentMode = atom<Mode>('developer');

if (typeof window !== 'undefined') {
  currentMode.listen((mode) => {
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
