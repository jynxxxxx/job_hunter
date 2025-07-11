'use client'

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function ScrollToTopOnRouteChange() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // ⬅ Triggers on every route change

  return null;
}