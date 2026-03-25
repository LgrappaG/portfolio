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
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-lg'
          : 'bg-white dark:bg-slate-950 border-b border-slate-200/50 dark:border-slate-800/50'
      }`}
    >
      <div className="container-max container-px py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-black italic bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent transition-all hover:scale-105"
        >
          LgrappaG
        </Link>

        {/* Desktop Nav - Center */}
        <nav className="hidden md:flex gap-1 items-center">
          {navItems.map((item) => (
            <motion.div key={item.href} whileHover={{ scale: 1.05 }}>
              <Link
                href={item.href}
                className="relative px-4 py-2 text-slate-700 dark:text-slate-300 font-semibold text-sm uppercase tracking-wide transition-colors group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Right Side - Dark Mode + Mobile Menu */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Dark Mode Toggle */}
          {mounted && (
            <motion.button
              onClick={toggleDarkMode}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun size={20} className="text-amber-400" />
              ) : (
                <Moon size={20} className="text-slate-600" />
              )}
            </motion.button>
          )}

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? (
              <X size={20} className="text-slate-700 dark:text-slate-300" />
            ) : (
              <Menu size={20} className="text-slate-700 dark:text-slate-300" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Nav */}
      <motion.nav
        initial={false}
        animate={{ height: isMobileOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden"
      >
        <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="container-max container-px py-4 space-y-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isMobileOpen ? 1 : 0, x: isMobileOpen ? 0 : -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className="block px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 rounded-lg font-semibold uppercase tracking-wide text-sm transition-colors"
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
