'use client';

import { useEffect } from 'react';

export function SmoothScroll({ locked }: { locked: boolean }) {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const getTarget = (hash: string) => document.querySelector<HTMLElement>(hash);
    const getOffset = () => {
      const header = document.querySelector<HTMLElement>('.site-header');
      return (header?.offsetHeight ?? 72) + 18;
    };

    const scrollToHash = (hash: string) => {
      const target = getTarget(hash);
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY - getOffset();
      window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
    };

    const handleAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute('href');
      if (!hash || hash === '#' || !getTarget(hash)) return;

      event.preventDefault();
      history.pushState(null, '', hash);
      scrollToHash(hash);
    };

    const handleShopNavigate = (event: Event) => {
      const hash = (event as CustomEvent<string>).detail;
      if (!hash || !getTarget(hash)) return;
      history.pushState(null, '', hash);
      scrollToHash(hash);
    };

    document.addEventListener('click', handleAnchorClick);
    window.addEventListener('shop:navigate', handleShopNavigate);
    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('shop:navigate', handleShopNavigate);
    };
  }, []);

  void locked;
  return null;
}
