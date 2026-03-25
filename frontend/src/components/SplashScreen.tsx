'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Total duration: 2.5s animation + 0.5s fade out = 3s
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Wait for fade out to complete
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        >
          <svg
            width="120"
            height="160"
            viewBox="0 0 120 160"
            className="drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 20px 40px rgba(255,255,255,0.2))' }}
          >
            {/* Vertical line of L */}
            <motion.line
              x1="30"
              y1="20"
              x2="30"
              y2="140"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { duration: 1.2, ease: 'easeInOut' },
                opacity: { duration: 0.3 },
              }}
            />

            {/* Horizontal line of L */}
            <motion.line
              x1="30"
              y1="140"
              x2="90"
              y2="140"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                delay: 0.4,
                pathLength: { duration: 1, ease: 'easeInOut' },
                opacity: { duration: 0.3 },
              }}
            />

            {/* Fill animation - vertical */}
            <motion.rect
              x="22"
              y="20"
              width="16"
              height="120"
              fill="white"
              opacity="0.3"
              initial={{ y: 140, height: 0 }}
              animate={{ y: 20, height: 120 }}
              transition={{
                duration: 1.2,
                ease: 'easeInOut',
              }}
            />

            {/* Fill animation - horizontal */}
            <motion.rect
              x="30"
              y="132"
              width="0"
              height="16"
              fill="white"
              opacity="0.3"
              initial={{ width: 0 }}
              animate={{ width: 60 }}
              transition={{
                delay: 0.4,
                duration: 1,
                ease: 'easeInOut',
              }}
            />
          </svg>

          {/* Optional: Loading text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.4 }}
            className="absolute bottom-12 text-white text-sm tracking-widest font-light"
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              LOADING
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
