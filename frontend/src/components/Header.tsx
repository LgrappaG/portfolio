'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }

    // Handle scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Universe', href: '/universe' },
    { label: 'Contact', href: '/contact' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/40 dark:border-slate-700/40 shadow-md'
          : 'bg-white/60 dark:bg-slate-950/60 backdrop-blur-md border-b border-slate-200/20 dark:border-slate-700/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Logo - Seamless Design */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Link
            href="/"
            className="group relative flex items-center gap-2 transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            {/* Logo Mark */}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-500 rounded-lg opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"></div>
              <span className="relative text-lg font-black italic bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                L
              </span>
            </div>
            {/* Logo Text */}
            <span className="hidden sm:inline text-base font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
              grappaG
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation - Center */}
        <motion.nav
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="hidden md:flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2"
        >
          {navItems.map((item) => (
            <motion.div key={item.href} variants={itemVariants} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={item.href}
                className="relative px-4 py-2 text-slate-600 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider transition-colors duration-300 group"
              >
                {item.label}
                <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-amber-500/0 via-amber-500 to-orange-500/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
              </Link>
            </motion.div>
          ))}
        </motion.nav>

        {/* Right Side - Dark Mode + Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 sm:gap-3"
        >
          {/* Dark Mode Toggle */}
          {mounted && (
            <motion.button
              onClick={toggleDarkMode}
              whileHover={{ scale: 1.1, rotate: 20 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-200 backdrop-blur-sm"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun size={18} className="text-amber-400 drop-shadow-lg" />
              ) : (
                <Moon size={18} className="text-slate-600 drop-shadow-lg" />
              )}
            </motion.button>
          )}

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-200 backdrop-blur-sm"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? (
              <X size={18} className="text-slate-700 dark:text-slate-300" />
            ) : (
              <Menu size={18} className="text-slate-700 dark:text-slate-300" />
            )}
          </motion.button>
        </motion.div>
      </div>

      {/* Mobile Navigation - Seamless Drawer */}
      <motion.nav
        initial={false}
        animate={{ height: isMobileOpen ? 'auto' : 0, opacity: isMobileOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="md:hidden overflow-hidden border-t border-slate-200/40 dark:border-slate-700/40"
      >
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -15 }}
                animate={isMobileOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
                transition={{ delay: index * 0.08, duration: 0.2 }}
              >
                <Link
                  href={item.href}
                  className="block px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-amber-500/10 hover:to-orange-500/10 dark:hover:from-amber-500/20 dark:hover:to-orange-500/20 rounded-lg font-semibold uppercase tracking-wider text-xs transition-all duration-200 active:scale-95"
                  onClick={() => setIsMobileOpen(false)}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.nav>
    </header>
  );
}
