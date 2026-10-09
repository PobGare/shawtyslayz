'use client';

import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function ShopOverlay({ children, kind, close }: { children: ReactNode; kind: string; close: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const closeRef = useRef(close);
  const reduced = useReducedMotion();
  const centered = kind === 'search' || kind === 'confirmation';

  useEffect(() => {
    closeRef.current = close;
  }, [close]);

  useLayoutEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    const body = document.body;
    const y = window.scrollY;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    // Freeze the page at exactly the same visual position while an overlay is open.
    // `scrollbar-gutter: stable` in globals.css keeps the viewport width unchanged.
    body.style.position = 'fixed';
    body.style.top = `-${y}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';

    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.left = previous.left;
      body.style.right = previous.right;
      body.style.width = previous.width;
      body.style.overflow = previous.overflow;
      window.scrollTo({ top: y, left: 0, behavior: 'auto' });
      trigger?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const focusFrame = requestAnimationFrame(() => {
      const target = panel.current?.querySelector<HTMLElement>(kind === 'search' ? 'input' : '#dialog-title');
      (target ?? panel.current)?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(focusFrame);
  }, [kind]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRef.current();
        return;
      }

      if (event.key !== 'Tab' || !panel.current) return;

      const focusable = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE))
        .filter(element => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true');

      if (focusable.length === 0) {
        event.preventDefault();
        panel.current.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === panel.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const panelMotion = centered
    ? {
        initial: { opacity: 0, y: reduced ? 0 : 16, scale: reduced ? 1 : 0.985 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: reduced ? 0 : 10, scale: reduced ? 1 : 0.99 },
      }
    : {
        initial: { x: reduced ? 0 : '100%', opacity: reduced ? 0 : 1 },
        animate: { x: 0, opacity: 1 },
        exit: { x: reduced ? 0 : '100%', opacity: reduced ? 0 : 1 },
      };

  return (
    <div className="shop-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <motion.div
        className="dialog-backdrop"
        aria-hidden="true"
        onClick={() => closeRef.current()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduced ? 0 : 0.24, ease: 'easeOut' }}
      />

      <motion.div
        ref={panel}
        data-lenis-prevent
        tabIndex={-1}
        className={`dialog-panel ${centered ? 'centered-panel' : ''} ${kind}-panel`}
        initial={panelMotion.initial}
        animate={panelMotion.animate}
        exit={panelMotion.exit}
        transition={{ duration: reduced ? 0 : 0.36, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="dialog-heading">
          <span className="eyebrow">SHAWTYSLAYZ</span>
          <button className="icon-button" aria-label="Close panel" onClick={() => closeRef.current()}>
            <X size={24} />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}
