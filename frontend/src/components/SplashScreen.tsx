'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 400);
    }, 2400);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Refined cubic-bezier easing for premium feel
  const smoothEase = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 25%, #2d1b4e 50%, #1a1f2e 75%, #0f1419 100%)',
          }}
        >
          {/* Animated background grid (subtle) */}
          <div className="absolute inset-0 opacity-5">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="url(#gridGradient)" strokeWidth="0.5" />
                </pattern>
                <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10">
            <svg
              width="300"
              height="340"
              viewBox="0 0 300 340"
              style={{
                filter: 'drop-shadow(0 0 40px rgba(245, 158, 11, 0.15))',
              }}
            >
              <defs>
                {/* Enhanced multi-stop gradient */}
                <linearGradient id="lGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="35%" stopColor="#f59e0b" />
                  <stop offset="70%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>

                {/* Glow filter for premium effect */}
                <filter id="glowFilter">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background glow (subtle pulse behind L) */}
              <motion.circle
                cx="150"
                cy="150"
                r="90"
                fill="none"
                stroke="rgba(245, 158, 11, 0.1)"
                strokeWidth="2"
                animate={{
                  r: [70, 95, 70],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Vertical bar of L with smooth draw */}
              <motion.line
                x1="100"
                y1="280"
                x2="100"
                y2="50"
                stroke="url(#lGradient)"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: { duration: 0.9, ease: smoothEase },
                  opacity: { duration: 0.3, ease: 'easeOut' },
                }}
              />

              {/* Horizontal bar of L with smooth draw */}
              <motion.line
                x1="100"
                y1="280"
                x2="240"
                y2="280"
                stroke="url(#lGradient)"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  delay: 0.25,
                  pathLength: { duration: 0.8, ease: smoothEase },
                  opacity: { duration: 0.3, ease: 'easeOut' },
                }}
              />

              {/* Inner highlight on vertical bar (3D effect) */}
              <motion.line
                x1="105"
                y1="280"
                x2="105"
                y2="50"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: { duration: 0.9, ease: smoothEase, delay: 0.1 },
                  opacity: { duration: 0.4, ease: 'easeOut', delay: 0.1 },
                }}
              />

              {/* Inner highlight on horizontal bar */}
              <motion.line
                x1="100"
                y1="275"
                x2="240"
                y2="275"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  delay: 0.35,
                  pathLength: { duration: 0.8, ease: smoothEase },
                  opacity: { duration: 0.4, ease: 'easeOut' },
                }}
              />

              {/* Glow effect that pulses */}
              <motion.g
                animate={{
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  delay: 1.0,
                  duration: 0.8,
                  ease: 'easeInOut',
                }}
              >
                <line
                  x1="100"
                  y1="280"
                  x2="100"
                  y2="50"
                  stroke="url(#lGradient)"
                  strokeWidth="24"
                  strokeLinecap="round"
                  filter="url(#glowFilter)"
                />
                <line
                  x1="100"
                  y1="280"
                  x2="240"
                  y2="280"
                  stroke="url(#lGradient)"
                  strokeWidth="24"
                  strokeLinecap="round"
                  filter="url(#glowFilter)"
                />
              </motion.g>

              {/* Corner accent - small rotating cube */}
              <motion.g
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  delay: 0.6,
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{ transformOrigin: '260px 50px' }}
              >
                <rect x="250" y="40" width="20" height="20" fill="none" stroke="url(#lGradient)" strokeWidth="1.5" />
                <line x1="250" y1="40" x2="270" y2="60" stroke="url(#lGradient)" strokeWidth="1" opacity="0.5" />
              </motion.g>
            </svg>

            {/* Text indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5, ease: 'easeOut' }}
              className="absolute top-full mt-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
            >
              <motion.div
                animate={{ width: ['0%', '30%', '60%', '90%', '100%'] }}
                transition={{
                  delay: 1.3,
                  duration: 1,
                  ease: 'easeInOut',
                }}
                className="h-0.5 bg-gradient-to-r from-amber-400 to-orange-600 rounded-full mb-3"
              />
              <motion.span
                className="text-amber-200 text-xs tracking-[0.3em] font-light uppercase"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ delay: 1.3, duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                Initializing
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
