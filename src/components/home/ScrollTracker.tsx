'use client';

import { useEffect, useRef } from 'react';
import { trackScroll50 } from '@/lib/analytics';

export default function ScrollTracker() {
  const fired = useRef(false);

  useEffect(() => {
    const handler = () => {
      if (fired.current) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0 && scrollTop / docHeight >= 0.5) {
        fired.current = true;
        trackScroll50();
        window.removeEventListener('scroll', handler);
      }
    };

    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return null;
}
