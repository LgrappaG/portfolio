'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
}

export function FadeIn({ children, delay = 0, duration = 0.5 }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration }}
    >
      {children}
    </motion.div>
  );
}

export function SlideUp({ children, delay = 0, duration = 0.5 }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration }}
    >
      {children}
    </motion.div>
  );
}

export function SlideIn({ children, delay = 0, duration = 0.5, direction = 'left' }: FadeInProps & { direction?: 'left' | 'right' }) {
  const x = direction === 'left' ? -30 : 30;
  return (
    <motion.div
      initial={{ opacity: 0, x }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration }}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, delay = 0, duration = 0.5 }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({ children, staggerDelay = 0.1 }: { children: ReactNode[]; staggerDelay?: number }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

interface HoverScaleProps {
  children: ReactNode;
  scale?: number;
}

export function HoverScale({ children, scale = 1.05 }: HoverScaleProps) {
  return (
    <motion.div
      whileHover={{ scale }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
