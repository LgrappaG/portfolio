'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Total duration: 2.6s animation + 0.4s fade out = 3s
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Wait for fade out to complete
    }, 2600);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #0a0e27 0%, #1a1a3e 50%, #0f1a3a 100%)',
          }}
        >
          <div className="relative">
            <svg
              width="280"
              height="320"
              viewBox="0 0 280 320"
              className="drop-shadow-2xl"
              style={{
                filter: 'drop-shadow(0 25px 50px rgba(251,146,60,0.2))',
              }}
            >
              <defs>
                <linearGradient id="lGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>

              {/* Vertical part of L - outline with sharp edges */}
              <motion.line
                x1="80"
                y1="260"
                x2="80"
                y2="40"
                stroke="url(#lGradient)"
                strokeWidth="6"
                strokeLinecap="butt"
                strokeLinejoin="miter"
                strokeDasharray="220"
                strokeDashoffset="220"
                initial={{ strokeDashoffset: 220, opacity: 0 }}
                animate={{ strokeDashoffset: 0, opacity: 1 }}
                transition={{
                  strokeDashoffset: { duration: 1.4, ease: 'easeInOut' },
                  opacity: { duration: 0.2 },
                }}
              />

              {/* Horizontal part of L - bottom right, sharp edges */}
              <motion.line
                x1="80"
                y1="260"
                x2="220"
                y2="260"
                stroke="url(#lGradient)"
                strokeWidth="6"
                strokeLinecap="butt"
                strokeLinejoin="miter"
                strokeDasharray="140"
                strokeDashoffset="140"
                initial={{ strokeDashoffset: 140, opacity: 0 }}
                animate={{ strokeDashoffset: 0, opacity: 1 }}
                transition={{
                  delay: 0.3,
                  strokeDashoffset: { duration: 1.2, ease: 'easeInOut' },
                  opacity: { duration: 0.2 },
                }}
              />

              {/* Fill animation - vertical (bottom to top) */}
              <motion.rect
                x="74"
                y="40"
                width="12"
                height="220"
                fill="url(#lGradient)"
                opacity="0.35"
                initial={{ y: 260, height: 0 }}
                animate={{ y: 40, height: 220 }}
                transition={{
                  duration: 1.4,
                  ease: 'easeInOut',
                }}
              />

              {/* Fill animation - horizontal (left to right) */}
              <motion.rect
                x="80"
                y="254"
                width="0"
                height="12"
                fill="url(#lGradient)"
                opacity="0.35"
                initial={{ width: 0 }}
                animate={{ width: 140 }}
                transition={{
                  delay: 0.3,
                  duration: 1.2,
                  ease: 'easeInOut',
                }}
              />

              {/* Glow effect - vertical */}
              <motion.line
                x1="80"
                y1="260"
                x2="80"
                y2="40"
                stroke="rgba(251,146,60,0.4)"
                strokeWidth="14"
                strokeLinecap="butt"
                opacity="0"
                initial={{ strokeDashoffset: 220, opacity: 0 }}
                animate={{
                  strokeDashoffset: [220, 0, 0],
                  opacity: [0, 0.4, 0],
                }}
                transition={{
                  strokeDashoffset: { duration: 1.4, ease: 'easeInOut' },
                  opacity: { duration: 1.4, ease: 'easeInOut' },
                }}
                strokeDasharray="220"
              />

              {/* Glow effect - horizontal */}
              <motion.line
                x1="80"
                y1="260"
                x2="220"
                y2="260"
                stroke="rgba(251,146,60,0.4)"
                strokeWidth="14"
                strokeLinecap="butt"
                opacity="0"
                initial={{ strokeDashoffset: 140, opacity: 0 }}
                animate={{
                  strokeDashoffset: [140, 0, 0],
                  opacity: [0, 0.4, 0],
                }}
                transition={{
                  delay: 0.3,
                  strokeDashoffset: { duration: 1.2, ease: 'easeInOut' },
                  opacity: { duration: 1.2, ease: 'easeInOut' },
                }}
                strokeDasharray="140"
              />
            </svg>

            {/* Loading text with smooth pulse */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9, duration: 0.4, ease: 'easeOut' }}
              className="absolute top-full mt-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
            >
              <motion.span
                className="text-orange-400 text-sm tracking-[0.2em] font-semibold"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                LOADING
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
