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
            background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
          }}
        >
          <div className="relative">
            <svg
              width="200"
              height="240"
              viewBox="0 0 200 240"
              className="drop-shadow-2xl"
              style={{
                filter: 'drop-shadow(0 30px 60px rgba(255,255,255,0.15))',
              }}
            >
              {/* Vertical line of L - outline stroke with dash animation */}
              <motion.line
                x1="50"
                y1="200"
                x2="50"
                y2="40"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="160"
                strokeDashoffset="160"
                initial={{ strokeDashoffset: 160, opacity: 0 }}
                animate={{ strokeDashoffset: 0, opacity: 1 }}
                transition={{
                  strokeDashoffset: { duration: 1.4, ease: 'easeInOut' },
                  opacity: { duration: 0.2 },
                }}
              />

              {/* Horizontal line of L - left to right */}
              <motion.line
                x1="50"
                y1="200"
                x2="150"
                y2="200"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="100"
                strokeDashoffset="100"
                initial={{ strokeDashoffset: 100, opacity: 0 }}
                animate={{ strokeDashoffset: 0, opacity: 1 }}
                transition={{
                  delay: 0.3,
                  strokeDashoffset: { duration: 1.2, ease: 'easeInOut' },
                  opacity: { duration: 0.2 },
                }}
              />

              {/* Fill animation - vertical (bottom to top) */}
              <motion.rect
                x="46"
                y="40"
                width="8"
                height="160"
                fill="rgba(255,255,255,0.25)"
                initial={{ y: 200, height: 0 }}
                animate={{ y: 40, height: 160 }}
                transition={{
                  duration: 1.4,
                  ease: 'easeInOut',
                }}
              />

              {/* Fill animation - horizontal (left to right) */}
              <motion.rect
                x="50"
                y="196"
                width="0"
                height="8"
                fill="rgba(255,255,255,0.25)"
                initial={{ width: 0 }}
                animate={{ width: 100 }}
                transition={{
                  delay: 0.3,
                  duration: 1.2,
                  ease: 'easeInOut',
                }}
              />

              {/* Glow effect - vertical */}
              <motion.line
                x1="50"
                y1="200"
                x2="50"
                y2="40"
                stroke="rgba(100,200,255,0.3)"
                strokeWidth="8"
                strokeLinecap="round"
                opacity="0"
                initial={{ strokeDashoffset: 160, opacity: 0 }}
                animate={{
                  strokeDashoffset: [160, 0, 0],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  strokeDashoffset: { duration: 1.4, ease: 'easeInOut' },
                  opacity: { duration: 1.4, ease: 'easeInOut' },
                }}
                strokeDasharray="160"
              />

              {/* Glow effect - horizontal */}
              <motion.line
                x1="50"
                y1="200"
                x2="150"
                y2="200"
                stroke="rgba(100,200,255,0.3)"
                strokeWidth="8"
                strokeLinecap="round"
                opacity="0"
                initial={{ strokeDashoffset: 100, opacity: 0 }}
                animate={{
                  strokeDashoffset: [100, 0, 0],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  delay: 0.3,
                  strokeDashoffset: { duration: 1.2, ease: 'easeInOut' },
                  opacity: { duration: 1.2, ease: 'easeInOut' },
                }}
                strokeDasharray="100"
              />
            </svg>

            {/* Loading text with smooth pulse */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9, duration: 0.4, ease: 'easeOut' }}
              className="absolute top-full mt-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
            >
              <motion.span
                className="text-white text-sm tracking-[0.15em] font-extralight"
                animate={{ opacity: [0.4, 1, 0.4] }}
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
