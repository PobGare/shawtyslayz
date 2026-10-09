'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

export function Reveal({ children, className, clip = false, delay = 0 }: { children: ReactNode; className?: string; clip?: boolean; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={false}
    whileInView={reduced ? undefined : clip ? { clipPath: ['inset(12% 0 0 0)', 'inset(0% 0 0 0)'], opacity: [0.65, 1] } : { y: [16, 0], opacity: [0.65, 1] }}
    viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}
